export function kebabCase(string: string): string {
    if (!string) return string
    const parts = string.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
    if (!parts) return string
    return parts.join('-').toLowerCase()
}

export function camelCase(string: string): string {
    if (!string) return string
    return string?.replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
        if (match === '') return ''
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
    }).replace(/-/g, '')
}
