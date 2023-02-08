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
let meshOutsideOfHook: string = null!
let optionsOutsideOfHook: { [key: string]: PossibleInputValueType } = {}
export const isInitialized = (
    mesh: typeof meshOutsideOfHook,
    options: typeof optionsOutsideOfHook,
    initialized: boolean = false
): boolean => initialized || (!!mesh && Object.keys(options).length > 0)

updateDataEventTarget.addEventListener('mesh', ((e: CustomEvent) => meshOutsideOfHook = e.detail) as EventListener)
updateDataEventTarget.addEventListener('options', ((e: CustomEvent) => optionsOutsideOfHook = e.detail) as EventListener)

function makeServerDataHook<T>(eventName: string, defaultValue: T) {
    return function useServerData() {
        const [data, setData] = useState<T>(null!)

        useEffect(() => {
            setData(defaultValue)
            const handleNewData = (e: CustomEvent) => setData(e.detail)
            updateDataEventTarget.addEventListener(eventName, handleNewData as EventListener)

            return () => {
                updateDataEventTarget.removeEventListener(eventName, handleNewData as EventListener)
            }
        }, [])

        return data
    }
}

// () => makeServerDataHook()() instead of makeServerDataHook()
// because the most recent value of "meshOutsideOfHook" should be used
export const useServerDataMesh = () =>
    makeServerDataHook<typeof meshOutsideOfHook>('mesh', meshOutsideOfHook)()

export const useServerDataOptions = () =>
    makeServerDataHook<typeof optionsOutsideOfHook>('options', optionsOutsideOfHook)()
