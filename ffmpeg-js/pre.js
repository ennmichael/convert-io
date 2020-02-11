Module['preRun'] = function() {
    FS.mkdir('/work')
    FS.mount(WORKERFS, {
        'files': Module['files'] || [],
    }, '/work')
    delete Module['files']
}
