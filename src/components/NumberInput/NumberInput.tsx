import {FocusEvent, HTMLAttributes, KeyboardEvent, SyntheticEvent, useRef, useState} from 'react'
import {CSSTransition} from 'react-transition-group'
import RoundDiv from 'react-round-div'
import {evaluate, Unit} from 'mathjs'
import convert, {convertMany} from 'convert'

import {kebabCase} from '../../utils/string-manipulation'
import {createFakeSyntheticEvent} from '../../utils/fake-synthetic-event'
import {parseNumberString} from '../../utils/parse-number-string'

import styles from './number-input.module.scss'
import errorStyles from './error.module.scss'
import {cl} from '../../utils/class-names'

export type NumberInputPropsType = {
    defaultValue?: number | string
    step?: number
    alwaysRoundToPlace?: number
    label?: string
    name?: string
    noUnits?: boolean
    onInput?: (e: SyntheticEvent<null, CustomEvent>) => void
    disabled?: boolean
}

const defaultUnit = 'cm'

export default function NumberInput(
    {
        defaultValue = 0,
        step: stepOrUndefined,
        alwaysRoundToPlace,
        label,
        name,
        noUnits,
        onInput,
        disabled = false,
        ...props
    }: NumberInputPropsType & HTMLAttributes<HTMLElement>
) {
    const isPercentage = typeof defaultValue === 'string' && defaultValue.endsWith('%')
    if (isPercentage) noUnits = true
    const step = stepOrUndefined ?? (isPercentage ? .01 : .1)
    const innerWrapper = useRef<HTMLDivElement>(null!)
    const input = useRef<HTMLInputElement>(null!)
    const [inputErrorMessage, setInputErrorMessage] = useState<null | string>(null)
    const [showInputError, setShowInputError] = useState<boolean>(false)
    const [valueBeforeFocus, setValueBeforeFocus] = useState(convertInputValue(defaultValue))
    const unit = !noUnits && typeof valueBeforeFocus === 'string' &&
        (valueBeforeFocus.match(/[^\d.,]+$/) as [string])[0]

    function focus(e: FocusEvent<HTMLInputElement>) {
        setValueBeforeFocus((e.target as HTMLInputElement).value)
        innerWrapper.current.parentElement?.classList.add(styles.focus)
        e.target.addEventListener('mouseup', () => {
            (e.target as HTMLInputElement).setSelectionRange(0, (e.target as HTMLInputElement).value.length)
        }, {once: true})
    }

    function blurOnEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key !== 'Enter') return
        (e.target as HTMLInputElement).blur()
    }

    function blur(e: FocusEvent<HTMLInputElement>) {
        innerWrapper.current.parentElement?.classList.remove(styles.focus)
        e.target.value = convertInputValue(e.target.value).toString()
        fireOnInput()
    }

    function round(value: number) {
        return roundToPlace(value, 6)
    }

    function roundToPlace(value: number, place: number): number {
        place = alwaysRoundToPlace ?? place
        return Math.round(value * 10 ** place) / 10 ** place
    }

    function convertInputValue(value: number | string): number | string {
        try {
            value = value.toString().replace(/°/, 'deg')
            const result = evaluate(value)
            if (result.constructor.name === 'Unit') {
                if (noUnits) throw new Error('Input does not support units')
                const resultJson = result.toJSON()
                if (resultJson.value === 0) {
                    return '0' + (unit || defaultUnit)
                }
                const conversion = convert(resultJson.value, resultJson.unit).to('best')
                conversion.quantity = round(conversion.quantity as number)
                return conversion.quantity + conversion.unit
            } else {
                const roundedNumber = round(Number(result))
                if (noUnits) {
                    if (isPercentage)
                        return round(roundedNumber * 100) + '%'
                    return roundedNumber
                } else {
                    return roundedNumber + (unit || defaultUnit)
                }
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

    function offsetValue(step: number) {
        const inputElement = input.current
        if (!inputElement) return
        const unit = isNaN(Number(inputElement.value)) && !isPercentage ? convertMany(inputElement.value).to('best').unit : null
        const newValue = convertInputValue(inputElement.value + `+(${step}${noUnits ? '' : unit})`)
        inputElement.value = newValue.toString()
        fireOnInput()
    }

    function fireOnInput() {
        if (!onInput) return
        const inputElement = input.current
        if (!inputElement) return
        const customInputEvent = new CustomEvent('input', {
            detail: {
                target: {
                    name: name,
                    value: parseNumberString(inputElement.value)
                }
            }
        })
        const customSyntheticInputEvent = createFakeSyntheticEvent<any, typeof customInputEvent>(customInputEvent)
        onInput(customSyntheticInputEvent)
    }

    return <>
        {label && <label className={cl(styles.label, disabled && styles.disabled)}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.numberInput, disabled && styles.disabled)}
                  id={cl(props.id, label && kebabCase(label))}>
            <div className={styles.innerWrapper} ref={innerWrapper}>
                <button className={cl(styles.button, styles.subtract)} onClick={() => offsetValue(-step)}>-</button>
                <input className={cl(styles.input)} type={'text'} defaultValue={valueBeforeFocus} disabled={disabled}
                       onFocus={focus} onBlur={blur} onKeyDown={blurOnEnter} ref={input} name={name}/>
                <button className={cl(styles.button, styles.add)} onClick={() => offsetValue(step)}>+</button>
            </div>
        </RoundDiv>
        <CSSTransition in={showInputError} classNames={errorStyles} unmountOnExit
                       addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}>
            <RoundDiv className={errorStyles.errorMessage}>{inputErrorMessage}</RoundDiv>
        </CSSTransition>
    </>
}
