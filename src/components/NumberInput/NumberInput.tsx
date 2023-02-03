import {FocusEvent, HTMLAttributes, KeyboardEvent, SyntheticEvent, useRef, useState} from 'react'
import {CSSTransition} from 'react-transition-group'
import RoundDiv from 'react-round-div'
import {evaluate, Unit} from 'mathjs'
import convert, {convertMany} from 'convert'

import {kebabCase} from '../../utils/string-manipulation'
import {createFakeSyntheticEvent} from '../../utils/fake-synthetic-event'

import styles from './number-input.module.scss'
import errorStyles from './error.module.scss'
import {cl} from '../../utils/class-names'

export type NumberInputPropsType = {
    defaultValue?: number | string
    step?: number
    label?: string
    name?: string
    noUnits?: boolean
    onInput?: (e: SyntheticEvent<null, CustomEvent>) => void
} & HTMLAttributes<HTMLElement>

const defaultUnit = 'cm'

export default function NumberInput(
    {defaultValue = 0, step, label, name, noUnits, onInput, ...props}: NumberInputPropsType
) {
    const isPercentage = typeof defaultValue === 'string' && defaultValue.endsWith('%')
    if (isPercentage) noUnits = true
    step = step ?? (isPercentage ? .01 : .1)
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
        fireOnInput()
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
                if (resultJson.value === 0) {
                    return '0' + defaultUnit
                }
                const conversion = convert(resultJson.value, resultJson.unit).to('best')
                conversion.quantity = roundToPlace(conversion.quantity as number, 6)
                return conversion.quantity + conversion.unit
            } else {
                const roundedNumber = roundToPlace(Number(result), 6)
                if (noUnits) {
                    if (isPercentage)
                        return roundToPlace(roundedNumber * 100, 6) + '%'
                    return roundedNumber
                } else {
                    return roundedNumber + defaultUnit
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
        const inputElement = input.current as HTMLInputElement | null
        if (!inputElement) return
        const unit = isNaN(Number(inputElement.value)) && !isPercentage ? convertMany(inputElement.value).to('best').unit : null
        const newValue = convertInputValue(inputElement.value + `+(${step}${noUnits ? '' : unit})`)
        inputElement.value = newValue.toString()
        fireOnInput()
    }


    function fireOnInput() {
        if (!onInput) return
        const inputElement = input.current as HTMLInputElement | null
        if (!inputElement) return
        const customInputEvent = new CustomEvent('input', {
            detail: {
                target: {
                    name: name,
                    value: noUnits
                        ? isPercentage
                            ? Number(inputElement.value.replace('%', '')) / 100
                            : Number(inputElement.value)
                        : convertMany(inputElement.value).to('best')
                }
            }
        })
        const customSyntheticInputEvent = createFakeSyntheticEvent<any, typeof customInputEvent>(customInputEvent)
        onInput(customSyntheticInputEvent)
    }

    return <>
        {label && <label className={styles.label}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.numberInput)}
                  id={cl(props.id, label && kebabCase(label))}>
            <div className={styles.innerWrapper} ref={innerWrapper}>
                <button className={cl(styles.button, styles.subtract)} onClick={() => offsetValue(-step)}>-</button>
                <input className={cl(styles.input)} type={'text'} defaultValue={valueBeforeFocus}
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
