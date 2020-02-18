onmessage = (msg) => {
    importScripts(`ffmpeg-${msg.data.script}.js`)
    const programResult = self[msg.data.script]({
        print(text) {
            postMessage({
                type: 'stdout',
                text,
            })
        },
        setupFilesystem(FS, WORKERFS) {
            FS.mkdir('/regular-output')
            FS.mkdir('/stream-output')
            FS.mkdir('/input')

            FS.mount(WORKERFS, {
                'files': msg.data.files,
            }, '/input')

            const id = FS.makedev(43, 7)
            FS.registerDevice(id, {
                open(stream) {
                },
                write(stream, buffer, offset, length, position) {
                    if (this.lastPosition !== undefined && position - this.lastPosition !== length) {
                        const diff = position - (this.lastPosition + length)
                        console.warn(`Writing to a different position in the stream. Difference is ${diff}.`)
                    }

                    this.lastPosition = position
                    postMessage({
                        type: 'stream-output',
                        buffer: buffer.slice(offset, offset + length),
                    })
                    return length
                },
                close(stream) {
                    postMessage({
                        type: 'stream-done',
                    })
                },
            })
            FS.mkdev('/stream-output/dev', id)
        },
        programFinished(FS) {
            const data = FS.readFile('/regular-output/out.mp3', {encoding: 'binary'})
            const file = new File(data, 'out.mp3', {type: 'audio/mp3'})
            const outputFileURL = URL.createObjectURL(file)
            console.log(data.byteLength)
            postMessage({type: 'done', outputFileURL})
        },

        arguments: [...msg.data.arguments, '-y'],
    })
}
