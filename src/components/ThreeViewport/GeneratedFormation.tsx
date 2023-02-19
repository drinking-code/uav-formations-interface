import {useEffect, useMemo, useRef, useState} from 'react'
import {DataTexture, Euler, Scene as ThreeScene, SphereGeometry, Vector3} from 'three'
import {FXAAShader, RenderPass, ShaderPass, SMAAPass, UnrealBloomPass} from 'three-stdlib'
import {extend, useThree} from '@react-three/fiber'

import {fetchFormation, isInitialized, useServerDataMesh, useServerDataOptions} from '../../server-communication'
import generateDirectionalityTexture from './generate-directionality-texture'
import yawPitchFromDirection from '../../utils/yaw-pitch-from-direction'

import EffectComposer from './EffectComposer'
import Scene from './Scene'

extend({RenderPass, ShaderPass, SMAAPass, UnrealBloomPass})

export type PointPositionType = [number, number, number]
export type DirectionVectorType = [number, number, number]
export type PointDataType = [PointPositionType, DirectionVectorType, DataTexture] | [PointPositionType]

export default function GeneratedFormation({show = false}: { show: boolean }) {
    const scene = useRef<ThreeScene>(null!)
    const serverDataMesh = useServerDataMesh()
    const serverDataOptions = useServerDataOptions()
    const initialized = isInitialized(serverDataMesh, serverDataOptions)
    const uavMesh = useMemo(
        () => new SphereGeometry(serverDataOptions?.uav_size as number / 2, 12, 8),
        [serverDataOptions]
    )

    const [points, setPoints] = useState<Array<PointDataType>>([])

    const state = useThree()

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
                    if (splitPointData.length === 3) return [splitPointData]
                    const position = splitPointData.slice(0, 3)
                    const directionalityAngles = splitPointData.slice(-2)
                    const directionalityVector = splitPointData.slice(3, 6)
                    return [position, directionalityVector,
                        await generateDirectionalityTexture(
                            directionalityAngles[0],
                            directionalityAngles[1],
                            serverDataOptions.illumination_directionality_bleed as number
                        )]
                })) as Array<PointDataType>

            addPoints(data)
        }, signal)
        return () => {
            controller.abort()
        }
    }, [serverDataMesh, serverDataOptions])

    const effectiveBleed = serverDataOptions?.illumination_directionality as boolean
        ? (serverDataOptions?.illumination_directionality_bleed as number ?? 0)
        : 1

    return <>
        <Scene ref={scene}>
            {show && <color attach="background" args={['#4a4a4a']}/>}
            {show && points.map(([point, direction, texture]) => {
                let rotation
                const noDirection = !direction || direction.length !== 3
                if (!noDirection) {
                    const [yaw, pitch] = yawPitchFromDirection(direction)
                    rotation = new Euler(0, pitch, yaw)
                    rotation.order = 'ZYX'
                }

                return <mesh geometry={uavMesh} key={point.join(',')}
                             position={new Vector3(...point)} rotation={!noDirection ? rotation : undefined}>
                    <meshStandardMaterial color={'#000'} emissive={'#fff'} emissiveIntensity={1 - effectiveBleed * .3}
                                          toneMapped={false} emissiveMap={texture}/>
                </mesh>
            })}
            {/*<mesh>
                <boxGeometry args={[3, 3, 3]}/>
                <meshBasicMaterial color={'#fff'} wireframe={true}/>
            </mesh>*/}
            <EffectComposer show={show}>
                <renderPass attach={'passes-0'} scene={scene.current} camera={state.camera} enabled={show}/>
                {/* @ts-ignore */}
                <unrealBloomPass attach={'passes-1'} threshold={0.1} strength={1.3} radius={.9}/>
                {/* todo: strength adaptive (in relation to point distance, probably, and size) */}
                {/* @ts-ignore */}
                <sMAAPass attach={'passes-2'} args={[
                    state.size.width * state.viewport.dpr,
                    state.size.height * state.viewport.dpr
                ]} unbiased={false}/>
            </EffectComposer>
        </Scene>
    </>

}
