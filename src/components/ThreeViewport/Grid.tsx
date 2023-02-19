import {Euler} from 'three'
import {PointMaterial} from '@react-three/drei'

import Scene from './Scene'

export default function Grid() {
    const gridSize = 16
    const smallTileSize = .2
    const bigTileSize = 1
    const thinLinesColor = /*formationMode ? '#7a7a7a' : */'#333'
    const thickLinesColor = /*formationMode ? '#9c9c9c' : */'#555'

    const rotate90AlongX = new Euler(Math.PI / 2, 0, 0)

    return <>
        <Scene>
            <gridHelper args={[gridSize, gridSize / smallTileSize, thickLinesColor, thinLinesColor]}
                        rotation={rotate90AlongX}/>
            <gridHelper args={[gridSize, gridSize / bigTileSize, thickLinesColor, thickLinesColor]}
                        rotation={rotate90AlongX}/>

            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach={'attributes-position'}
                        array={new Float32Array([0, 0, 0])}
                        count={1}
                        itemSize={3}
                    />
                </bufferGeometry>
                <PointMaterial transparent color={'#4b8ec5'} size={4} sizeAttenuation={false}/>
            </points>
        </Scene>
    </>
}
