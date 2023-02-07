import {useEffect, useState} from 'react'
import {UnrealBloomPass, SMAAPass} from 'three-stdlib'
import {extend, useThree} from '@react-three/fiber'
import {Effects} from '@react-three/drei'

import {fetchFormation, useServerData} from '../../server-communication'

extend({UnrealBloomPass})

export default function GeneratedFormation() {
    const serverData = useServerData()
    const [currentMesh, setCurrentMesh] = useState<string>(null!)
    const [points, setPoints] = useState<Array<[number, number, number]>>([])
    const state = useThree()

    function addPoints(newPoints: typeof points) {
        setPoints(currentPoints => [...currentPoints, ...newPoints])
    }

    function resetPoints() {
        setPoints([])
    }

    useEffect(() => {
        if (!serverData.initialized) return
        if (currentMesh === serverData.mesh) return
        setCurrentMesh(serverData.mesh)
        resetPoints()
        fetchFormation((receivedPointsString: string) => {
            addPoints(
                receivedPointsString.split("\n")
                    .filter(possiblePointString => possiblePointString.trim() !== '')
                    .map(pointString => pointString.split(' ')
                        .map(coordinateString => Number(coordinateString))
                    ) as Array<[number, number, number]>
            )
        })
    }, [serverData])

    return <>
        {points.map((point) =>
            <mesh position={point} key={point.join(',')}>
                <sphereGeometry args={[serverData.options.uav_size as number / 2, 12, 8]}/>
                <meshStandardMaterial emissive={'#ffffff'} emissiveIntensity={4} toneMapped={false}/>
            </mesh>
        )}
        <Effects disableGamma>
            {/* @ts-ignore */}
            <unrealBloomPass threshold={1} strength={.4} radius={0.9}/>
        </Effects>
    </>
}
