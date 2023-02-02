// @ts-ignore
const ctx = require.context('./')
const strings: { [lang: string]: { [key: string]: string } } = {}

ctx.keys().filter((path: string) => path.endsWith('.yml'))
    .forEach((path: string) => {
        const parsedFileName = path.toLowerCase().match(/([a-z-]+)\.([a-z]+)\.yml/)
        if (!parsedFileName) return
        parsedFileName.shift()

        if (!strings[parsedFileName[1]])
            strings[parsedFileName[1]] = {}

        strings[parsedFileName[1]][parsedFileName[0]] = ctx(path).default
    })

export default function str(key: string, lang = 'en'): string {
    const keyPath = key.split('.')
    if (!strings[lang]) lang = 'en'
    let output: string | typeof strings[string] = strings[lang]
    while (keyPath.length > 0) {
        if (typeof output === 'string') break // ts needs this
        output = output[keyPath.shift() as string]
    }
    return output as string
}
