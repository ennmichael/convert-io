import React, {ChangeEvent, useState} from 'react'
import './App.scss'

function App() {
    const [inputFile, setInputFile] = useState<File>()
    const [downloadUrl, setDownloadUrl] = useState("")

    function onFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) {
            return
        }

        setInputFile(e.target.files[0])
    }

    function onConvert() {
        if (inputFile === undefined) {
            return
        }

        const worker = new Worker('ffmpeg.worker.js')
        worker.postMessage({
            script: 'flacMp3',
            arguments: ['-i', `/input/${inputFile.name}`, '-f', 'mp3', '/regular-output/out.mp3'],
            files: [inputFile],
        })

        worker.onmessage = async (msg) => {
            if (msg.data.type === 'stream-output') {
                // TODO Use this when streaming the output
            } else if (msg.data.type === 'done') {
                console.log('DONE')
                setDownloadUrl(msg.data.outputFileURL)
            }
        }
    }

    return (
        <div>
            <input onChange={onFileChange} type="file"/>
            <button onClick={onConvert}>Convert</button>
            <a href={downloadUrl} download={'out.mp3'}>Download</a>
        </div>
    )
}

export default App
