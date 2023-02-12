import {HTMLAttributes, useState} from 'react'
import RoundDiv from 'react-round-div'
import {CustomPicker} from 'react-color'
import {EditableInput, Hue, Saturation} from 'react-color/lib/components/common'
import parse from 'parse-css-color'

import styles from './color-input.module.scss'
import {cl} from '../../utils/class-names'
import str from '../../strings'

export type ColorInputPropsType = {
    label?: string
    name?: string
    defaultValue: string
    disabled?: boolean
}

export default function ColorInput({label, defaultValue, name, disabled = false, ...props}:
                                       ColorInputPropsType & HTMLAttributes<HTMLElement>) {
    const [color, setColor] = useState(toHexColor(defaultValue))

    return <>
        {label && <label className={cl(styles.label, disabled && styles.disabled)}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.colorInput, disabled && styles.disabled)}>
            <div className={styles.innerWrapper}>
                <RoundDiv className={styles.swatch} style={{'--color': color}}/>
                <span>{color}</span>
            </div>
        </RoundDiv>
    </>
}

export function toHexColor(value: string): string {
    const parsed = parse(value)
    if (!parsed)
        throw new Error(`\`${value}\` is not a valid color.`)
    return '#' + parsed.values.map(number => number.toString(16).toUpperCase()).join('')
}
