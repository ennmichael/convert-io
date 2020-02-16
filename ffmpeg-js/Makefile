# In the future I will use python to generate the Makefile from a template.
# A perfect way to do that would be to use another Makefile to generate this one and run it.

all: ../convert-io-www/public/ffmpeg-flacMp3.js \
     ../convert-io-www/public/ffmpeg-flacMp3.wasm

../convert-io-www/public/ffmpeg-flacMp3.js: build/ffmpeg-js/ffmpeg-flacMp3.js eslint-disable-comment.js
	mkdir -p $(shell dirname $@) && \
	cat eslint-disable-comment.js build/ffmpeg-js/ffmpeg-flacMp3.js > $@

../convert-io-www/public/ffmpeg-flacMp3.wasm: build/ffmpeg-js/ffmpeg-flacMp3.wasm
	mkdir -p $(shell dirname $@) && \
	cp $^ $@

build/ffmpeg-js/ffmpeg-flacMp3.wasm build/ffmpeg-js/ffmpeg-flacMp3.js: build/ffmpeg-js/flac-mp3.bc pre.js
	cd build && \
	emcc ffmpeg-js/flac-mp3.bc -s MODULARIZE=1 -s EXPORT_NAME=flacMp3 -s ENVIRONMENT=worker -s USE_ES6_IMPORT_META=0 \
	-s EXIT_RUNTIME=1 -lworkerfs.js -lidbfs.js --pre-js ../pre.js -Oz -o ffmpeg-js/ffmpeg-flacMp3.js

# TODO
# Should also disable some other libraries like sdl?
# --disable-autodetect to disable auto detected external libs?
build/ffmpeg-js/flac-mp3.bc: build/libmp3lame/lib/libmp3lame.so
	mkdir -p build/ffmpeg-js && \
	cd ffmpeg && \
	emconfigure ./configure --disable-doc --disable-ffplay --disable-ffprobe --disable-swscale \
	--extra-ldflags="-L$(shell pwd)/build/libmp3lame/lib/" --extra-cflags="-I$(shell pwd)/build/libmp3lame/include/" \
	--disable-avdevice --disable-swresample --disable-everything --enable-encoder=libmp3lame \
	--enable-encoder=flac --enable-muxer=mp3 --enable-muxer=flac --enable-decoder=mp3 --enable-decoder=flac \
	--enable-demuxer=mp3 --enable-demuxer=flac --enable-libmp3lame --enable-ffmpeg --enable-parser=flac \
	--enable-parser=mpegaudio --enable-protocol=file --enable-cross-compile --cc=emcc --ar=emar --ranlib=emranlib \
	--disable-pthreads --disable-w32threads --disable-os2threads --disable-network --disable-asm --disable-stripping \
	--enable-small --disable-runtime-cpudetect --disable-alsa --disable-appkit --disable-avfoundation \
	--disable-bzlib --disable-coreimage --disable-sndio --disable-schannel --disable-sdl2 --disable-securetransport \
	--disable-xlib --disable-zlib --disable-dct --disable-dwt --disable-lsp --disable-lzo --disable-mdct \
	--disable-rdft --disable-fft --disable-faan --disable-pixelutils --disable-hwaccels && \
	emmake make -j8 && \
	mv ffmpeg ../$@

build/libmp3lame/lib/libmp3lame.so:
	cd lame-3.100 && \
	mkdir -p ../build/libmp3lame && \
	emconfigure ./configure --disable-frontend --prefix=$(shell pwd)/build/libmp3lame --host=x86-none-linux && \
	emmake make -j8 && \
	emmake make install

.PHONY: all clean

clean:
	-rm -rf build
