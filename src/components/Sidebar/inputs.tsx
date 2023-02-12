import {MeshInput} from '../MeshInput'
import {NumberInput} from '../NumberInput'
import {ToggleInput} from '../ToggleInput'
import {ColorInput} from '../ColorInput'
import {SelectInput} from '../SelectInput'

import str from '../../strings'

export type AnyInputType =
    typeof MeshInput
    | typeof NumberInput
    | typeof ToggleInput
    | typeof ColorInput
    | typeof SelectInput
const inputs: {
    type: AnyInputType
    name: string,
    step?: number,
    alwaysRoundToPlace?: number,
    label?: string | [string, string],
    defaultValue?: number | string | boolean,
    options?: { [key: string]: string },
    invert?: boolean,
    disabled?: string | boolean,
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
    defaultValue: '.07m',
    label: str('input-labels.UAVSize'),
},], [{
    type: NumberInput,
    name: 'sharp_threshold',
    defaultValue: '140deg',
    label: str('input-labels.sharpnessThreshold'),
},], [{
    type: ToggleInput,
    name: 'features_only',
    defaultValue: false,
    invert: true,
    label: str('input-labels.toggleSurfaceFill'),
}, {
    type: NumberInput,
    name: 'file_brightness',
    defaultValue: '50%',
    disabled: 'features_only',
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
    disabled: 'illumination_directionality',
    label: str('input-labels.illuminationDirectionalityBleed'),
},], [{
    type: ToggleInput,
    name: 'override_color',
    defaultValue: false,
    label: str('input-labels.colorOverride'),
}, {
    type: SelectInput,
    name: 'color_mode',
    defaultValue: 'solid',
    disabled: 'override_color',
    options: {
        solid: str('input-labels.solidColor'),
        'linear_gradient': str('input-labels.linearGradientColor'),
        'radial_gradient': str('input-labels.radialGradientColor'),
    },
}, {
    type: ColorInput,
    name: 'color_1',
    defaultValue: 'white',
    disabled: 'override_color',
    label: str('input-labels.color'),
},],]

export default inputs
