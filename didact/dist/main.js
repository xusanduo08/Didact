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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Didact.js":
/*!*******************!*\
  !*** ./Didact.js ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar TEXT_ELEMENT = 'TEXT_ELEMENT';\n\nfunction createElement(type, config) {\n  var _ref;\n\n  var props = Object.assign({}, config);\n\n  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    args[_key - 2] = arguments[_key];\n  }\n\n  var hasChildren = args.length > 0;\n  var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : [];\n  props.children = rawChildren.filter(function (c) {\n    return c != null && c !== false;\n  }).map(function (c) {\n    return c instanceof Object ? c : createTextElement(c);\n  });\n  return {\n    type: type,\n    props: props\n  };\n}\n\nfunction createTextElement(value) {\n  return createElement(TEXT_ELEMENT, {\n    nodeValue: value\n  });\n}\n\nfunction render(element, parentDom) {\n  var type = element.type,\n      props = element.props;\n  var isTextElement = type === 'TEXT ELEMENT';\n  var dom = isTextElement ? document.createTextNode('') : document.createElement(type);\n\n  var isListener = function isListener(name) {\n    return name.startsWith('on');\n  };\n\n  Object.keys(props).filter(isListener).forEach(function (name) {\n    var eventType = name.toLocaleLowerCase().substring(2);\n    dom.addEventListener(eventType, props[name]);\n  });\n\n  var isAttribute = function isAttribute(name) {\n    return !isListener(name) && name != 'children';\n  };\n\n  Object.keys(props).filter(isAttribute).forEach(function (name) {\n    dom[name] = props[name];\n  });\n  var childElements = props.children || [];\n  childElements.forEach(function (childElement) {\n    return render(childElement, dom);\n  });\n  console.log(element, parentDom);\n  parentDom.appendChild(dom);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  render: render,\n  createElement: createElement\n});\n\n//# sourceURL=webpack:///./Didact.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Didact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Didact */ \"./Didact.js\");\n/** @jsx Didact.createElement */\n\nvar stories = [{\n  name: \"Didact introduction\",\n  url: \"http://bit.ly/2pX7HNn\"\n}, {\n  name: \"Rendering DOM elements \",\n  url: \"http://bit.ly/2qCOejH\"\n}, {\n  name: \"Element creation and JSX\",\n  url: \"http://bit.ly/2qGbw8S\"\n}, {\n  name: \"Instances and reconciliation\",\n  url: \"http://bit.ly/2q4A746\"\n}, {\n  name: \"Components and state\",\n  url: \"http://bit.ly/2rE16nh\"\n}];\nvar appElement = _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"div\", null, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"ul\", null, stories.map(storyElement)));\n\nfunction storyElement(_ref) {\n  var name = _ref.name,\n      url = _ref.url;\n  var likes = Math.ceil(Math.random() * 100);\n  return _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"li\", null, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"button\", null, likes, \"\\u2764\\uFE0F\"), _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"a\", {\n    href: url\n  }, name));\n}\n\nconsole.log(document.getElementById(\"root\"));\n_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].render(appElement, document.getElementById(\"root\"));\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });