import {Euler, Scene} from 'three'
import {useRef} from 'react'
import {useFrame, useThree} from '@react-three/fiber'
import {PointMaterial} from '@react-three/drei'

export default function Grid() {
    const scene = useRef<Scene>(null!)
    const {gl, camera} = useThree((state) => {
        return {
            gl: state.gl,
            camera: state.camera,
        }
    })

    const gridSize = 16
    const smallTileSize = .2
    const bigTileSize = 1
    const thinLinesColor = /*formationMode ? '#7a7a7a' : */'#333'
    const thickLinesColor = /*formationMode ? '#9c9c9c' : */'#555'

    const rotate90AlongX = new Euler(Math.PI / 2, 0, 0)

    useFrame(() => {
        gl.autoClear = false
        gl.clearDepth()
        gl.render(scene.current, camera)
    }, 2)

    return <>
        <scene ref={scene}>
            <gridHelper args={[gridSize, gridSize / smallTileSize, thickLinesColor, thinLinesColor]}
                        rotation={rotate90AlongX}/>
            <gridHelper args={[gridSize, gridSize / bigTileSize, thickLinesColor, thickLinesColor]}
                        rotation={rotate90AlongX}/>

            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach={'attributes-position'}
                        array={new Float32Array([0, 0, 0])}
                        count={1}
                        itemSize={3}
                    />
                </bufferGeometry>
                <PointMaterial transparent color={'#4b8ec5'} size={4} sizeAttenuation={false}/>
            </points>
        </scene>
    </>
}
