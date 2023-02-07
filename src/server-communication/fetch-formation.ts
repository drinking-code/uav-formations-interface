import {useEffect, useState} from 'react'
import {_BestConversion, BestUnits} from 'convert'

export default async function fetchFormation() {
    await fetch('/formation', {
        method: 'get',
    })
        .then(res => {
            if (res.ok)
                return
        })
}

export type PossibleInputValueType = string | number | _BestConversion<number, BestUnits> | boolean | undefined

export const updateDataEventTarget = new EventTarget()

export function useServerData() {
    const [mesh, setMesh] = useState<string>(null!)
    const [options, setOptions] = useState<{ [key: string]: PossibleInputValueType }>({})
    const [initialized, setInitialized] = useState<boolean>(false)

    useEffect(() => {
        const checkInitializedState = () => setInitialized(initialized || (!!mesh && Object.keys(options).length > 0))
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
