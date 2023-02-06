export default async function setOptions(options: {}) {
    await fetch('/options', {
        method: 'put',
        body: JSON.stringify(options),
        headers: {
            'Content-Type': 'application/json'
        },
    })
}
