import {MeshInput} from '../MeshInput'
import {NumberInput} from '../NumberInput'
import {ToggleInput} from '../ToggleInput'
import {ColorInput} from '../ColorInput'

import str from '../../strings'

export type AnyInputType = typeof MeshInput | typeof NumberInput | typeof ToggleInput | typeof ColorInput
const inputs: {
    type: AnyInputType
    name: string,
    step?: number,
    alwaysRoundToPlace?: number,
    label?: string | [string, string],
    defaultValue?: number | string | boolean
}[][] = [[{
    type: NumberInput,
    name: 'max_amount',
    defaultValue: 500,
    step: 1,
    alwaysRoundToPlace: 0,
    label: str('input-labels.maxUAVAmount'),
}, {
    type: ToggleInput,
    name: 'min_distance_mode',
    defaultValue: true,
    label: [str('input-labels.midpointDistanceMode'), str('input-labels.cornerDistanceMode'),],
}, {
    type: NumberInput,
    name: 'min_distance',
    defaultValue: '.1m',
    label: str('input-labels.UAVMinDistance'),
}, {
    type: NumberInput,
    name: 'uav_size',
    defaultValue: '.25m',
    label: str('input-labels.UAVSize'),
},], [{
    type: NumberInput,
    name: 'sharp_threshold',
    defaultValue: '30deg',
    label: str('input-labels.sharpnessThreshold'),
},], [{
    type: ToggleInput,
    name: 'features_only',
    defaultValue: true,
    label: str('input-labels.toggleSurfaceFill'),
}, {
    type: NumberInput,
    name: 'file_brightness',
    defaultValue: '50%',
    label: str('input-labels.surfaceFillAmount'),
},], [{
    type: ToggleInput,
    name: 'illumination_directionality',
    defaultValue: true,
    label: str('input-labels.illuminationDirectionality'),
}, {
    type: NumberInput,
    name: 'illumination_directionality_bleed',
    defaultValue: '0%',
    label: str('input-labels.illuminationDirectionalityBleed'),
},], [{
    type: ToggleInput,
    name: 'override_color',
    defaultValue: false,
    label: str('input-labels.colorOverride'),
}, {
    type: ToggleInput,
    name: 'color_mode',
    defaultValue: true,
    label: [str('input-labels.solidColor'), str('input-labels.gradientColor'),],
}, {
    type: ColorInput,
    name: 'color_1',
    defaultValue: 'white',
    label: str('input-labels.color'),
},],]

export default inputs
