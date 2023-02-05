import {_BestConversion, BestUnits} from 'convert'

import {ThreeViewport} from '../../components/ThreeViewport'
import Sidebar from '../../components/Sidebar/Sidebar'

import styles from './main-view.module.scss'
import {useState} from 'react'

export default function MainView() {
    const [newMeshFiles, setNewMeshFiles] = useState<File[]>([])

    type PossibleInputValueType = string | number | _BestConversion<number, BestUnits> | boolean | undefined

    function handleValueChange(values: { [key: string]: PossibleInputValueType }) {
        console.log(values)
    }

    function addMeshes(meshes: File[]) {
        setNewMeshFiles(meshes)
    }

    return <>
        <main className={styles.main}>
            <ThreeViewport className={styles.viewport} newMeshFiles={newMeshFiles}/>
            <Sidebar className={styles.sidebar} handleValueChange={handleValueChange} addMeshes={addMeshes}/>
        </main>
    </>
}
