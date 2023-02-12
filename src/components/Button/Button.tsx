import {HTMLAttributes} from 'react'
import RoundDiv from 'react-round-div'

import styles from './button.module.scss'
import {cl} from '../../utils/class-names'

export type ButtonPropsType = {
    label: string
}

export default function Button({label, ...props}: ButtonPropsType & HTMLAttributes<HTMLElement>) {
    return <>
        <RoundDiv {...props} className={cl(props.className, styles.buttonWrapper)}>
            <button className={styles.button}>
                {label}
            </button>
        </RoundDiv>
    </>
}
