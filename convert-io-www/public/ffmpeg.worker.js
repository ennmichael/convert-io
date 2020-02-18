/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./ffmpeg.worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ffmpeg.worker.js":
/*!**************************!*\
  !*** ./ffmpeg.worker.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("onmessage = (msg) => {\n    importScripts(`ffmpeg-${msg.data.script}.js`)\n    const programResult = self[msg.data.script]({\n        print(text) {\n            postMessage({\n                type: 'stdout',\n                text,\n            })\n        },\n        setupFilesystem(FS, WORKERFS) {\n            FS.mkdir('/regular-output')\n            FS.mkdir('/stream-output')\n            FS.mkdir('/input')\n\n            FS.mount(WORKERFS, {\n                'files': msg.data.files,\n            }, '/input')\n\n            const id = FS.makedev(43, 7)\n            FS.registerDevice(id, {\n                open(stream) {\n                },\n                write(stream, buffer, offset, length, position) {\n                    if (this.lastPosition !== undefined && position - this.lastPosition !== length) {\n                        const diff = position - (this.lastPosition + length)\n                        console.warn(`Writing to a different position in the stream. Difference is ${diff}.`)\n                    }\n\n                    this.lastPosition = position\n                    postMessage({\n                        type: 'stream-output',\n                        buffer: buffer.slice(offset, offset + length),\n                    })\n                    return length\n                },\n                close(stream) {\n                    postMessage({\n                        type: 'stream-done',\n                    })\n                },\n            })\n            FS.mkdev('/stream-output/dev', id)\n        },\n        programFinished(FS) {\n            const data = FS.readFile('/regular-output/out.mp3', {encoding: 'binary'})\n            const file = new File(data, 'out.mp3', {type: 'audio/mp3'})\n            const outputFileURL = URL.createObjectURL(file)\n            console.log(data.byteLength)\n            postMessage({type: 'done', outputFileURL})\n        },\n\n        arguments: [...msg.data.arguments, '-y'],\n    })\n}\n\n\n//# sourceURL=webpack:///./ffmpeg.worker.js?");

/***/ })

/******/ });