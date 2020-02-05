// We have access to Module here, i.e. to the Module object *PASSED*
// to the modularized JS file from the client. This means client code can put some arbitrary properties
// on Module, and we can use them here. The property will be ffmpegFiles, and we'll use it
// to create an IDBFS file system with those files. Another useful thing is: if the ffmpegFiles
// property contains ReadableStreams, which it should, we can in fact stream those files into
// the IDBFS via FS.write.

function PREJSHEREBOYS() {

}