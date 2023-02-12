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
import {SelectInputPropsType} from '../SelectInput'
import Button from '../Button/Button'

type inputDataType = typeof inputs[number][number]
type inputNameType = inputDataType['name']
type inputValueType = inputDataType['defaultValue'] | _BestConversion<number, BestUnits>

type SidebarPropsType = {
    handleValueChange?: (values: { [key: inputNameType]: inputValueType }) => void
    addMeshes?: (meshes: File[]) => void
} & HTMLAttributes<HTMLElement>

export default function Sidebar({handleValueChange, addMeshes, ...props}: SidebarPropsType) {
    const inputsInverted = Object.fromEntries(
        inputs.flat()
            .filter(input => input.type === ToggleInput)
            .map(input => [input.name, input.invert ?? false])
    )
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
        setValues({
            ...values,
            [data.target.name]: data.target.value
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
        MeshInputPropsType | NumberInputPropsType | ToggleInputPropsType | ColorInputPropsType | SelectInputPropsType

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
                        alwaysRoundToPlace?: number,
                        invert?: boolean,
                        options?: { [key: string]: string },
                        disabled?: boolean,
                    } /* ???? */ = {
                        name: input.name,
                        defaultValue: input.defaultValue,
                        step: input.step,
                        alwaysRoundToPlace: input.alwaysRoundToPlace,
                        noUnits: InputComponent === NumberInput
                            ? typeof input.defaultValue === 'number'
                            : undefined,
                        invert: input.invert,
                        options: input.options,
                    }
                    if (input.label) {
                        if (typeof input.label === 'string')
                            props.label = input.label
                        else if (Array.isArray(input.label))
                            (props as ToggleInputPropsType).switchLabels = input.label
                    }
                    if (typeof input.disabled === 'boolean') {
                        props.disabled = input.disabled
                    } else if (typeof input.disabled === 'string') {
                        props.disabled = !(values[input.disabled] as boolean !== inputsInverted[input.disabled])
                    }
                    for (const propsKey in props) {
                        if (props[propsKey as keyof typeof props] === undefined)
                            delete props[propsKey as keyof typeof props]
                    }
                    return <InputComponent key={input.name} {...props} onInput={handleInputs}/>
                })}
            </InputGroup>)}
            <Button label={str('input-labels.exportButton')} className={styles.exportButton}/>
        </div>
    </>
}
