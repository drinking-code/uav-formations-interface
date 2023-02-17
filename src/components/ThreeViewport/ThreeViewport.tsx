import {HTMLAttributes, useEffect, useState} from 'react'
import {BufferGeometry, Euler, Object3D, Vector3} from 'three'
import {Canvas} from '@react-three/fiber'
import {OrbitControls, Point, PointMaterial} from '@react-three/drei'

import GeneratedFormation from './GeneratedFormation'
import ImportedMeshes, {ImportMeshesPropsType} from './ImportedMeshes'
import {setMesh} from '../../server-communication'
import stlFromMeshes from './stl-from-meshes'
import {ToggleInput} from '../ToggleInput'

import styles from './three-viewport.module.scss'
import {cl} from '../../utils/class-names'
import {Icon} from '../Icon'
import str from '../../strings'

Object3D.DEFAULT_UP = new Vector3(0, 0, 1)

export default function ThreeViewport({newMeshFiles, ...props}:
                                          ImportMeshesPropsType & HTMLAttributes<HTMLElement>) {
    // const [target, setTarget] = useState<Object3D | null>(null)
    const [meshes, setMeshes] = useState<BufferGeometry[]>([])
    const formationModeState = useState<boolean>(true)
    const [formationMode] = formationModeState

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
            <Canvas camera={{
                fov: 40,
                position: new Vector3(...([-6, 15, 8].map(v => v * .8))),
            }} onPointerMissed={() => /*setTarget(null)*/0}>
                {formationMode && <color attach="background" args={['#222']}/>}
                <gridHelper args={[gridSize, gridSize / smallTileSize, thickLinesColor, thinLinesColor]}
                            rotation={rotate90AlongX}/>
                <gridHelper args={[gridSize, gridSize / bigTileSize, thickLinesColor, thickLinesColor]}
                            rotation={rotate90AlongX}/>
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

                <ImportedMeshes show={!formationMode} newMeshFiles={newMeshFiles}
                                meshes={meshes} setMeshes={setMeshes}/>
                <GeneratedFormation show={formationMode}/>
                <OrbitControls makeDefault enableDamping={false}/>
            </Canvas>
        </div>
    </>
}
