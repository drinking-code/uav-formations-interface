import pako from 'pako'

import {updateDataEventTarget} from './fetch-formation'

export default async function setMesh(mesh: string) {
    await fetch('/mesh', {
        method: 'put',
        body: pako.gzip(mesh),
        headers: {
            'Content-Type': 'text/plain',
            'Content-Encoding': 'gzip',
        },
    }).then(res => {
        if (!res.ok) return
        updateDataEventTarget.dispatchEvent(new CustomEvent('mesh', {
            detail: mesh
        }))
    })
}
