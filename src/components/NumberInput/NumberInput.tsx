import {FocusEvent, HTMLAttributes, KeyboardEvent, useEffect, useRef, useState} from 'react'
import {CSSTransition} from 'react-transition-group'
import RoundDiv from 'react-round-div'
import {evaluate, Unit} from 'mathjs'
import convert from 'convert'

import styles from './number-input.module.scss'
import errorStyles from './error.module.scss'
import {cl} from '../../utils/class-names'

type NumberInputPropsType = {
    defaultValue?: number | string,
    step?: number
} & HTMLAttributes<HTMLElement>

const defaultUnit = 'cm'

export default function NumberInput({defaultValue = 0, step = .1, ...props}: NumberInputPropsType) {
    const innerWrapper = useRef(null)
    const input = useRef(null)
    const [valueBeforeFocus, setValueBeforeFocus] = useState(convertInputValue(defaultValue.toString()))
    const [inputErrorMessage, setInputErrorMessage] = useState<null | string>(null)
    const [showInputError, setShowInputError] = useState<boolean>(false)

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
        e.target.value = convertInputValue(e.target.value)
    }

    function roundToPlace(value: number, place: number): number {
        return Math.round(value * 10 ** place) / 10 ** place
    }

    function convertInputValue(value: string): string {
        try {
            const result = evaluate(value)
            if (result.constructor.name === 'Unit') {
                const resultJson = result.toJSON()
                if (resultJson.value === 0)
                    return '0' + defaultUnit
                const conversion = convert(resultJson.value, resultJson.unit).to('best')
                conversion.quantity = roundToPlace(conversion.quantity as number, 6)
                return conversion.quantity + conversion.unit
            } else {
                return roundToPlace(Number(value), 6) + defaultUnit
            }
        } catch (err) {
            setInputErrorMessage((err as Error).toString())
            setShowInputError(true)
            setTimeout(() => setShowInputError(false), 2 * 1000)
            return valueBeforeFocus
        }
    }

    function offsetValue(step: number, unit: string = defaultUnit) {
        const newValue = convertInputValue((input.current as HTMLInputElement | null)?.value + `+(${step}${unit})`)
        if (input.current) {
            (input.current as HTMLInputElement).value = newValue
        }
    }

    return <>
        <RoundDiv {...props} className={cl(props.className, styles.numberInput)}>
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
