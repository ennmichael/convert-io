export function baseNameAndExtension(fileName: string): [string, string] {
    const split = fileName.split('.')

    if (split.length === 1) {
        return [split[0], '']
    }

    const baseName = split.slice(0, split.length - 2).join('.')
    const extension = split[split.length - 1]
    return [baseName, extension]
}
