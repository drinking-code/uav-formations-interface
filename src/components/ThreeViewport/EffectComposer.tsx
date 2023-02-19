import {HTMLAttributes, useEffect, useRef, useState} from 'react'
import {HalfFloatType, LinearFilter, RGBAFormat, WebGLRenderTarget} from 'three'
import {EffectComposer as ThreeEffectComposer} from 'three-stdlib'
import {extend, useFrame, useThree} from '@react-three/fiber'

extend({EffectComposer: ThreeEffectComposer})

export default function EffectComposer({children, show = true, priority, ...props}:
                                           { show?: boolean, priority?: number } & HTMLAttributes<any>) {
    const state = useThree()
    const composer = useRef<ThreeEffectComposer>(null!)
    const [target] = useState(() => {
        const t = new WebGLRenderTarget(state.size.width, state.size.height, {
            type: HalfFloatType,
            format: RGBAFormat,
            encoding: state.gl.outputEncoding,
            depthBuffer: true,
            stencilBuffer: false,
            anisotropy: 1,
            minFilter: LinearFilter,
            magFilter: LinearFilter
        })
        t.samples = 4
        return t
    })

    useEffect(() => {
        composer.current?.setSize(state.size.width, state.size.height)
        composer.current?.setPixelRatio(state.viewport.dpr)
    }, [state])

    useFrame(() => {
        if (show) composer.current?.render()
    }, show ? priority : 0)

    return <effectComposer ref={composer} args={[state.gl, target]}>
        {children}
    </effectComposer>
}
