import {FocusEvent, HTMLAttributes, KeyboardEvent, useRef, useState} from 'react'
import {CSSTransition} from 'react-transition-group'
import RoundDiv from 'react-round-div'
import {evaluate, number, Unit} from 'mathjs'
import convert from 'convert'

import {kebabCase} from '../../utils/string-manipulation'

import styles from './number-input.module.scss'
import errorStyles from './error.module.scss'
import {cl} from '../../utils/class-names'

export type NumberInputPropsType = {
    defaultValue?: number | string
    step?: number
    label?: string
    noUnits?: boolean
} & HTMLAttributes<HTMLElement>

const defaultUnit = 'cm'

export default function NumberInput(
    {defaultValue = 0, step = .1, label, noUnits, ...props}: NumberInputPropsType
) {
    const innerWrapper = useRef(null)
    const input = useRef(null)
    const [inputErrorMessage, setInputErrorMessage] = useState<null | string>(null)
    const [showInputError, setShowInputError] = useState<boolean>(false)
    const [valueBeforeFocus, setValueBeforeFocus] = useState(convertInputValue(defaultValue))

    function focus(e: FocusEvent<HTMLInputElement>) {
        setValueBeforeFocus((e.target as HTMLInputElement).value)
        ;(innerWrapper.current as HTMLElement | null)?.parentElement?.classList.add(styles.focus)
        e.target.addEventListener('mouseup', () => {
            (e.target as HTMLInputElement).setSelectionRange(0, (e.target as HTMLInputElement).value.length)
        }, {once: true})
    }

    function blurOnEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key !== 'Enter') return
        (e.target as HTMLInputElement).blur()
    }

    function blur(e: FocusEvent<HTMLInputElement>) {
        (innerWrapper.current as HTMLElement | null)?.parentElement?.classList.remove(styles.focus)
        e.target.value = convertInputValue(e.target.value).toString()
    }

    function roundToPlace(value: number, place: number): number {
        return Math.round(value * 10 ** place) / 10 ** place
    }

    function convertInputValue(value: number | string): number | string {
        try {
            value = value.toString().replace(/°/, 'deg')
            const result = evaluate(value)
            if (result.constructor.name === 'Unit') {
                if (noUnits) throw new Error('Input does not support units')
                const resultJson = result.toJSON()
                if (resultJson.value === 0)
                    return '0' + defaultUnit
                const conversion = convert(resultJson.value, resultJson.unit).to('best')
                conversion.quantity = roundToPlace(conversion.quantity as number, 6)
                return conversion.quantity + conversion.unit
            } else {
                const roundedNumber = roundToPlace(Number(result), 6)
                if (noUnits)
                    return roundedNumber
                else
                    return roundedNumber + defaultUnit
            }
        } catch (err) {
            try {
                ;(valueBeforeFocus) // try accessing before setting states to prevent infinite loop
                setInputErrorMessage((err as Error).toString())
                setShowInputError(true)
                setTimeout(() => setShowInputError(false), 2 * 1000)
                return valueBeforeFocus // might not been initialised
            } catch (e) {
                console.error(err)
                return '0'
            }
        }
    }

    function offsetValue(step: number, unit: string = defaultUnit) {
        const inputElement = input.current as HTMLInputElement | null
        if (!inputElement) return
        const newValue = convertInputValue(inputElement.value + `+(${step}${noUnits ? '' : unit})`)
        inputElement.value = newValue.toString()
    }

    return <>
        {label && <label className={styles.label}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.numberInput)}
                  id={cl(props.id, label && kebabCase(label))}>
            <div className={styles.innerWrapper} ref={innerWrapper}>
                <button className={cl(styles.button, styles.subtract)} onClick={() => offsetValue(-step)}>-</button>
                <input className={cl(styles.input)} type={'text'} defaultValue={valueBeforeFocus}
                       onFocus={focus} onBlur={blur} onKeyDown={blurOnEnter} ref={input}/>
                <button className={cl(styles.button, styles.add)} onClick={() => offsetValue(step)}>+</button>
            </div>
        </RoundDiv>
        <CSSTransition in={showInputError} classNames={errorStyles} unmountOnExit
                       addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}>
            <RoundDiv className={errorStyles.errorMessage}>{inputErrorMessage}</RoundDiv>
        </CSSTransition>
    </>
}
