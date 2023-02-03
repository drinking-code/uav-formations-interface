import {HTMLAttributes, SyntheticEvent} from 'react'

import {NumberInput} from '../NumberInput'
import {MeshInput} from '../MeshInput'
import {ToggleInput} from '../ToggleInput'


import styles from './sidebar.module.scss'
import {cl} from '../../utils/class-names'
import str from '../../strings'

export default function Sidebar(props: HTMLAttributes<HTMLElement>) {
    function handleInputs(e: SyntheticEvent<null, CustomEvent>) {
        const data = e.nativeEvent.detail
        console.log(data.target)
    }

    return <>
        <div {...props} className={cl(styles.sidebar, props.className)}>
            <MeshInput label={str('input-labels.mesh')}/>

            <NumberInput label={str('input-labels.maxUAVAmount')} noUnits defaultValue={500}
                         name={'max_amount'} onInput={handleInputs}/>
            <ToggleInput switchLabels={[
                str('input-labels.midpointDistanceMode'),
                str('input-labels.cornerDistanceMode'),
            ]} defaultValue={true} name={'min_distance_mode'} onInput={handleInputs}/>
            <NumberInput label={str('input-labels.UAVMinDistance')} defaultValue={'.1m'}
                         name={'min_distance'} onInput={handleInputs}/>
            <NumberInput label={str('input-labels.UAVSize')} defaultValue={'.25m'}
                         name={'uav_size'} onInput={handleInputs}/>

            <NumberInput label={str('input-labels.sharpnessThreshold')} defaultValue={'30deg'}
                         name={'sharp_threshold'} onInput={handleInputs}/>

            <ToggleInput label={str('input-labels.toggleSurfaceFill')} defaultValue={true}
                         name={'features_only'} onInput={handleInputs}/>
            <NumberInput label={str('input-labels.surfaceFillAmount')} defaultValue={'50%'}
                         name={'file_brightness'} onInput={handleInputs}/>
        </div>
    </>
}
