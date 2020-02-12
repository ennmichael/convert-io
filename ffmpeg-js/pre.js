Module['preRun'] = function () {
    FS.mkdir('/in')
    FS.mount(WORKERFS, {
        'files': Module['files'] || [],
    }, '/in')

    FS.mkdir('/out')
    FS.mount(IDBFS, {}, '/out')
    delete Module['files']
}
