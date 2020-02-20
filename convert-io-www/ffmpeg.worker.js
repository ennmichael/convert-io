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
            FS.mkdir('/input')
            FS.mkdir('/output')

            FS.mount(WORKERFS, {
                'files': [msg.data.inputFile],
            }, '/input')

            if (msg.data.streamOutput)
                createOutputStreamDevice()

            function createOutputStreamDevice() {
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
                            type: 'stream',
                            data: buffer.slice(offset, offset + length),
                        })

                        return length
                    },
                    close(stream) {
                    },
                })
                FS.mkdev(`/output/${msg.data.outputFileName}`, id)
            }
        },
        programFinished(FS) {
            let outputFile

            if (!msg.data.streamOutput) {
                const outputFileData = FS.readFile(`/output/${msg.data.outputFileName}`, {encoding: 'binary'})
                outputFile = new File([outputFileData], msg.data.outputFileName, {type: 'audio/mp3'})
            }

            postMessage({type: 'finished', outputFile})
        },

        arguments: ['-i', `/input/${msg.data.inputFile.name}`, `/output/${msg.data.outputFileName}`, '-y'],
    })
}
