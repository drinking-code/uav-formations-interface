import {HTMLAttributes} from 'react'

import styles from './icon.module.scss'
import {cl} from '../../utils/class-names'
import {camelCase} from '../../utils/string-manipulation'

export type IconPropsType = {
    icon: string
} & HTMLAttributes<HTMLElement>

export default function Icon({icon, ...props}: IconPropsType) {
    return <>
        <div {...props} className={cl(props.className, styles.icon, styles[camelCase(icon)])}/>
    </>
}
