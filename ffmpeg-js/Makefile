# In the future I will use python to generate the Makefile from a template.
# A perfect way to do that would be to use another Makefile to generate this one and run it.

all: ../convert-io-www/src/ffmpeg-js/ffmpeg-flac-mp3.js \
     ../convert-io-www/src/ffmpeg-js/ffmpeg-flac-mp3.d.ts \
     ../convert-io-www/public/ffmpeg-flac-mp3.wasm

../convert-io-www/src/ffmpeg-js/ffmpeg-flac-mp3.d.ts: ffmpeg-js.d.ts
	mkdir -p $(shell dirname $@) && \
	cp $^ $@

../convert-io-www/src/ffmpeg-js/ffmpeg-flac-mp3.js: build/ffmpeg-flac-mp3.js eslint-disable-comment.js
	mkdir -p $(shell dirname $@) && \
	cat eslint-disable-comment.js build/ffmpeg-flac-mp3.js > $@

../convert-io-www/public/ffmpeg-flac-mp3.wasm: build/ffmpeg-flac-mp3.wasm
	cp $^ $@

build/ffmpeg-flac-mp3.wasm build/ffmpeg-flac-mp3.js: build/ffmpeg-flac-mp3.bc pre.js
	cd build && \
	emcc ffmpeg-flac-mp3.bc -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT=worker -s USE_ES6_IMPORT_META=0 \
	-lworkerfs.js --pre-js ../pre.js -o ffmpeg-flac-mp3.js

# TODO
# Should also disable some other libraries like sdl?
# --disable-autodetect to disable auto detected external libs?
build/ffmpeg-flac-mp3.bc: build/libmp3lame/lib/libmp3lame.so
	cd ffmpeg && \
	emconfigure ./configure --disable-doc --disable-ffplay --disable-ffprobe --disable-swscale \
	--extra-ldflags="-L$(shell pwd)/build/libmp3lame/lib/" --extra-cflags="-I$(shell pwd)/build/libmp3lame/include/" \
	--disable-avdevice --disable-swresample --disable-everything --enable-encoder=libmp3lame \
	--enable-encoder=flac --enable-muxer=mp3 --enable-muxer=flac --enable-decoder=mp3 --enable-decoder=flac \
	--enable-demuxer=mp3 --enable-demuxer=flac --enable-libmp3lame --enable-ffmpeg --enable-parser=flac \
	--enable-parser=mpegaudio --enable-protocol=file --enable-cross-compile --cc=emcc --ar=emar --ranlib=emranlib \
	--disable-pthreads --disable-w32threads --disable-os2threads --disable-network --disable-asm --disable-stripping && \
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
	-rm -rf build/libmp3lame/* build/*.js build/*.wasm
