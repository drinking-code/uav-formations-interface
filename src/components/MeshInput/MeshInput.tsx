import {HTMLAttributes, SyntheticEvent, useEffect, useRef, useState} from 'react'
import {CSSTransition} from 'react-transition-group'
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

const ALLOWED_FILES = ['.stl', '.obj', '.mtl', '.ply']

export default function MeshInput({label, name, onInput, ...props}: MeshInputPropsType & HTMLAttributes<HTMLElement>) {
    const fileInput = useRef<HTMLInputElement>(null!)
    const [showDropZone, setShowDropZone] = useState(false)

    function openFilePrompt() {
        fileInput.current.click()
    }

    function handleFileInput() {
        const fileInputElement = fileInput.current
        if (!fileInputElement || !fileInputElement.files) return
        const files = [...fileInputElement.files]
        fireOnInput(files)
    }

    function fireOnInput(files: File[] | null) {
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

    useEffect(() => {
        const handleDragEnter = (e: DragEvent) => {
            e.preventDefault()
            setShowDropZone(true)
        }
        const handleDragEnd = (e: DragEvent) => {
            e.preventDefault()
            setShowDropZone(false)
        }

        window.addEventListener('dragenter', handleDragEnter)
        window.addEventListener('dragover', handleDragEnter)
        document.body.addEventListener('drop', dropHandler)
        window.addEventListener('dragend', handleDragEnd)
        window.addEventListener('dragleave', handleDragEnd)
        return () => {
            window.removeEventListener('dragenter', handleDragEnter)
            window.removeEventListener('dragover', handleDragEnter)
            document.body.removeEventListener('drop', dropHandler)
            window.removeEventListener('dragend', handleDragEnd)
            window.removeEventListener('dragleave', handleDragEnd)
        }
    })

    function dropHandler(e: DragEvent) {
        e.preventDefault();
        setShowDropZone(false)
        if (!e.dataTransfer) return
        const files: File[] = []
        if (e.dataTransfer.items) {
            [...e.dataTransfer.items].forEach(item => {
                if (item.kind !== 'file') return
                const file = item.getAsFile()
                if (!file) return
                files.push(file)
            })
        } else {
            files.push(...e.dataTransfer.files)
        }
        fireOnInput(files.filter(file => ALLOWED_FILES.some(suffix => file.name.endsWith(suffix))))
    }

    return <>
        {label && <label className={styles.label}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.meshInput)} onClick={openFilePrompt}>
            <div className={styles.innerWrapper}>
                <Icon icon={'box'} className={styles.icon}/>
                {str('input-labels.meshFile')}
                <input type={'file'} accept={ALLOWED_FILES.join(', ')} multiple
                       hidden={true} ref={fileInput} onInput={handleFileInput}/>
            </div>
        </RoundDiv>
        <CSSTransition in={showDropZone} classNames={styles} unmountOnExit
                       addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}>
            <div className={styles.dropZone}>
                <div className={styles.dashedBorderWrapper}>
                    <RoundDiv className={styles.dashedBorder} children={<div/>}/>
                </div>
                <span className={styles.dropLabel}>{str('file-drag-drop.dropHere')}</span>
            </div>
        </CSSTransition>
    </>
}
