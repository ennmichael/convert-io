onmessage = function (msg) {
    var scriptName = 'flacMp3'
    importScripts(`ffmpeg-${scriptName}.js`)
    console.log('...')
    console.log(self[scriptName])
    self[scriptName]({
        arguments: ['-formats'],
        print(text) {
            console.log(text)
        },
        printErr(text) {
            console.log(text)
        },
        onAbort() {
            console.log('aborted')
        },
        noExitRuntime: false,
    })
    console.log('Done')
}