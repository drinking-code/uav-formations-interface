import {HTMLAttributes} from 'react'

import styles from './sidebar.module.scss'
import {cl} from '../../utils/class-names'

export default function Sidebar(props: HTMLAttributes<HTMLElement>) {
    return <>
        <div {...props} className={cl(styles.sidebar, props.className)}>
            SIDEBAR
        </div>
    </>
}
