import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react'
import {BufferGeometry, DoubleSide, Euler, Mesh, Object3D, Scene as ThreeScene, Vector2} from 'three'
import {FXAAShader, MTLLoader, OBJLoader, OutlinePass, PLYLoader, RenderPass, ShaderPass, STLLoader} from 'three-stdlib'
import {extend, ThreeEvent, useThree} from '@react-three/fiber'
// import {TransformControls} from '@react-three/drei'
import convert from 'convert'

import Scene from './Scene'
import EffectComposer from './EffectComposer'

extend({OutlinePass, RenderPass, ShaderPass})

export type ImportMeshesPropsType = {
    newMeshFiles: File[]
}

export default function ImportedMeshes({show, newMeshFiles, target, setTarget, meshes, setMeshes}:
                                           ImportMeshesPropsType &
                                           { show?: boolean } &
                                           { target?: Object3D | null, setTarget?: Dispatch<SetStateAction<Object3D | null>> } &
                                           { meshes: BufferGeometry[], setMeshes: Dispatch<SetStateAction<BufferGeometry[]>> }) {
    const scene = useRef<ThreeScene>(null!)
    const state = useThree()
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

    useEffect(() => {
        function keydownHandler(e: KeyboardEvent) {
            if (e.key !== 'Backspace') return
            removeMesh()
        }

        function removeMesh() {
            if (!target) return
            // @ts-ignore TS2339: Property 'geometry' does not exist on type 'Object3D '.
            const index = meshes.indexOf(target.geometry)
            if (index === -1) return
            const meshesCopy = [...meshes]
            meshesCopy.splice(index, 1)
            setMeshes(meshesCopy)
            if (setTarget)
                setTarget(null)
        }

        window.addEventListener('keydown', keydownHandler)
        return () => {
            window.removeEventListener('keydown', keydownHandler)
        }
    }, [target, meshes])

    return <>
        <Scene ref={scene}>
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
            <EffectComposer show={show}>
                <renderPass attach={'passes-0'} scene={scene.current} camera={state.camera} enabled={show}/>
                {/* @ts-ignore */}
                <outlinePass attach={'passes-1'} selectedObjects={[target].filter(v => v)}
                             args={[new Vector2(state.size.width, state.size.height), state.scene, state.camera]}
                             visibleEdgeColor={'#4b8ec5'} edgeStrength={8} edgeThickness={2} edgeGlow={0}/>
                <shaderPass attach={'passes-2'} args={[FXAAShader]}
                            uniforms-resolution-value={[1 / state.size.width, 1 / state.size.height]}/>
            </EffectComposer>
        </Scene>
    </>
}
