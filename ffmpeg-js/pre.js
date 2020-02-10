FS.unmount('/')
FS.mount(WORKERFS, {
    'files': Module['files'],
}, '/')
delete Module['files']
