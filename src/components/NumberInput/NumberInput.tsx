import {FocusEvent, HTMLAttributes, KeyboardEvent, useRef} from 'react'
import RoundDiv from 'react-round-div'
import {evaluate, Unit} from 'mathjs'
import convert from 'convert'

import styles from './number-input.module.scss'
import {cl} from '../../utils/class-names'

type NumberInputPropsType = {
    defaultValue?: number,
    step?: number
} & HTMLAttributes<HTMLElement>

const defaultUnit = 'cm'

export default function NumberInput({defaultValue = 0, step = .1, ...props}: NumberInputPropsType) {
    const innerWrapper = useRef(null)

    function focus(e: FocusEvent<HTMLInputElement>) {
        (innerWrapper.current as HTMLElement | null)?.parentElement?.classList.add(styles.focus)
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
    }

    return <RoundDiv {...props} className={cl(props.className, styles.numberInput)}>
        <div className={styles.innerWrapper} ref={innerWrapper}>
            <button className={cl(styles.button, styles.subtract)}>-</button>
            <input className={cl(styles.input)} type={'text'} defaultValue={convertInputValue(defaultValue.toString())}
                   onFocus={focus} onBlur={blur} onKeyDown={blurOnEnter}/>
            <button className={cl(styles.button, styles.add)}>+</button>
        </div>
    </RoundDiv>
}
