export function cl(...classNames: Array<string | boolean | null | undefined>): string {
    const classNamesArray = Array.from(classNames).filter(v => !!v)
    if (classNamesArray.length === 0)
        return ''
    return classNamesArray.join(' ').trim()
}
