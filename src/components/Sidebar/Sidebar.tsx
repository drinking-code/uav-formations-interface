import {HTMLAttributes, SyntheticEvent, useState} from 'react'

import {MeshInputPropsType} from '../MeshInput'
import {NumberInput, NumberInputPropsType} from '../NumberInput'
import {ToggleInputPropsType} from '../ToggleInput'
import {ColorInputPropsType} from '../ColorInput'
import inputs from './inputs'

import styles from './sidebar.module.scss'
import {cl} from '../../utils/class-names'
import str from '../../strings'

type SidebarPropsType = {
    handleValueChange?: (values: { [key: string]: string }) => void
} & HTMLAttributes<HTMLElement>

export default function Sidebar({handleValueChange, ...props}: SidebarPropsType) {
    const [values, setValues] = useState(
        Object.fromEntries(inputs.flat().map(input => [input.name, input.defaultValue]))
    )

    function handleInputs(e: SyntheticEvent<null, CustomEvent>) {
        const data = e.nativeEvent.detail
        console.log(data.target)
    }

    type GenericInputPropsType =
        MeshInputPropsType | NumberInputPropsType | ToggleInputPropsType | ColorInputPropsType

    return <>
        <div {...props} className={cl(styles.sidebar, props.className)}>
            {inputs.map((inputGroup, index) =>
                inputGroup.map((input: typeof inputs[number][number]): JSX.Element => {
                    const InputComponent: (props: GenericInputPropsType) => JSX.Element =
                        input.type as (props: GenericInputPropsType) => JSX.Element
                    const props: GenericInputPropsType
                        & { defaultValue?: string | number | boolean, noUnits?: boolean } /* ???? */ = {
                        name: input.name,
                    }
                    if (input.defaultValue) props.defaultValue = input.defaultValue
                    if (typeof input.defaultValue === 'number' && typeof InputComponent === typeof NumberInput)
                        props.noUnits = true
                    if (input.label) {
                        if (typeof input.label === 'string')
                            props.label = input.label
                        else if (Array.isArray(input.label))
                            (props as ToggleInputPropsType).switchLabels = input.label
                    }
                    return <InputComponent key={input.name} {...props} onInput={handleInputs}/>
                })
            )}
        </div>
    </>
}
