import React, {HTMLAttributes, useEffect, useState} from 'react'
import {AmbientLight, ColorRepresentation, DirectionalLight, Mesh, MeshStandardMaterial, Vector3} from 'three'
import {MTLLoader, OBJLoader, PLYLoader, STLLoader} from 'three-stdlib'
import {Canvas, useThree} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'

type ImportMeshesPropsType = {
    newMeshFiles: File[]
}

export default function ThreeViewport({newMeshFiles, ...props}:
                                          ImportMeshesPropsType & HTMLAttributes<HTMLElement>) {
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
            }}>
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
                <ImportMeshes newMeshFiles={newMeshFiles}/>
                <OrbitControls makeDefault enableDamping={false}/>
            </Canvas>
        </div>
    </>
}

function ImportMeshes({newMeshFiles}: ImportMeshesPropsType) {
    const [meshFiles, setMeshFiles] = useState<File[]>([])
    const threeState = useThree()

    const loaders = {
        '.stl': STLLoader,
        '.ply': PLYLoader,
        '.obj': OBJLoader,
        // '.mtl': MTLLoader,
    }

    useEffect(() => {
        for (const meshFile of newMeshFiles) {
            const reader = new FileReader()
            reader.addEventListener('load', (e: ProgressEvent) => {
                if (!e.target) return
                const contents = (e.target as FileReader).result
                if (!contents) return
                const loaderEntry = Array.from(Object.entries(loaders))
                    .find(([suffix]) => meshFile.name.endsWith(suffix))
                if (!loaderEntry) return
                const Loader = loaderEntry[1]
                // @ts-ignore TS2345: Argument of type 'string | ArrayBuffer' is not assignable to parameter of type 'string'.
                // Type 'ArrayBuffer' is not assignable to type 'string'.
                const geometry = (new Loader()).parse(contents)
                // geometry.sourceType = "stl"
                // geometry.sourceFile = file.name
                const material = new MeshStandardMaterial()
                const mesh = new Mesh(geometry, material)
                threeState.scene.add(mesh)
            })
            if (meshFile.name.endsWith('.obj'))
                reader.readAsText(meshFile)
            else
                reader.readAsArrayBuffer(meshFile)
        }
        setMeshFiles([...meshFiles, ...newMeshFiles])
    }, [newMeshFiles])

    return <></>
}
