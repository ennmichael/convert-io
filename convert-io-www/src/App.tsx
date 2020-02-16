import React, {useEffect} from 'react'
import './App.scss'

function App() {
    useEffect(() => {
        const worker = new Worker('ffmpeg.worker.js')
        worker.postMessage({
            x: 'y',
        })
    }, [])

    return (
        <h1>Hello</h1>
    )
}

export default App
