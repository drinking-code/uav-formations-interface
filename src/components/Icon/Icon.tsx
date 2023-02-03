import {HTMLAttributes} from 'react'

import styles from './icon.module.scss'
import {cl} from '../../utils/class-names'

export type MeshInputPropsType = {
    icon: string
} & HTMLAttributes<HTMLElement>

export default function MeshInput({icon, ...props}: MeshInputPropsType) {
    return <>
        <div {...props} className={cl(props.className, styles.icon, styles[icon])}/>
    </>
}
