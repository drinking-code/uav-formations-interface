import {HTMLAttributes, SyntheticEvent, useState} from 'react'
import RoundDiv from 'react-round-div'

import {createFakeSyntheticEvent} from '../../utils/fake-synthetic-event'

import switchStyles from './switch-input.module.scss'
import checkStyles from './check-input.module.scss'
import {cl} from '../../utils/class-names'

type ToggleInputPropsBaseType = {
    defaultValue?: boolean
    name?: string
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

export default function ToggleInput(
    {defaultValue = false, label, switchLabels, name, onInput, ...props}:
        ToggleInputPropsType & Omit<HTMLAttributes<HTMLElement>, 'defaultValue'>
) {
    const [checked, setChecked] = useState<boolean>(defaultValue)

    function setValue(newValue: typeof checked) {
        setChecked(newValue)
        fireOnInput(newValue)
    }

    function fireOnInput(newValue: typeof checked) {
        if (!onInput) return
        const customInputEvent = new CustomEvent('input', {
            detail: {
                target: {
                    name: name,
                    value: newValue
                }
            }
        })
        const customSyntheticInputEvent = createFakeSyntheticEvent<any, typeof customInputEvent>(customInputEvent)
        onInput(customSyntheticInputEvent)
    }

    if (switchLabels) {
        return <>
            <fieldset className={switchStyles.wrapper}>
                <RoundDiv className={cl(switchStyles.selector, checked && switchStyles.right)}/>
                <label className={switchStyles.switchInput}>
                    <input type={'radio'} checked={!checked} onChange={() => setValue(false)}
                           className={switchStyles.radio}/>
                    <span className={switchStyles.label}>{switchLabels[0]}</span>
                </label>
                <label className={switchStyles.switchInput}>
                    <input type={'radio'} checked={checked} onChange={() => setValue(true)}
                           className={switchStyles.radio}/>
                    <span className={switchStyles.label}>{switchLabels[1]}</span>
                </label>
            </fieldset>
        </>
    } else {
        return <>
            <label className={checkStyles.checkInput}>
                <RoundDiv className={checkStyles.checkboxWrapper}>
                    <input type={'checkbox'} checked={checked} onChange={() => setValue(!checked)}
                           className={checkStyles.checkbox}/>
                </RoundDiv>
                <span className={checkStyles.label}>{label}</span>
            </label>
        </>
    }
}
