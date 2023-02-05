import {HTMLAttributes, useState} from 'react'
import {Object3D, Vector3} from 'three'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'

import ImportMeshes, {ImportMeshesPropsType} from './ImportMeshes'

export default function ThreeViewport({newMeshFiles, ...props}:
                                          ImportMeshesPropsType & HTMLAttributes<HTMLElement>) {
    const [target, setTarget] = useState<Object3D | null>(null)

    const gridSize = 16
    const smallTileSize = .2
    const bigTileSize = 1
    const thinLinesColor = '#333'
    const thickLinesColor = '#555'

    return <>
        <div {...props}>
            <Canvas camera={{
                fov: 40,
                position: new Vector3(...([6, 8, 15].map(v => v * .5))),
            }} onPointerMissed={() => setTarget(null)}>
                <gridHelper args={[gridSize, gridSize / smallTileSize, thickLinesColor, thinLinesColor]}/>
                <gridHelper args={[gridSize, gridSize / bigTileSize, thickLinesColor, thickLinesColor]}/>
                <directionalLight position={[-2, 3, 3]} intensity={.5}/>
                <directionalLight position={[2, -2, 2]} intensity={.1}/>
                <directionalLight position={[-2, -2, -2]} intensity={.2}/>
                <directionalLight position={[2, 2, -2]} intensity={.3}/>
                {/*<points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach={'attributes-position'}
                            array={new Float32Array([0, 0, 0])}
                            count={1}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial size={0.1}/>
                </points>*/}
                <ImportMeshes newMeshFiles={newMeshFiles} target={target} setTarget={setTarget}/>
                <OrbitControls makeDefault enableDamping={false}/>
            </Canvas>
        </div>
    </>
}
