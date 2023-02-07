import {HTMLAttributes, useEffect, useState} from 'react'
import {BufferGeometry, Euler, Object3D, Vector3} from 'three'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'

import GeneratedFormation from './GeneratedFormation'
import ImportedMeshes, {ImportMeshesPropsType} from './ImportedMeshes'
import {setMesh} from '../../server-communication'
import stlFromMeshes from './stl-from-meshes'

Object3D.DEFAULT_UP = new Vector3(0, 0, 1)

export default function ThreeViewport({newMeshFiles, ...props}:
                                          ImportMeshesPropsType & HTMLAttributes<HTMLElement>) {
    const [target, setTarget] = useState<Object3D | null>(null)
    const [meshes, setMeshes] = useState<BufferGeometry[]>([])

    const gridSize = 16
    const smallTileSize = .2
    const bigTileSize = 1
    const thinLinesColor = '#333'
    const thickLinesColor = '#555'

    const rotate90AlongX = new Euler(Math.PI / 2, 0, 0)

    useEffect(() => {
        const stlString = stlFromMeshes(meshes)
        setMesh(stlString)
    }, [meshes])

    return <>
        <div {...props}>
            <Canvas camera={{
                fov: 40,
                position: new Vector3(...([-6, 15, 8].map(v => v * .8))),
            }} onPointerMissed={() => setTarget(null)}>
                <gridHelper args={[gridSize, gridSize / smallTileSize, thickLinesColor, thinLinesColor]}
                            rotation={rotate90AlongX}/>
                <gridHelper args={[gridSize, gridSize / bigTileSize, thickLinesColor, thickLinesColor]}
                            rotation={rotate90AlongX}/>
                <directionalLight position={[2, 3, 3]} intensity={.5}/>
                <directionalLight position={[-2, 2, -2]} intensity={.1}/>
                <directionalLight position={[2, -2, -2]} intensity={.2}/>
                <directionalLight position={[-2, -2, 2]} intensity={.3}/>
                <ImportedMeshes newMeshFiles={newMeshFiles}
                                target={target} setTarget={setTarget}
                                meshes={meshes} setMeshes={setMeshes}/>
                <GeneratedFormation/>
                <OrbitControls makeDefault enableDamping={false}/>
            </Canvas>
        </div>
    </>
}
