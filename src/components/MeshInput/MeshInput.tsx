import {HTMLAttributes} from 'react'
import RoundDiv from 'react-round-div'

import {Icon} from '../Icon'

import styles from './mesh-input.module.scss'
import {cl} from '../../utils/class-names'
import str from '../../strings'

export type MeshInputPropsType = {
    label?: string
} & HTMLAttributes<HTMLElement>

export default function MeshInput({label, ...props}: MeshInputPropsType) {
    return <>
        {label && <label className={styles.label}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.meshInput)}>
            <div className={styles.innerWrapper}>
                <Icon icon={'box'} className={styles.icon}/>
                {str('input-labels.meshFile')}
            </div>
        </RoundDiv>
    </>
}
