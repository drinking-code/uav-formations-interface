import {_BestConversion, BestUnits} from 'convert'

import {ThreeViewport} from '../../components/ThreeViewport'
import Sidebar from '../../components/Sidebar/Sidebar'

import styles from './main-view.module.scss'

export default function MainView() {
    type PossibleInputValueType = string | number | _BestConversion<number, BestUnits> | boolean | File[] | undefined

    function handleValueChange(values: { [key: string]: PossibleInputValueType }) {
        console.log(values)
    }

    return <>
        <main className={styles.main}>
            <ThreeViewport className={styles.viewport}/>
            <Sidebar className={styles.sidebar} handleValueChange={handleValueChange}/>
        </main>
    </>
}
