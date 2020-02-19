import {baseNameAndExtension} from './utils'

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

    public available: boolean = true
    public onStream?: (data: Int8Array) => void
    public onFinished?: (outputFile?: File) => void

    public constructor() {
        this.worker = new Worker('ffmpeg.worker.js')
    }

    public convertFile(opts: FileConversionOptions): void {
        const [inputFileBaseName, _] = baseNameAndExtension(opts.inputFile.name)
        const outputFileName = `${inputFileBaseName}.${opts.outputFormat}`

        this.available = false

        this.worker.postMessage({
            inputFile: opts.inputFile,
            outputFileName,
            streamOutput: opts.streamOutput,
        })

        this.worker.onmessage = this.handleMessage.bind(this)
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
            default:
                throw new Error('Unhandled message type for ffmpeg worker')
        }
    }
}

