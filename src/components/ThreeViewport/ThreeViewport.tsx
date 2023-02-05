import React, {HTMLAttributes, useRef, useState} from 'react'
import {Mesh} from 'three'
import {Canvas, useFrame} from '@react-three/fiber'

export default function ThreeViewport(props: HTMLAttributes<HTMLElement>) {
    return <>
        <div {...props}>
            <Canvas>
                <ambientLight intensity={.3}/>
                <pointLight position={[2, 4, 5]} intensity={2}/>
                <pointLight position={[-2, -1, -1]} intensity={10}/>
                <Box/>
            </Canvas>
        </div>
    </>
}

function Box(props: {}) {
    const ref = useRef<Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    useFrame((state, delta) => {
        delta *= .5
        ref.current.rotation.x += delta * .7
        ref.current.rotation.y += delta
        ref.current.rotation.z += delta * .6
    })
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
        </mesh>
    )
}
