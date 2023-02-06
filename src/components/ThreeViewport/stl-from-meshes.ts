import {BufferGeometry, Mesh, Object3D, Scene} from 'three'
import {STLExporter} from './STLExporter'

export default function stlFromMeshes(meshes: BufferGeometry[]): string {
    const fakeScene = {
        traverse(callback: (object: Object3D) => void) {
            meshes.forEach(geometry => {
                const mesh = new Mesh(geometry.clone())
                callback(mesh)
            })
        }
    }
    return (new STLExporter()).parse(fakeScene as Scene)
}
