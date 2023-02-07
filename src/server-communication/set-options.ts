import {updateDataEventTarget} from './fetch-formation'

export default async function setOptions(options: {}) {
    await fetch('/options', {
        method: 'put',
        body: JSON.stringify(options),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
        if (!res.ok) return
        updateDataEventTarget.dispatchEvent(new CustomEvent('options', {
            detail: options
        }))
    })
}
