import React, {useEffect} from 'react'
import './App.scss'

function App() {
    useEffect(() => {
        (async function () {
            const {default: ffmpeg} = await import('./ffmpeg-js/ffmpeg-flac-mp3')
            ffmpeg({
                arguments: ['-formats'],
            })
        })()
    }, [])

    return (
        <h1>Hello</h1>
    )
}

export default App
