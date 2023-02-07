import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {BufferGeometry, DoubleSide, Object3D} from 'three'
import {MTLLoader, OBJLoader, PLYLoader, STLLoader} from 'three-stdlib'
import {ThreeEvent} from '@react-three/fiber'
import {TransformControls} from '@react-three/drei'

export type ImportMeshesPropsType = {
    newMeshFiles: File[]
}

export default function ImportedMeshes({newMeshFiles, target, setTarget, meshes, setMeshes}:
                                         ImportMeshesPropsType &
                                         { target: Object3D | null, setTarget: Dispatch<SetStateAction<Object3D | null>> } &
                                         { meshes: BufferGeometry[], setMeshes: Dispatch<SetStateAction<BufferGeometry[]>> }) {
    const [meshFiles, setMeshFiles] = useState<File[]>([])

    const loaders = {
        '.stl': STLLoader,
        '.ply': PLYLoader,
        '.obj': OBJLoader,
        // '.mtl': MTLLoader,
    }

    function clickHandler(e: ThreeEvent<MouseEvent>) {
        setTarget(e.object)
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
                if (geometry instanceof BufferGeometry) {
                    setMeshes([...meshes, geometry])
                }
            })
            if (meshFile.name.endsWith('.obj'))
                reader.readAsText(meshFile)
            else
                reader.readAsArrayBuffer(meshFile)
        }
        setMeshFiles([...meshFiles, ...newMeshFiles])
    }, [newMeshFiles])

    // @ts-ignore
    return <>
        {meshes.map(geometry =>
            <mesh geometry={geometry}
                  onClick={clickHandler}
                  key={geometry.id}>
                <meshStandardMaterial side={DoubleSide}/>
            </mesh>
        )}
        {target && <TransformControls object={target} mode={'translate'}/>}
    </>
}
