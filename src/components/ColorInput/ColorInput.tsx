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
}

export default function ColorInput({label, defaultValue, name, ...props}:
                                       ColorInputPropsType & HTMLAttributes<HTMLElement>) {
    const [color, setColor] = useState(toHexColor(defaultValue))

    function toHexColor(value: string): string {
        const parsed = parse(value)
        if (!parsed)
            throw new Error(`\`${value}\` is not a valid color.`)
        return '#' + parsed.values.map(number => number.toString(16).toUpperCase()).join('')
    }

    return <>
        {label && <label className={styles.label}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.colorInput)}>
            <div className={styles.innerWrapper}>
                <RoundDiv className={styles.swatch} style={{'--color': color}}/>
                <span>{color}</span>
            </div>
        </RoundDiv>
    </>
}
