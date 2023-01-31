import {ThreeViewport} from '../../components/ThreeViewport'
import Sidebar from '../../components/Sidebar/Sidebar'

import styles from './main-view.module.scss'

export default function MainView() {
    return <>
        <main className={styles.main}>
            <ThreeViewport className={styles.viewport}/>
            <Sidebar className={styles.sidebar}/>
        </main>
    </>
}
