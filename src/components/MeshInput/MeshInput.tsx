import {HTMLAttributes, useRef} from 'react'
import RoundDiv from 'react-round-div'

import {Icon} from '../Icon'

import styles from './mesh-input.module.scss'
import {cl} from '../../utils/class-names'
import str from '../../strings'

export type MeshInputPropsType = {
    label?: string
    name?: string
}

export default function MeshInput({label, name, ...props}: MeshInputPropsType & HTMLAttributes<HTMLElement>) {
    const fileInput = useRef<HTMLInputElement | null>(null)

    function openFilePrompt() {
        fileInput.current?.click()
    }

    return <>
        {label && <label className={styles.label}>{label}</label>}
        <RoundDiv {...props} className={cl(props.className, styles.meshInput)} onClick={openFilePrompt}>
            <div className={styles.innerWrapper}>
                <Icon icon={'box'} className={styles.icon}/>
                {str('input-labels.meshFile')}
                <input type="file" accept="application/vnd.ms-pki.stl, .stl, .obj, .mtl, .ply" multiple
                       hidden={true} ref={fileInput}/>
            </div>
        </RoundDiv>
    </>
}
