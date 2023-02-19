import {HTMLAttributes, useEffect, useState} from 'react'
import {BufferGeometry, Color, Object3D, Vector3} from 'three'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'

import GeneratedFormation from './GeneratedFormation'
import ImportedMeshes, {ImportMeshesPropsType} from './ImportedMeshes'
import {setMesh} from '../../server-communication'
import stlFromMeshes from './stl-from-meshes'
import {ToggleInput} from '../ToggleInput'

import styles from './three-viewport.module.scss'
import {cl} from '../../utils/class-names'
import {Icon} from '../Icon'
import str from '../../strings'
import Grid from './Grid'

Object3D.DEFAULT_UP = new Vector3(0, 0, 1)

export default function ThreeViewport({newMeshFiles, ...props}:
                                          ImportMeshesPropsType & HTMLAttributes<HTMLElement>) {
    // const [target, setTarget] = useState<Object3D | null>(null)
    const [meshes, setMeshes] = useState<BufferGeometry[]>([])
    const formationModeState = useState<boolean>(false)
    const [formationMode] = formationModeState

    useEffect(() => {
        const stlString = stlFromMeshes(meshes)
        setMesh(stlString)
    }, [meshes])

    return <>
        <div {...props} className={cl(styles.wrapper, props.className)}>
            <ToggleInput state={formationModeState} className={styles.viewToggle} switchLabels={[
                <span className={styles.label}>
                    <Icon icon={'box'} className={styles.icon}/>
                    {str('input-labels.meshMode')}
                </span>,
                <span className={styles.label}>
                    <Icon icon={'box-dots'} className={styles.icon}/>
                    {str('input-labels.formationMode')}
                </span>
            ]}/>
            <Canvas gl={{
                antialias: !formationMode,
                autoClear: true,
                alpha: true,
            }} camera={{
                fov: 40,
                position: new Vector3(...([-6, 15, 8].map(v => v * .8))),
            }} onPointerMissed={() => /*setTarget(null)*/0}>
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

                <Grid/>
                <ImportedMeshes show={!formationMode} newMeshFiles={newMeshFiles}
                                meshes={meshes} setMeshes={setMeshes}/>
                <GeneratedFormation show={formationMode}/>
                <OrbitControls makeDefault enableDamping={false}/>
            </Canvas>
        </div>
    </>
}
