import {HTMLAttributes} from 'react'

import {NumberInput} from '../NumberInput'
import {MeshInput} from '../MeshInput'

import styles from './sidebar.module.scss'
import {cl} from '../../utils/class-names'
import str from '../../strings'

export default function Sidebar(props: HTMLAttributes<HTMLElement>) {
    return <>
        <div {...props} className={cl(styles.sidebar, props.className)}>
            <MeshInput label={str('input-labels.mesh')}/>

            <NumberInput label={str('input-labels.maxUAVAmount')} noUnits defaultValue={500}/>
            <NumberInput label={str('input-labels.UAVMinDistance')} defaultValue={'.1m'}/>
            <NumberInput label={str('input-labels.UAVSize')} defaultValue={'.25m'}/>

            <NumberInput label={str('input-labels.sharpnessThreshold')} defaultValue={'30deg'}/>
        </div>
    </>
}
