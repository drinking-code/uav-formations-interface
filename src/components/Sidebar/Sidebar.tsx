import {HTMLAttributes, SyntheticEvent, useState} from 'react'

import inputs from './inputs'

import {MeshInputPropsType} from '../MeshInput'
import {NumberInput, NumberInputPropsType} from '../NumberInput'
import {ToggleInputPropsType} from '../ToggleInput'
import {ColorInputPropsType} from '../ColorInput'
import {InputGroup} from '../InputGroup'

import styles from './sidebar.module.scss'
import {cl} from '../../utils/class-names'

type inputDataType = typeof inputs[number][number]
type inputNameType = inputDataType['name']
type inputValueType = inputDataType['defaultValue']

type SidebarPropsType = {
    handleValueChange?: (values: { [key: inputNameType]: inputValueType }) => void
} & HTMLAttributes<HTMLElement>

export default function Sidebar({handleValueChange, ...props}: SidebarPropsType) {
    const [values, setValues] = useState(
        Object.fromEntries(inputs.flat().map(input => [input.name, input.defaultValue]))
    )

    function handleInputs(e: SyntheticEvent<null, CustomEvent>) {
        const data = e.nativeEvent.detail
        setValues(currentValues => {
            currentValues[data.target.name] = data.target.value
            return currentValues
        })
        if (handleValueChange)
            handleValueChange(values)
    }

    type GenericInputPropsType =
        MeshInputPropsType | NumberInputPropsType | ToggleInputPropsType | ColorInputPropsType

    return <>
        <div {...props} className={cl(styles.sidebar, props.className)}>
            {inputs.map((inputGroup, index) => <InputGroup key={index}>
                {inputGroup.map((input: inputDataType): JSX.Element => {
                    const InputComponent: (props: GenericInputPropsType) => JSX.Element =
                        input.type as (props: GenericInputPropsType) => JSX.Element
                    const props: GenericInputPropsType & {
                        defaultValue?: string | number | boolean,
                        noUnits?: boolean,
                        step?: number,
                        alwaysRoundToPlace?: number
                    } /* ???? */ = {
                        name: input.name,
                        defaultValue: input.defaultValue,
                        step: input.step,
                        alwaysRoundToPlace: input.alwaysRoundToPlace,
                        noUnits: InputComponent.name === NumberInput.name
                            ? typeof input.defaultValue === 'number'
                            : undefined
                    }
                    if (input.label) {
                        if (typeof input.label === 'string')
                            props.label = input.label
                        else if (Array.isArray(input.label))
                            (props as ToggleInputPropsType).switchLabels = input.label
                    }
                    for (const propsKey in props) {
                        if (props[propsKey as keyof typeof props] === undefined)
                            delete props[propsKey as keyof typeof props]
                    }
                    return <InputComponent key={input.name} {...props} onInput={handleInputs}/>
                })}
            </InputGroup>)}
        </div>
    </>
}
