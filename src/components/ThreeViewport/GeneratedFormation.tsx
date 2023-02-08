import {useEffect, useRef, useState} from 'react'
import {HalfFloatType, RGBAFormat, WebGLRenderTarget} from 'three'
import {EffectComposer, RenderPass, SMAAPass, UnrealBloomPass} from 'three-stdlib'
import {extend, useFrame, useThree} from '@react-three/fiber'

import {fetchFormation, isInitialized, useServerDataMesh, useServerDataOptions} from '../../server-communication'

extend({EffectComposer, RenderPass, SMAAPass, UnrealBloomPass})

export default function GeneratedFormation({show = false}: { show: boolean }) {
    const serverDataMesh = useServerDataMesh()
    const serverDataOptions = useServerDataOptions()
    const initialized = isInitialized(serverDataMesh, serverDataOptions)

    const [points, setPoints] = useState<Array<[number, number, number]>>([])

    const state = useThree()
    const composer = useRef<EffectComposer<WebGLRenderTarget>>(null!)
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
        console.log(serverDataMesh, serverDataOptions)
        resetPoints()
        fetchFormation((receivedPointsString: string) => {
            addPoints(
                receivedPointsString.split("\n")
                    .filter(possiblePointString => possiblePointString.trim() !== '')
                    .map(pointString => pointString.split(' ')
                        .map(coordinateString => Number(coordinateString))
                    ) as Array<[number, number, number]>
            )
        })
    }, [serverDataMesh, serverDataOptions])

    useEffect(() => {
        composer.current?.setSize(state.size.width, state.size.height)
        composer.current?.setPixelRatio(state.viewport.dpr)
    }, [state])

    useFrame(() => {
        if (show) {
            composer.current?.render()
        }
    }, show ? 1 : 0)

    return <>
        {show && points.map((point) =>
            <mesh position={point} key={point.join(',')}>
                <sphereGeometry args={[serverDataOptions.uav_size as number / 2, 12, 8]}/>
                <meshStandardMaterial emissive={'#ffffff'} emissiveIntensity={4} toneMapped={false}/>
            </mesh>
        )}
        <effectComposer ref={composer} args={[state.gl, target]}>
            <renderPass attach={'passes-0'} args={[state.scene, state.camera]} enabled={show}/>
            {/* @ts-ignore */}
            <unrealBloomPass attach={'passes-1'} threshold={1} strength={.7} radius={0.9}/>
            {/* todo: strength adaptive (in relation to point distance, probably, and size) */}
        </effectComposer>
    </>

}
