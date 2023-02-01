import {HTMLAttributes, SyntheticEvent} from 'react'
import RoundDiv from 'react-round-div'

import styles from './number-input.module.scss'
import {cl} from '../../utils/class-names'

// maps the letters (units) to multiplication factors
export interface Units {
    [letter: string]: number
}

type NumberInputPropsType = {
    defaultValue?: number,
    units: Units
} & HTMLAttributes<HTMLElement>

export default function NumberInput({defaultValue = 0, units, ...props}: NumberInputPropsType) {
    function convert(e: SyntheticEvent) {
        console.log(e)
    }

    return <RoundDiv {...props} className={cl(props.className, styles.numberInput)}>
        <div className={styles.innerWrapper}>
            <button className={cl(styles.button, styles.subtract)}>-</button>
            <input  className={cl(styles.input)} type={'text'} onInput={convert}/>
            <button className={cl(styles.button, styles.add)}>+</button>
        </div>
    </RoundDiv>
}

export const lengthUnits: Units = {
    mm: 1e-3,
    cm: 1e-2,
    dm: 1e-1,
    m: 1,
    km: 1e+3,
} // todo: imperial
