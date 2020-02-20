import React, {ChangeEvent, useRef, useState} from 'react'
import './App.scss'
import FfmpegWorker from './FfmpegWorker'

function App() {
    const [inputFile, setInputFile] = useState<File>()
    const [outputFormat, setOutputFormat] = useState('mp3')
    const downloadRef = useRef<HTMLAnchorElement | null>(null)

    function onFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) {
            return
        }

        setInputFile(e.target.files[0])
    }

    function onConvertClick() {
        startNonStreamingConversion()
    }

    function startNonStreamingConversion() {
        if (inputFile === undefined) {
            throw new Error('inputFile is undefined')
        }

        const ffmpegWorker = new FfmpegWorker()

        ffmpegWorker.onFinished = (outputFile) => {
            if (downloadRef.current === null) {
                throw new Error('downloadRef is undefined')
            }

            if (outputFile === undefined) {
                throw new Error('outputFile is undefined')
            }

            downloadRef.current.href = URL.createObjectURL(outputFile)
            downloadRef.current.download = outputFile.name
            downloadRef.current.click()
        }

        ffmpegWorker.convertFile({
            inputFile,
            outputFormat,
        })
    }

    return (
        <div>
            <input onChange={onFileChange} type="file"/>
            <input onChange={e => setOutputFormat(e.target.value)} value={outputFormat}/>
            <button disabled={inputFile === undefined} onClick={onConvertClick}>Convert</button>
            <a hidden ref={downloadRef} download/>
        </div>
    )
}

export default App
