import {useState} from 'react'
import convert, {_BestConversion, BestUnits, Length} from 'convert'

import {ThreeViewport} from '../../components/ThreeViewport'
import Sidebar from '../../components/Sidebar/Sidebar'

import styles from './main-view.module.scss'

export default function MainView() {
    const [newMeshFiles, setNewMeshFiles] = useState<File[]>([])

    type PossibleInputValueType = string | number | _BestConversion<number, BestUnits> | boolean | undefined

    function handleValueChange(values: { [key: string]: PossibleInputValueType }) {
        // normalise length units to scale currently used in the viewport / by mesh
        const meshScaleUnit = 'meter'
        values = Object.fromEntries(
            Array.from(Object.entries(values))
                .map(([key, inputValue]) => {
                    function isBestConversionResult(value:any): value is _BestConversion<number, BestUnits>{
                        return value.constructor === {}.constructor &&
                            typeof value.quantity === 'number' &&
                            typeof value.unit === 'string'
                    }
                    if (isBestConversionResult(inputValue)) {
                        try {
                            // @ts-ignore
                            inputValue = convert(inputValue.quantity, inputValue.unit).to(meshScaleUnit)
                        } catch (err) {
                            // inputValue.unit is not in length family
                            inputValue = inputValue.quantity
                            // todo: normalise (convert) angles to degrees
                        }
                    }
                    return [key, inputValue]
                })
        )
        console.table(values)
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
