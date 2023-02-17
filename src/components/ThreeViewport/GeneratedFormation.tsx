import {useEffect, useRef, useState} from 'react'
import {DataTexture, Euler, HalfFloatType, RGBAFormat, Vector3, WebGLRenderTarget} from 'three'
import {EffectComposer, RenderPass, SMAAPass, UnrealBloomPass} from 'three-stdlib'
import {extend, useFrame, useThree} from '@react-three/fiber'

import {fetchFormation, isInitialized, useServerDataMesh, useServerDataOptions} from '../../server-communication'
import generateDirectionalityTexture from './generate-directionality-texture'
import yawPitchFromDirection from '../../utils/yaw-pitch-from-direction'

extend({EffectComposer, RenderPass, SMAAPass, UnrealBloomPass})

export type PointPositionType = [number, number, number]
export type DirectionVectorType = [number, number, number]
export type PointDataType = [PointPositionType, DirectionVectorType, DataTexture] | [PointPositionType]

export default function GeneratedFormation({show = false}: { show: boolean }) {
    const serverDataMesh = useServerDataMesh()
    const serverDataOptions = useServerDataOptions()
    const initialized = isInitialized(serverDataMesh, serverDataOptions)

    const [points, setPoints] = useState<Array<PointDataType>>([])

    const state = useThree()
    const composer = useRef<EffectComposer>(null!)
    const [target] = useState(() => {
        const t = new WebGLRenderTarget(state.size.width, state.size.height, {
            type: HalfFloatType,
            format: RGBAFormat,
            encoding: state.gl.outputEncoding,
            depthBuffer: true,
            stencilBuffer: false,
            anisotropy: 1,
        })
        t.samples = 8
        return t
    })

    const addPoints = (newPoints: typeof points) => setPoints(currentPoints => [...currentPoints, ...newPoints])
    const resetPoints = () => setPoints([])

    useEffect(() => {
        if (!initialized) return
        resetPoints()
        const controller = new AbortController()
        const signal = controller.signal
        fetchFormation(async (receivedPointsString: string) => {
            const data = await Promise.all(receivedPointsString.split("\n")
                .filter(possiblePointString => possiblePointString.trim() !== '')
                .map(async pointString => {
                    const splitPointData = pointString.split(' ')
                        .map(coordinateString => Number(coordinateString))
                    if (splitPointData.length === 3)
                        return [splitPointData]
                    const position = splitPointData.slice(0, 3)
                    const directionalityAngles = splitPointData.slice(-2)
                    const directionalityVector = splitPointData.slice(3, 6)
                    return [
                        position,
                        directionalityVector,
                        await generateDirectionalityTexture(directionalityAngles[0], directionalityAngles[1], 0)
                    ]
                })) as Array<PointDataType>

            addPoints(data)
        }, signal)
        return () => {
            controller.abort()
        }
    }, [serverDataMesh, serverDataOptions])

    useEffect(() => {
        composer.current?.setSize(state.size.width, state.size.height)
        composer.current?.setPixelRatio(state.viewport.dpr)
    }, [state])

    useFrame(() => {
        if (show) composer.current?.render()
    }, show ? 1 : 0)

    return <>
        {show && points.map(([point, direction, texture]) => {
            let rotation
            const noDirection = !direction || direction.length !== 3
            if (!noDirection) {
                const [yaw, pitch] = yawPitchFromDirection(direction)
                rotation = new Euler(0, pitch, yaw)
                rotation.order = 'ZYX'
            }

            return <mesh position={new Vector3(...point)} key={point.join(',')}
                         rotation={!noDirection ? rotation : undefined}>
                <sphereGeometry args={[serverDataOptions.uav_size as number / 2, 12, 8]}/>
                <meshStandardMaterial color={'#000'} emissive={'#fff'} emissiveIntensity={!!texture ? 8 : 4}
                                      toneMapped={false} emissiveMap={texture}/>
            </mesh>
        })}
        <effectComposer ref={composer} args={[state.gl, target]}>
            <renderPass attach={'passes-0'} args={[state.scene, state.camera]} enabled={show}/>
            {/* @ts-ignore */}
            <unrealBloomPass attach={'passes-2'} threshold={1} strength={.7} radius={0.9}/>
            {/* todo: strength adaptive (in relation to point distance, probably, and size) */}
        </effectComposer>
    </>

}
