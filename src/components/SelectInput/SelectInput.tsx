import {HTMLAttributes, SyntheticEvent, useRef} from 'react'
import RoundDiv from 'react-round-div'

import styles from './select-input.module.scss'
import {cl} from '../../utils/class-names'
import {kebabCase} from '../../utils/string-manipulation'
import {createFakeSyntheticEvent} from '../../utils/fake-synthetic-event'

export type SelectInputPropsType = {
    options: { [key: string]: string }
    defaultValue?: string
    label?: string
    name?: string
    onInput?: (e: SyntheticEvent<null, CustomEvent>) => void
    disabled?: boolean
}

export default function SelectInput({options, defaultValue, label, name, onInput, disabled = false, ...props}:
                                        SelectInputPropsType & HTMLAttributes<HTMLElement>) {
    const input = useRef<HTMLSelectElement>(null!)

    function fireOnInput() {
        if (!onInput) return
        const inputElement = input.current
        if (!inputElement) return
        const customInputEvent = new CustomEvent('input', {
            detail: {
                target: {
                    name: name,
                    value: inputElement.value
                }
            }
        })
        const customSyntheticInputEvent = createFakeSyntheticEvent<any, typeof customInputEvent>(customInputEvent)
        onInput(customSyntheticInputEvent)
    }

    return <>
        {label && <label className={cl(styles.label, disabled && styles.disabled)}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.selectInput, disabled && styles.disabled)}
                  id={cl(label && kebabCase(label))}>
            <div className={styles.innerWrapper}>
                <select className={styles.select} onInput={fireOnInput} ref={input} defaultValue={defaultValue}
                        disabled={disabled}>
                    {Array.from(Object.entries(options)).map(([key, label]) =>
                        <option value={key} key={key}>
                            {label}
                        </option>
                    )}
                </select>
            </div>
        </RoundDiv>
    </>
}
