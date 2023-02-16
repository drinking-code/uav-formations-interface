import {DirectionVectorType} from '../components/ThreeViewport/GeneratedFormation'
import {acos, divide, dot, multiply, norm} from 'mathjs'

export default function yawPitchFromDirection(direction: DirectionVectorType): [number, number] {
    const defaultDirection: DirectionVectorType = [1, 0, 0]
    const projectedVector: DirectionVectorType = [...direction]
    projectedVector[2] = 0

    const directionAlongZ = !projectedVector.some(value => value !== 0)
    const directionAboveXY = Math.sign(direction[2]) === 1
    const directionBehindXZ = Math.sign(direction[1]) === -1
    const yaw = directionAlongZ
        ? 0
        : Math.abs(angleBetweenVectors(projectedVector, defaultDirection)) * (directionBehindXZ ? -1 : 1)
    const pitch = directionAlongZ
        ? (directionAboveXY ? Math.PI / -2 : Math.PI / 2)
        : Math.abs(angleBetweenVectors(projectedVector, direction)) * (directionAboveXY ? -1 : 1)
    return [yaw, pitch]
}

function angleBetweenVectors(vectorA: DirectionVectorType, vectorB: DirectionVectorType): number {
    const cosTheta = divide(dot(vectorA, vectorB), multiply(norm(vectorA), norm(vectorB))) as number
    const cosThetaClipped = Math.min(Math.max(cosTheta, -1), 1)
    return acos(cosThetaClipped) as number
}
