Module['preRun'] = function () {
    FS.mkdir('/workerfs')
    FS.mount(WORKERFS, {
        'files': Module['files'] || [],
    }, '/workerfs')

    FS.mkdir('/idbfs')
    FS.mount(IDBFS, {}, '/idbfs')
    delete Module['files']

    var stream = FS.open('/idbfs/file.txt', 'w+')
    var data = new Uint8Array(10)
    console.log(stream, data)
    FS.write(stream, data, 0, data.length)
    FS.close(stream)
    FS.syncfs(false, function(err) {
        console.log(err)
    })
}
