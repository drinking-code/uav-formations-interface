import {HTMLAttributes, ReactNode, SyntheticEvent, useState} from 'react'
import RoundDiv from 'react-round-div'

import styles from './toggle-input.module.scss'
import {cl} from '../../utils/class-names'

type ToggleInputPropsBaseType = {
    defaultValue?: boolean
    onInput?: (e: SyntheticEvent<null, CustomEvent>) => void
}

type CheckInputPropsType = {
    label: string
    switchLabels?: never
} & ToggleInputPropsBaseType

type SwitchInputPropsType = {
    label?: never
    switchLabels: [string, string] | [JSX.Element, JSX.Element]
} & ToggleInputPropsBaseType

export type ToggleInputPropsType =
    CheckInputPropsType | SwitchInputPropsType
    & Omit<HTMLAttributes<HTMLElement>, 'defaultValue'>

export default function ToggleInput(
    {defaultValue = false, label, switchLabels, onInput, ...props}: ToggleInputPropsType
) {
    const [checked, setChecked] = useState(defaultValue)


    if (switchLabels) {
        return <>
            <input type={'radio'}/>
            <input type={'radio'}/>
        </>
    } else {
        return <>
            <label className={cl(styles.toggleInput)}>
                <RoundDiv className={cl(styles.checkboxWrapper)}>
                    <input type={'checkbox'} checked={checked} onChange={() => setChecked(!checked)}
                           className={cl(styles.checkbox)}/>
                </RoundDiv>
                <span className={cl(styles.label)}>{label}</span>
            </label>
        </>
    }
}
