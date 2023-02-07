import {useEffect, useState} from 'react'
import {_BestConversion, BestUnits} from 'convert'

export default async function fetchFormation(callback: (chunk: string) => void) {
    await fetch('/formation', {
        method: 'get',
    }).then(res => {
        if (!res.body) return
        const reader = res.body.getReader()
        const utf8Decoder = new TextDecoder()
        const readNextChunk = () => reader.read()
            .then(({done, value}) => {
                if (!done) readNextChunk()
                if (!value) return
                callback(utf8Decoder.decode(value))
            })
        readNextChunk()
    })
}

export type PossibleInputValueType = string | number | _BestConversion<number, BestUnits> | boolean | undefined

export const updateDataEventTarget = new EventTarget()

// this is so that data from events on "updateDataEventTarget" that happened prior to the hook call
// are reflected in the hook's (initial) data
let meshOutsideHook: string = null!
let optionsOutsideHook: { [key: string]: PossibleInputValueType } = {}
const isInitialized = (
    mesh: typeof meshOutsideHook,
    options: typeof optionsOutsideHook,
    initialized: boolean = false
): boolean => initialized || (!!mesh && Object.keys(options).length > 0)

updateDataEventTarget.addEventListener('mesh', ((e: CustomEvent) => meshOutsideHook = e.detail) as EventListener)
updateDataEventTarget.addEventListener('options', ((e: CustomEvent) => optionsOutsideHook = e.detail) as EventListener)

export function useServerData() {
    const [mesh, setMesh] = useState<typeof meshOutsideHook>(meshOutsideHook)
    const [options, setOptions] = useState<typeof optionsOutsideHook>(optionsOutsideHook)
    const [initialized, setInitialized] = useState<boolean>(isInitialized(mesh, options))

    useEffect(() => {
        const checkInitializedState = () => setInitialized(isInitialized(mesh, options, initialized))
        const handleNewMeshData = (e: CustomEvent) => (setMesh(e.detail), checkInitializedState())
        const handleNewOptions = (e: CustomEvent) => (setOptions(e.detail), checkInitializedState())

        updateDataEventTarget.addEventListener('mesh', handleNewMeshData as EventListener)
        updateDataEventTarget.addEventListener('options', handleNewOptions as EventListener)

        return () => {
            updateDataEventTarget.removeEventListener('mesh', handleNewMeshData as EventListener)
            updateDataEventTarget.removeEventListener('options', handleNewOptions as EventListener)
        }
    })

    return {mesh, options, initialized}
}
