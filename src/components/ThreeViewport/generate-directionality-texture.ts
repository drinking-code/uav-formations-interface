import {Canvg} from 'canvg'
import {DataTexture} from 'three'
import {TwoKeyMapLaxSecondKey} from '../../../server/formation-cache'

const cachedTextures = new TwoKeyMapLaxSecondKey()

const svgHeight = 128
const svgWidth = svgHeight * 2

export default async function generateDirectionalityTexture(alpha: number, beta: number, bleed: number): Promise<DataTexture> {
    alpha = Math.max(Math.min(alpha, 180), 0)
    beta = Math.max(Math.min(beta, 360), 0)
    bleed = Math.max(Math.min(bleed, 1), 0)
    if (cachedTextures.has(bleed, [alpha, beta]))
        return cachedTextures.get(bleed, [alpha, beta])
    const yHeight = alpha / 180 * svgHeight
    const xHeight = beta / 360 * svgWidth
    const offsetToCenter = ([x, y]: [number, number]) => [x + svgWidth / 2, y + svgHeight / 2]
    const topVertex = offsetToCenter([0, -yHeight / 2])
    const rightVertex = offsetToCenter([xHeight / 2, 0])
    const bottomVertex = offsetToCenter([0, yHeight / 2])
    const leftVertex = offsetToCenter([-xHeight / 2, 0])
    const rhombusPoints = [topVertex, rightVertex, bottomVertex, leftVertex].map(point => point.join(' ')).join(' ')
    const background = Array(3).fill(Math.round(255 * bleed).toString(16)).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}">` +
        `<filter id="blur"><feGaussianBlur stdDeviation="${svgHeight / 10}"/></filter>` +
        `<rect height="${svgHeight}" width="${svgWidth}" fill="#${background}"/>` +
        `<polyline points="${rhombusPoints}" fill="white" filter="url(#blur)"/>` +
        '</svg>'

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.canvas.height = svgHeight
    ctx.canvas.width = svgWidth
    const cvg = Canvg.fromString(ctx, svg)
    await cvg.render()
    const imageData = ctx.getImageData(0, 0, svgWidth, svgHeight).data
    const dataTexture = new DataTexture(imageData, svgWidth, svgHeight)
    cachedTextures.set(bleed, [alpha, beta], dataTexture)
    dataTexture.needsUpdate = true
    return dataTexture
}
