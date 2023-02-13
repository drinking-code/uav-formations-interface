import {Canvg} from 'canvg'
import {DataTexture} from 'three'

export default async function generateDirectionalityTexture(alpha: number, beta: number, bleed: number): Promise<DataTexture> {
    const svgHeight = 128
    const svgWidth = svgHeight * 2
    const yHeight = alpha / 180 * svgHeight
    const xHeight = beta / 360 * svgWidth
    const offsetToCenter = ([x, y]: [number, number]) => [x + svgWidth / 2, y + svgHeight / 2]
    const topVertex = offsetToCenter([0, -yHeight / 2])
    const rightVertex = offsetToCenter([xHeight / 2, 0])
    const bottomVertex = offsetToCenter([0, yHeight / 2])
    const leftVertex = offsetToCenter([-xHeight / 2, 0])
    const background = Array(3).fill(Math.round(255 * bleed).toString(16)).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}">` +
        `<rect height="${svgHeight}" width="${svgWidth}" fill="#${background}"/>` +
        `<polyline points="${topVertex.join(' ')} ${rightVertex.join(' ')} ${bottomVertex.join(' ')} ${leftVertex.join(' ')}" fill="white"/>` +
        '</svg>'

    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    document.body.append(canvas)
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.canvas.height = svgHeight
    ctx.canvas.width = svgWidth
    const cvg = Canvg.fromString(ctx, svg)
    await cvg.render()
    const imageData = ctx.getImageData(0, 0, svgWidth, svgHeight).data
    const dataTexture = new DataTexture(imageData, svgWidth, svgHeight)
    dataTexture.needsUpdate = true
    return dataTexture
}
