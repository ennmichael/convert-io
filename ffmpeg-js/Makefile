# Environment variables recognized by this Makefile:
# DONT_USE_EMSCRIPTEN - set to 1 to compile into executables instead of LLVM bitcode and JS/WASM output.
# Note that if you use DONT_USE_EMSCRIPTEN, the all target will be empty and you'll have to explicitly specify
# what you want to build.
# OPTIMIZE - set to 1 to optimize the JS/WASM code generation (increases compile time).

ifeq ($(DONT_USE_EMSCRIPTEN), 1)
CC = cc
AR = ar
RANLIB = ranlib
else
EMCONFIGURE = emconfigure
EMMAKE = emmake
CC = emcc
AR = emar
RANLIB = emranlib
endif

ifeq ($(OPTIMIZE), 1)
OPTIMIZATION_FLAGS = -Oz
endif

all: everything

# TODO Might need --enable-protocol=pipe for progress updates
# Should also disable some other libraries like sdl?
# --disable-autodetect to disable auto detected external libs?
COMMON_FLAGS = --disable-doc --disable-ffplay --disable-ffprobe --disable-swscale \
               --disable-avdevice --disable-everything  --enable-ffmpeg \
               --enable-protocol=file --enable-cross-compile \
               --cc=$(CC) --ar=$(AR) --ranlib=$(RANLIB) \
               --disable-pthreads --disable-w32threads --disable-os2threads --disable-network --disable-asm --disable-stripping \
               --enable-small --disable-runtime-cpudetect --disable-alsa --disable-appkit --disable-avfoundation \
               --disable-bzlib --disable-coreimage --disable-sndio --disable-schannel --disable-sdl2 --disable-securetransport \
               --disable-xlib --disable-zlib --disable-dct --disable-dwt --disable-lsp --disable-lzo --disable-mdct \
               --disable-rdft --disable-fft --disable-faan --disable-pixelutils --disable-hwaccels --disable-filters \
               --enable-filter=aresample

# A macro for generating rules to compile ffmpeg to JS with specific features. Macro parameters:
# $(1) - binary name without extension
# $(2) - dependencies separated by whitespace
# $(3) - extra flags for ./configure
define FFMPEG_TEMPLATE
build/ffmpeg-js/$(1).bc: $(2)
	mkdir -p build/ffmpeg-js && \
	cd ffmpeg && \
	$$(EMCONFIGURE) ./configure $$(COMMON_FLAGS) $(3) && \
	$$(EMMAKE) make -j8 && \
	mv ffmpeg ../$$@

ifneq ($(DONT_USE_EMSCRIPTEN), 1)
../convert-io-www/public/ffmpeg-$(1).js: build/ffmpeg-js/ffmpeg-$(1).js
	mkdir -p $$(shell dirname $$@) && \
	cp $$^ $$@

../convert-io-www/public/ffmpeg-$(1).wasm: build/ffmpeg-js/ffmpeg-$(1).wasm
	mkdir -p $$(shell dirname $$@) && \
	cp $$^ $$@

build/ffmpeg-js/ffmpeg-$(1).wasm build/ffmpeg-js/ffmpeg-$(1).js: build/ffmpeg-js/$(1).bc pre.js post.js
	cd build && \
	emcc ffmpeg-js/$(1).bc -s MODULARIZE=1 -s EXPORT_NAME=flacMp3 \
	-s ENVIRONMENT=worker -s USE_ES6_IMPORT_META=0 $$(OPTIMIZATION_FLAGS) \
	-s EXIT_RUNTIME=1 -lworkerfs.js -lidbfs.js --pre-js ../pre.js --post-js ../post.js \
	-o ffmpeg-js/ffmpeg-flacMp3.js

ALL += ../convert-io-www/public/ffmpeg-$(1).js ../convert-io-www/public/ffmpeg-$(1).wasm
endif
endef

$(eval $(call \
FFMPEG_TEMPLATE,flacMp3,\
build/libmp3lame/lib/libmp3lame.so,\
--extra-ldflags="-L$(shell pwd)/build/libmp3lame/lib/" --extra-cflags="-I$(shell pwd)/build/libmp3lame/include/" \
--enable-encoder=libmp3lame --enable-muxer=mp3 --enable-decoder=flac --enable-demuxer=flac \
--enable-libmp3lame --enable-parser=flac))

build/libmp3lame/lib/libmp3lame.so:
	cd lame-3.100 && \
	mkdir -p ../build/libmp3lame && \
	$(EMCONFIGURE) ./configure --disable-frontend --prefix=$(shell pwd)/build/libmp3lame --host=x86-none-linux && \
	$(EMMAKE) make -j8 && \
	$(EMMAKE) make install

.PHONY: all clean everything

everything: $(ALL)

clean:
	-rm -rf build
	-cd ffmpeg && make clean
