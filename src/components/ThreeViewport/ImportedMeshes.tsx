import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {BufferGeometry, DoubleSide, Euler, Object3D} from 'three'
import {MTLLoader, OBJLoader, PLYLoader, STLLoader} from 'three-stdlib'
import {ThreeEvent} from '@react-three/fiber'
// import {TransformControls} from '@react-three/drei'
import convert from 'convert'
import Scene from './Scene'

export type ImportMeshesPropsType = {
    newMeshFiles: File[]
}

export default function ImportedMeshes({show, newMeshFiles, setTarget, meshes, setMeshes}:
                                           ImportMeshesPropsType &
                                           { show?: boolean } &
                                           { target?: Object3D | null, setTarget?: Dispatch<SetStateAction<Object3D | null>> } &
                                           { meshes: BufferGeometry[], setMeshes: Dispatch<SetStateAction<BufferGeometry[]>> }) {
    const [meshFiles, setMeshFiles] = useState<File[]>([])

    const loaders = {
        '.stl': STLLoader,
        '.ply': PLYLoader,
        '.obj': OBJLoader,
        // '.mtl': MTLLoader,
    }

    function clickHandler(e: ThreeEvent<MouseEvent>) {
        if (setTarget)
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
                    geometry.rotateZ(convert(180, 'deg').to('rad'))
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

    if (show)
        return <>
            <Scene>
                <directionalLight position={[2, 3, 3]} intensity={.3}/>

                <directionalLight position={[-2, 2, 1]} intensity={.02}/>
                <directionalLight position={[-2, 2, -1]} intensity={.03}/>
                <directionalLight position={[-1, 4, -4]} intensity={.01}/>
                <directionalLight position={[1, 2, -3]} intensity={.03}/>

                <directionalLight position={[-2, -4, -1]} intensity={.05}/>
                <directionalLight position={[2, -4, 1]} intensity={.05}/>
                <directionalLight position={[2, -4, -1]} intensity={.05}/>
                <directionalLight position={[-2, -4, 1]} intensity={.05}/>

                <ambientLight intensity={.05}/>

                {meshes.map(geometry =>
                    <mesh geometry={geometry} rotation={new Euler(0, 0, 0)}
                          onClick={clickHandler}
                          key={geometry.id}>
                        <meshStandardMaterial side={DoubleSide}/>
                    </mesh>
                )}
                {/*todo: {target && <TransformControls object={target} mode={'translate'}/>}*/}
            </Scene>
        </>
    else return <></>
}
