import {useEffect, useRef, useState} from 'react'
import {HalfFloatType, RGBAFormat, WebGLRenderTarget} from 'three'
import {EffectComposer, RenderPass, SMAAPass, UnrealBloomPass} from 'three-stdlib'
import {extend, useFrame, useThree} from '@react-three/fiber'

import {fetchFormation, useServerData} from '../../server-communication'

extend({EffectComposer, RenderPass, SMAAPass, UnrealBloomPass})

export default function GeneratedFormation() {
    const serverData = useServerData()
    const [currentMesh, setCurrentMesh] = useState<string>(null!)
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

    function addPoints(newPoints: typeof points) {
        setPoints(currentPoints => [...currentPoints, ...newPoints])
    }

    function resetPoints() {
        setPoints([])
    }

    useEffect(() => {
        if (!serverData.initialized) return
        if (currentMesh === serverData.mesh) return
        setCurrentMesh(serverData.mesh)
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
    }, [serverData])

    useEffect(() => {
        composer.current?.setSize(state.size.width, state.size.height)
        composer.current?.setPixelRatio(state.viewport.dpr)
    }, [state])

    useFrame(() => {
        composer.current?.render()
    }, 1)

    return <>
        {points.map((point) =>
            <mesh position={point} key={point.join(',')}>
                <sphereGeometry args={[serverData.options.uav_size as number / 2, 12, 8]}/>
                <meshStandardMaterial emissive={'#ffffff'} emissiveIntensity={4} toneMapped={false}/>
            </mesh>
        )}
        <effectComposer ref={composer} args={[state.gl, target]}>
            <renderPass attach={'passes-0'} args={[state.scene, state.camera]}/>
            {/* @ts-ignore */}
            <unrealBloomPass attach={'passes-1'} threshold={1} strength={.7} radius={0.9}/>
            {/* todo: strength adaptive (in relation to point distance, probably) */}
        </effectComposer>
    </>
}
