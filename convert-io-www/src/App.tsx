import React, {ChangeEvent, useState} from 'react'
import {saveAs} from 'file-saver'
import './App.scss'

function App() {
    const [inputFile, setInputFile] = useState<File>()

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

        const worker =
        worker.postMessage({
            script: 'flacMp3',
            arguments: ['-i', `/input/${inputFile.name}`, '-f', 'mp3', '/regular-output/out.mp3'],
            files: [inputFile],
        })

        worker.onmessage = async (msg) => {
            if (msg.data.type === 'stream-output') {
                // TODO Use this when streaming the output
            } else if (msg.data.type === 'done') {
                saveAs(msg.data.outputFile, 'out.mp3')
            }
        }
    }

    return (
        <div>
            <input onChange={onFileChange} type="file"/>
            <button onClick={onConvert}>Convert</button>
        </div>
    )
}

export default App
