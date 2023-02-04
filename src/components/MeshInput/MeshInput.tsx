import {HTMLAttributes, SyntheticEvent, useRef} from 'react'
import RoundDiv from 'react-round-div'

import {createFakeSyntheticEvent} from '../../utils/fake-synthetic-event'
import {Icon} from '../Icon'

import styles from './mesh-input.module.scss'
import {cl} from '../../utils/class-names'
import str from '../../strings'

export type MeshInputPropsType = {
    label?: string
    name?: string
    onInput?: (e: SyntheticEvent<null, CustomEvent>) => void
}

export default function MeshInput({label, name, onInput, ...props}: MeshInputPropsType & HTMLAttributes<HTMLElement>) {
    const fileInput = useRef<HTMLInputElement | null>(null)

    function openFilePrompt() {
        fileInput.current?.click()
    }

    function handleFileInput() {
        const fileInputElement = fileInput.current as HTMLInputElement
        fireOnInput(fileInputElement.files)
    }

    function fireOnInput(files: FileList | null) {
        if (!onInput) return
        const customInputEvent = new CustomEvent('input', {
            detail: {
                target: {
                    name: name,
                    value: files
                }
            }
        })
        const customSyntheticInputEvent = createFakeSyntheticEvent<any, typeof customInputEvent>(customInputEvent)
        onInput(customSyntheticInputEvent)
    }

    return <>
        {label && <label className={styles.label}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.meshInput)} onClick={openFilePrompt}>
            <div className={styles.innerWrapper}>
                <Icon icon={'box'} className={styles.icon}/>
                {str('input-labels.meshFile')}
                <input type="file" accept="application/vnd.ms-pki.stl, .stl, .obj, .mtl, .ply" multiple
                       hidden={true} ref={fileInput} onInput={handleFileInput}/>
            </div>
        </RoundDiv>
    </>
}
