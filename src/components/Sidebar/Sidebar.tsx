import {HTMLAttributes, SyntheticEvent, useEffect, useState} from 'react'
import {_BestConversion, BestUnits} from 'convert'

import inputs from './inputs'

import {MeshInput, MeshInputPropsType} from '../MeshInput'
import {NumberInput, NumberInputPropsType} from '../NumberInput'
import {ToggleInput, ToggleInputPropsType} from '../ToggleInput'
import {ColorInput, ColorInputPropsType, toHexColor} from '../ColorInput'
import {InputGroup} from '../InputGroup'

import styles from './sidebar.module.scss'
import {cl} from '../../utils/class-names'
import {parseNumberString} from '../../utils/parse-number-string'
import str from '../../strings'

type inputDataType = typeof inputs[number][number]
type inputNameType = inputDataType['name']
type inputValueType = inputDataType['defaultValue'] | _BestConversion<number, BestUnits>

type SidebarPropsType = {
    handleValueChange?: (values: { [key: inputNameType]: inputValueType }) => void
    addMeshes?: (meshes: File[]) => void
} & HTMLAttributes<HTMLElement>

export default function Sidebar({handleValueChange, addMeshes, ...props}: SidebarPropsType) {
    const [values, setValues] = useState(
        Object.fromEntries(inputs.flat().map(input =>
            [input.name, input.type === NumberInput
                ? parseNumberString(input.defaultValue as string | number)
                : input.type === ColorInput
                    ? toHexColor(input.defaultValue as string)
                    : input.defaultValue]
        ))
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

    useEffect(() => {
        if (handleValueChange)
            handleValueChange(values)
    }, [])

    function handleMeshInput(e: SyntheticEvent<null, CustomEvent>) {
        if (!addMeshes) return
        const data = e.nativeEvent.detail
        addMeshes(data.target.value)
    }

    type GenericInputPropsType =
        MeshInputPropsType | NumberInputPropsType | ToggleInputPropsType | ColorInputPropsType

    return <>
        <div {...props} className={cl(styles.sidebar, props.className)}>
            <InputGroup>
                <MeshInput label={str('input-labels.mesh')} name={'mesh'} onInput={handleMeshInput}/>
            </InputGroup>
            {inputs.map((inputGroup, index) => <InputGroup key={index}>
                {inputGroup.map((input: inputDataType): JSX.Element => {
                    const InputComponent: (props: GenericInputPropsType) => JSX.Element =
                        input.type as (props: GenericInputPropsType) => JSX.Element
                    const props: GenericInputPropsType & {
                        defaultValue?: string | number | boolean,
                        noUnits?: boolean,
                        step?: number,
                        alwaysRoundToPlace?: number
                        invert?: boolean
                    } /* ???? */ = {
                        name: input.name,
                        defaultValue: input.defaultValue,
                        step: input.step,
                        alwaysRoundToPlace: input.alwaysRoundToPlace,
                        noUnits: InputComponent === NumberInput
                            ? typeof input.defaultValue === 'number'
                            : undefined,
                        invert: input.invert
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
