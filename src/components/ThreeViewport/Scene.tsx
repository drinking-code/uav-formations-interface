import {ForwardedRef, forwardRef, HTMLAttributes, MutableRefObject, useRef} from 'react'
import {Scene as ThreeScene} from 'three'
import {useFrame, useThree} from '@react-three/fiber'

const Scene = forwardRef(({priority = 2, children, ...props}: { priority?: number } & HTMLAttributes<any>,
                          scene: ForwardedRef<ThreeScene>) => {
    const externalScene = !!scene
    scene ??= useRef<ThreeScene>(null!)
    const {gl, camera} = useThree((state) => {
        return {
            gl: state.gl,
            camera: state.camera,
        }
    })

    if (!externalScene)
        useFrame(() => {
            gl.autoClear = false
            gl.clearDepth()
            gl.render((scene as MutableRefObject<ThreeScene>).current, camera)
        }, priority)

    return <>
        <scene ref={scene}>
            {children}
        </scene>
    </>
})

export default Scene
