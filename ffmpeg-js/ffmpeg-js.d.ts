export = ffmpeg

declare function ffmpeg(args: ModuleArguments): void

interface ModuleArguments {
    arguments?: string[]
    onAbort?: () => void
    print?: (data: string) => void
    printErr?: (err: string) => void
    files?: File[] | FileList
}
