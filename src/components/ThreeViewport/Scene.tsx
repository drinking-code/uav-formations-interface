import {HTMLAttributes, useRef} from 'react'
import {Scene as ThreeScene} from 'three'
import {useFrame, useThree} from '@react-three/fiber'

export default function Scene({priority=2, children, ...props}: {priority?: number} & HTMLAttributes<any>) {
    const scene = useRef<ThreeScene>(null!)
    const {gl, camera} = useThree((state) => {
        return {
            gl: state.gl,
            camera: state.camera,
        }
    })

    useFrame(() => {
        gl.autoClear = false
        gl.clearDepth()
        gl.render(scene.current, camera)
    }, priority)

    return <>
        <scene ref={scene}>
            {children}
        </scene>
    </>
}
