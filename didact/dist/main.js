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
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar TEXT_ELEMENT = 'TEXT_ELEMENT'; // 创建Didact元素，返回含有type、props属性的对象\n\nfunction createElement(type, config) {\n  var _ref;\n\n  var props = Object.assign({}, config);\n\n  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    args[_key - 2] = arguments[_key];\n  }\n\n  var hasChildren = args.length > 0;\n  var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : [];\n  props.children = rawChildren.filter(function (c) {\n    return c != null && c !== false;\n  }).map(function (c) {\n    return c instanceof Object ? c : createTextElement(c);\n  });\n  return {\n    type: type,\n    props: props\n  };\n}\n\nfunction createTextElement(value) {\n  return createElement(TEXT_ELEMENT, {\n    nodeValue: value\n  });\n}\n\nvar rootInstance = null; // 根实例\n\nfunction render(element, container) {\n  var prevProps = rootInstance;\n  var nextInstance = reconcile(container, prevProps, element);\n  rootInstance = nextInstance;\n} // 实例化一个元素（就是将元素对应的DOM放到对应父DOM中，只有新增的元素需要实例化）\n\n\nfunction instantiate(element) {\n  var type = element.type,\n      props = element.props;\n  var isDomElement = typeof type === 'string';\n\n  if (isDomElement) {\n    var isTextElement = type === 'TEXT_ELEMENT';\n    var dom = isTextElement ? document.createTextNode('') : document.createElement(type);\n    updateDomProperties(dom, [], props);\n    var childElements = props.children || [];\n    var childInstances = childElements.map(instantiate); // 递归实例化子元素\n\n    var childDoms = childInstances.map(function (childInstance) {\n      return childInstance.dom;\n    });\n    childDoms.forEach(function (childDom) {\n      return dom.appendChild(childDom);\n    });\n    var instance = {\n      dom: dom,\n      element: element,\n      childInstances: childInstances\n    };\n    return instance;\n  } else {\n    var _instance = {};\n    var publicInstance = createPublicInstance(element, _instance); // 创建公共实例\n\n    var childElement = publicInstance.render(); // 调用公共实例的render方法，获取组件的子元素\n\n    var childInstance = instantiate(childElement); // 实例化组件的子元素\n\n    var _dom = childInstance.dom;\n    Object.assign(_instance, {\n      dom: _dom,\n      element: element,\n      childInstance: childInstance,\n      publicInstance: publicInstance\n    });\n    return _instance;\n  }\n} // 更新DOM节点属性\n\n\nfunction updateDomProperties(dom, prevProps, nextProps) {\n  var isEvent = function isEvent(name) {\n    return name.startsWith(\"on\");\n  };\n\n  var isAttribute = function isAttribute(name) {\n    return !isEvent(name) && name != \"children\";\n  };\n\n  Object.keys(prevProps).filter(isEvent).forEach(function (name) {\n    var eventType = name.toLowerCase().substring(2);\n    dom.removeEventListener(eventType, prevProps[name]);\n  });\n  Object.keys(prevProps).filter(isAttribute).forEach(function (name) {\n    dom[name] = null;\n  });\n  Object.keys(nextProps).filter(isAttribute).forEach(function (name) {\n    dom[name] = nextProps[name];\n  });\n  Object.keys(nextProps).filter(isEvent).forEach(function (name) {\n    var eventType = name.toLowerCase().substring(2);\n    dom.addEventListener(eventType, nextProps[name]);\n  });\n} // 一致性校验\n\n\nfunction reconcile(parentDom, instance, element) {\n  if (instance == null) {\n    // 有新增的元素\n    var newInstance = instantiate(element);\n    parentDom.appendChild(newInstance.dom);\n    return newInstance;\n  } else if (element == null) {\n    // 需要删除一些节点\n    parentDom.removeChild(instance.dom);\n    return null;\n  } else if (instance.element.type !== element.type) {\n    var _newInstance = instantiate(element);\n\n    parentDom.replaceChild(_newInstance.dom, instance.dom);\n    return _newInstance;\n  } else if (typeof element.type === 'string') {\n    updateDomProperties(instance.dom, instance.element.props, element.props); // 更新属性\n\n    instance.childInstances = reconcileChildren(instance, element); // 对子元素进行一致性校验\n\n    instance.element = element;\n    return instance;\n  } else {\n    // 这地方为什么要做这么一个更新操作？\n    // 答：对象自身的属性和外界是没有关联的。组件是new出来的，其props和外界已经没有了关联，而element身上的props还能反应出外界的变化，所以这时候要更新一下。\n    console.log(element.props, instance.publicInstance);\n    instance.publicInstance.props = element.props;\n    var childElement = instance.publicInstance.render();\n    var oldChildInstance = instance.childInstance;\n    var childInstance = reconcile(parentDom, oldChildInstance, childElement);\n    instance.dom = childInstance.dom;\n    instance.childInstance = childInstance;\n    instance.element = element;\n    return instance;\n  }\n}\n\nfunction reconcileChildren(instance, element) {\n  var dom = instance.dom;\n  var childInstances = instance.childInstances;\n  var nextChildElements = element.props.children || [];\n  var newChildInstances = [];\n  var count = Math.max(childInstances.length, nextChildElements.length);\n\n  for (var i = 0; i < count; i++) {\n    var childInstance = childInstances[i];\n    var childElement = nextChildElements[i];\n    var newChildInstance = reconcile(dom, childInstance, childElement);\n    newChildInstances.push(newChildInstance);\n  }\n\n  return newChildInstances.filter(function (instance) {\n    return instance != null;\n  });\n}\n\nfunction createPublicInstance(element, internalInstance) {\n  var type = element.type,\n      props = element.props;\n  var publicInstance = new type(props);\n  publicInstance.__internalInstance = internalInstance;\n  return publicInstance;\n}\n\nvar Component =\n/*#__PURE__*/\nfunction () {\n  function Component(props) {\n    _classCallCheck(this, Component);\n\n    this.props = props;\n    this.state = this.state || {};\n  }\n\n  _createClass(Component, [{\n    key: \"setState\",\n    value: function setState(partialState) {\n      this.state = Object.assign({}, this.state, partialState);\n      updateInstance(this.__internalInstance);\n    }\n  }]);\n\n  return Component;\n}();\n\nfunction updateInstance(internalInstance) {\n  var parentDom = internalInstance.dom.parentNode;\n  var element = internalInstance.element;\n  reconcile(parentDom, internalInstance, element);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  render: render,\n  createElement: createElement,\n  Component: Component\n});\n\n//# sourceURL=webpack:///./Didact.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Didact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Didact */ \"./Didact.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/** @jsx Didact.createElement */\n\n\nvar randomLikes = function randomLikes() {\n  return Math.ceil(Math.random() * 100);\n};\n\nvar stories = [{\n  name: \"Didact introduction\",\n  url: \"http://bit.ly/2pX7HNn\"\n}, {\n  name: \"Rendering DOM elements \",\n  url: \"http://bit.ly/2qCOejH\"\n}, {\n  name: \"Element creation and JSX\",\n  url: \"http://bit.ly/2qGbw8S\"\n}, {\n  name: \"Instances and reconciliation\",\n  url: \"http://bit.ly/2q4A746\"\n}, {\n  name: \"Components and state\",\n  url: \"http://bit.ly/2rE16nh\"\n}];\n\nvar App =\n/*#__PURE__*/\nfunction (_Didact$Component) {\n  _inherits(App, _Didact$Component);\n\n  function App() {\n    _classCallCheck(this, App);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));\n  }\n\n  _createClass(App, [{\n    key: \"render\",\n    value: function render() {\n      return _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"div\", null, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"h1\", null, \"Didact Stories\"), _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"ul\", null, this.props.stories.map(function (story) {\n        return _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(Story, {\n          name: story.name,\n          url: story.url\n        });\n      })));\n    }\n  }]);\n\n  return App;\n}(_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Component);\n\nvar Story =\n/*#__PURE__*/\nfunction (_Didact$Component2) {\n  _inherits(Story, _Didact$Component2);\n\n  function Story(props) {\n    var _this;\n\n    _classCallCheck(this, Story);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(Story).call(this, props));\n    _this.state = {\n      likes: Math.ceil(Math.random() * 100)\n    };\n    return _this;\n  }\n\n  _createClass(Story, [{\n    key: \"like\",\n    value: function like() {\n      this.setState({\n        likes: this.state.likes + 1\n      });\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this2 = this;\n\n      var _this$props = this.props,\n          name = _this$props.name,\n          url = _this$props.url;\n      var likes = this.state.likes;\n      var likesElement = _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"span\", null);\n      return _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"li\", null, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"button\", {\n        onClick: function onClick(e) {\n          return _this2.like();\n        }\n      }, likes, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"b\", null, \"\\u2764\\uFE0F\")), _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"a\", {\n        href: url\n      }, name));\n    }\n  }]);\n\n  return Story;\n}(_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Component);\n\n_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].render(_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(App, {\n  stories: stories\n}), document.getElementById(\"root\"));\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });