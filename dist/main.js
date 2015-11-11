/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {var app = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"app\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // Module to control application life.
	var BrowserWindow = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"browser-window\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // Module to create native browser window.

	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	var mainWindow = null;

	app.on('window-all-closed', function () {
	  app.quit();
	});

	app.on('ready', function () {
	  // Create the browser window.
	  mainWindow = new BrowserWindow({ width: 750, height: 450 });

	  // and load the index.html of the app.
	  mainWindow.loadUrl('file://' + __dirname + '/index.html');

	  mainWindow.on('closed', function () {
	    mainWindow = null;
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }
/******/ ]);