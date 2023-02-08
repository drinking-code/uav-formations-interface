import {Dispatch, HTMLAttributes, SetStateAction, SyntheticEvent, useState} from 'react'
import RoundDiv from 'react-round-div'

import {createFakeSyntheticEvent} from '../../utils/fake-synthetic-event'

import switchStyles from './switch-input.module.scss'
import checkStyles from './check-input.module.scss'
import {cl} from '../../utils/class-names'

type ToggleInputPropsBaseType = {
    defaultValue?: boolean
    name?: string
    invert?: boolean
    onInput?: (e: SyntheticEvent<null, CustomEvent>) => void
    state?: [boolean, Dispatch<SetStateAction<boolean>>]
    className?: string
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
    {defaultValue = false, label, switchLabels, name, onInput, invert = false, state, ...props}:
        ToggleInputPropsType & Omit<HTMLAttributes<HTMLElement>, 'defaultValue'>
) {
    function xor(a: boolean, b: boolean): boolean {
        return Boolean(a !== b)
    }

    const [checked, setChecked] = state ?? useState<boolean>(defaultValue)

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
            <fieldset {...props} className={cl(switchStyles.wrapper, props.className)}>
                <RoundDiv className={cl(switchStyles.selector, xor(checked, invert) && switchStyles.right)}/>
                <label className={switchStyles.switchInput}>
                    <input type={'radio'} checked={xor(!checked, invert)} onChange={() => setValue(xor(false, invert))}
                           className={switchStyles.radio}/>
                    <span className={switchStyles.label}>{switchLabels[0]}</span>
                </label>
                <label className={switchStyles.switchInput}>
                    <input type={'radio'} checked={xor(checked, invert)} onChange={() => setValue(xor(true, invert))}
                           className={switchStyles.radio}/>
                    <span className={switchStyles.label}>{switchLabels[1]}</span>
                </label>
            </fieldset>
        </>
    } else {
        return <>
            <label {...props} className={cl(checkStyles.checkInput, props.className)}>
                <RoundDiv className={checkStyles.checkboxWrapper}>
                    <input type={'checkbox'} checked={xor(checked, invert)} onChange={() => setValue(!checked)}
                           className={checkStyles.checkbox}/>
                </RoundDiv>
                <span className={checkStyles.label}>{label}</span>
            </label>
        </>
    }
}
