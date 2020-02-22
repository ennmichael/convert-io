import {baseNameAndExtension, capitalize} from './utils'

export interface FileConversionOptions {
    inputFile: File
    outputFormat: string
    streamOutput?: boolean
}

/**
 * Represents a single ffmpeg worker process in the background.
 * When streaming files, use onStream to respond to arriving chunks of data. The outputFile parameter
 * for onFinished will be undefined in this case.
 */
export default class FfmpegWorker {
    private worker: Worker
    private progressTracker = new ProgressTracker()

    public available: boolean = true
    public onStream?: (data: Int8Array) => void
    /**
     * This callback gets fired whenever a progress update happens. The progress parameter is a floating point
     * number in the range [0, 1].
     */
    public onProgress?: (progress: number) => void
    public onFinished?: (outputFile?: File) => void

    public constructor() {
        this.worker = new Worker('ffmpeg.worker.js')
    }

    public convertFile(opts: FileConversionOptions): void {
        const [inputFileBaseName, inputFormat] = baseNameAndExtension(opts.inputFile.name)
        const outputFileName = `${inputFileBaseName}.${opts.outputFormat}`

        this.available = false

        this.worker.postMessage({
            inputFile: opts.inputFile,
            outputFileName,
            streamOutput: opts.streamOutput,
            script: FfmpegWorker.getConversionScriptName(inputFormat, opts.outputFormat),
            extraArguments: ['-nostdin', '-progress', 'pipe:1'],
        })

        this.worker.onmessage = this.handleMessage.bind(this)
        if (this.onProgress !== undefined)
            this.onProgress(0)
    }

    private handleMessage(msg: MessageEvent): void {
        switch (msg.data.type) {
            case 'stream':
                if (this.onStream !== undefined)
                    this.onStream(msg.data.data)
                break
            case 'finished':
                if (this.onFinished !== undefined)
                    this.onFinished(msg.data.outputFile)
                this.available = true
                break
            case 'stdout':
                const progress = this.progressTracker.getProgress(msg.data.text)
                if (progress !== undefined && this.onProgress !== undefined)
                    this.onProgress(progress)
                break
            case 'stderr':
                this.progressTracker.updateDuration(msg.data.text)
                break
            default:
                throw new Error('Unknown message type')
        }
    }

    private static getConversionScriptName(inputFormat: string, outputFormat: string): string {
        const a = [inputFormat, outputFormat]
        a.sort()
        return `${a[0]}${capitalize(a[1])}`
    }
}

class ProgressTracker {
    private duration: number | undefined

    /**
     * @param text the text to parse.
     * @return the progress as a floating point number in the range [0, 1], or undefined if text parsing fails.
     */
    public getProgress(text: string): number | undefined {
        if (this.duration === undefined)
            return undefined

        const regex = /out_time_us=(\d+)/
        const match = regex.exec(text)
        if (match === null)
            return undefined

        const outTime = Number(match[1]) / 1e6
        return outTime / this.duration
    }

    public updateDuration(text: string): boolean {
        const duration = extractDuration()
        if (duration === undefined)
            return false

        this.duration = duration
        return true

        function extractDuration(): number | undefined {
            const regex = /Duration: (\d+):(\d+):(\d+.\d+)/
            const match = regex.exec(text)

            if (match === null)
                return undefined

            const hours = match[1]
            const minutes = match[2]
            const seconds = match[3]
            return Number(seconds) + Number(minutes) * 60 + Number(hours) * 3600
        }
    }
}

