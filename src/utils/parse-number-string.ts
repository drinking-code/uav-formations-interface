import {convertMany} from 'convert'

export function parseNumberString(value: number | string) {
    if (typeof value === 'number') return value
    const noUnits = !!value.match(/^[\d.]+$/)
    if (noUnits)
        return Number(value)
    const isPercentage = value.endsWith('%')
    if (isPercentage)
        return Number(value.replace('%', '')) / 100

    return convertMany(value).to('best')
}
