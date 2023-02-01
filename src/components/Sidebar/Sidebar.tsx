import {HTMLAttributes} from 'react'

import {lengthUnits, NumberInput} from '../NumberInput'

import styles from './sidebar.module.scss'
import {cl} from '../../utils/class-names'

export default function Sidebar(props: HTMLAttributes<HTMLElement>) {
    return <>
        <div {...props} className={cl(styles.sidebar, props.className)}>
            <NumberInput units={lengthUnits}/>
        </div>
    </>
}
