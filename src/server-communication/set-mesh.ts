export default async function setMesh(mesh: string) {
    await fetch('/mesh', {
        method: 'put',
        body: mesh,
        headers: {
            'Content-Type': 'text/plain'
        },
    })
}
