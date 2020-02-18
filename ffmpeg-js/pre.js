Module['preRun'] = function () {
    Module['setupFilesystem'](FS, WORKERFS)
    delete Module['setupFilesystem']
}

Module['postRun'] = function() {
    Module['programFinished'](FS)
    delete Module['programFinished']
}
