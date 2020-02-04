# Should also disable some other libraries like sdl
# --disable-autodetect to disable auto detected external libs?
ffmpeg-mp3-flac: build/libmp3lame/lib/libmp3lame.so
	cd ffmpeg && \
	make clean && \
	emconfigure ./configure --disable-doc --disable-ffplay --disable-ffprobe --disable-swscale \
	--extra-ldflags="-L$(shell pwd)/build/libmp3lame/lib/" --extra-cflags="-I$(shell pwd)/build/libmp3lame/include/" \
	--disable-avdevice --disable-swresample --disable-everything --enable-encoder=libmp3lame \
	--enable-encoder=flac --enable-muxer=mp3 --enable-muxer=flac --enable-decoder=mp3 --enable-decoder=flac \
	--enable-demuxer=mp3 --enable-demuxer=flac --enable-libmp3lame --enable-ffmpeg --enable-parser=flac \
	--enable-parser=mpegaudio --enable-protocol=file --enable-cross-compile --cc=emcc --ar=emar --ranlib=emranlib \
	--disable-pthreads --disable-w32threads --disable-os2threads --disable-network --disable-asm --disable-stripping && \
	emmake make -j8 && \
	cp ffmpeg ../build/ffmpeg.bc && \
	cd ../build && \
	emcc ffmpeg.bc

build/libmp3lame/lib/libmp3lame.so:
	cd lame-3.100 && \
	mkdir -p $(shell pwd)/build/libmp3lame && \
	emconfigure ./configure --disable-frontend --prefix=$(shell pwd)/build/libmp3lame --host=x86-none-linux && \
	emmake make -j8 && \
	emmake make install

.PHONY: clean

clean:
	-rm -rf build/libmp3lame/*
