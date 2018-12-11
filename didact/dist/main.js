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
/*! exports provided: default, createElement, Component, render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ \"./element.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"createElement\", function() { return _element__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"]; });\n\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component */ \"./component.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Component\", function() { return _component__WEBPACK_IMPORTED_MODULE_1__[\"Component\"]; });\n\n/* harmony import */ var _reconciler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reconciler */ \"./reconciler.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _reconciler__WEBPACK_IMPORTED_MODULE_2__[\"render\"]; });\n\n/**\r\n * render => reconcile => instantiate => 初始化实例，creratePublicInstance\r\n * publicInstance:{updateInstance:(f), __internalInstance:(Object)}\r\n * updateInstance=>reconcile(internalInstance.dom.parentDom, internalInstance, internalInstance.element) =>重新执行公共实例render方法，获取新的子元素\r\n * \r\n*/\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  render: _reconciler__WEBPACK_IMPORTED_MODULE_2__[\"render\"],\n  createElement: _element__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"],\n  Component: _component__WEBPACK_IMPORTED_MODULE_1__[\"Component\"]\n});\n\n\n//# sourceURL=webpack:///./Didact.js?");

/***/ }),

/***/ "./component.js":
/*!**********************!*\
  !*** ./component.js ***!
  \**********************/
/*! exports provided: Component, createInstance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Component\", function() { return Component; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createInstance\", function() { return createInstance; });\n/* harmony import */ var _reconciler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reconciler */ \"./reconciler.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\nvar Component =\n/*#__PURE__*/\nfunction () {\n  function Component(props) {\n    _classCallCheck(this, Component);\n\n    this.props = props || {};\n    this.state = this.state || {};\n  }\n\n  _createClass(Component, [{\n    key: \"setState\",\n    value: function setState(partialState) {\n      Object(_reconciler__WEBPACK_IMPORTED_MODULE_0__[\"scheduleUpdate\"])(this, partialState);\n    }\n  }]);\n\n  return Component;\n}();\nfunction createInstance(fiber) {\n  var instance = new fiber.type(fiber.props);\n  instance.__fiber = fiber;\n  return instance;\n}\n\n//# sourceURL=webpack:///./component.js?");

/***/ }),

/***/ "./dom-utils.js":
/*!**********************!*\
  !*** ./dom-utils.js ***!
  \**********************/
/*! exports provided: updateDomProperties, createDomElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateDomProperties\", function() { return updateDomProperties; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createDomElement\", function() { return createDomElement; });\n/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ \"./element.js\");\n\n\nvar isEvent = function isEvent(name) {\n  return name.startsWith('on');\n};\n\nvar isAttribute = function isAttribute(name) {\n  return !isEvent(name) && name != 'children' && name != 'style';\n};\n\nvar isNew = function isNew(prev, next) {\n  return function (key) {\n    return prev[key] !== next[key];\n  };\n};\n\nvar isGone = function isGone(prev, next) {\n  return function (key) {\n    return !(key in next);\n  };\n};\n\nfunction updateDomProperties(dom, prevProps, nextProps) {\n  // 移除过时的事件监听\n  Object.keys(prevProps).filter(isEvent).filter(function (key) {\n    return !(key in nextProps) || isNew(prevProps, nextProps)(key);\n  }).forEach(function (name) {\n    var eventType = name.toLowerCase().substring(2);\n    dom.removeEventListener(eventType, prevProps[name]);\n  }); //  移除属性\n\n  Object.keys(prevProps).filter(isAttribute).filter(isGone(prevProps, nextProps)).forEach(function (name) {\n    dom[name] = null;\n  }); // 设置属性\n\n  Object.keys(nextProps).filter(isAttribute).filter(isNew(prevProps, nextProps)).forEach(function (name) {\n    dom[name] = nextProps[name];\n  }); // 设置样式\n\n  prevProps.style = prevProps.style || {};\n  nextProps.style = nextProps.style || {};\n  Object.keys(nextProps.style).filter(isNew(prevProps.style, nextProps.style)).forEach(function (key) {\n    dom.style[key] = nextPropss.style[key];\n  }); // 删除过时的属性\n\n  Object.keys(prevProps.style).filter(isGone(prevProps.style, nextProps.style)).forEach(function (key) {\n    dom.style[key] = '';\n  }); //添加事件监听\n\n  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(function (name) {\n    var eventType = name.toLowerCase().substring(2);\n    dom.addEventListener(eventType, nextProps[name]);\n  });\n}\nfunction createDomElement(fiber) {\n  var isTextElement = fiber.type === _element__WEBPACK_IMPORTED_MODULE_0__[\"TEXT_ELEMENT\"];\n  var dom = isTextElement ? document.createTextNode('') : document.createElement(fiber.type);\n  updateDomProperties(dom, [], fiber.props);\n  return dom;\n}\n\n//# sourceURL=webpack:///./dom-utils.js?");

/***/ }),

/***/ "./element.js":
/*!********************!*\
  !*** ./element.js ***!
  \********************/
/*! exports provided: TEXT_ELEMENT, createElement, createTextElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TEXT_ELEMENT\", function() { return TEXT_ELEMENT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createElement\", function() { return createElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createTextElement\", function() { return createTextElement; });\nvar TEXT_ELEMENT = 'TEXT_ELEMENT'; //  babel用这个方法来创建JSX的对象表示\n\nfunction createElement(type, config) {\n  var _ref;\n\n  var props = Object.assign({}, config);\n\n  for (var _len = arguments.length, arg = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    arg[_key - 2] = arguments[_key];\n  }\n\n  var hasChildren = arg.length > 0;\n  var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, arg) : [];\n  props.children = rawChildren.filter(function (c) {\n    return c != null && c != false;\n  }).map(function (c) {\n    return c instanceof Object ? c : createTextElement(c);\n  });\n  return {\n    type: type,\n    props: props\n  };\n}\nfunction createTextElement(value) {\n  return createElement(TEXT_ELEMENT, {\n    nodeValue: value\n  });\n}\n\n//# sourceURL=webpack:///./element.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Didact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Didact */ \"./Didact.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/** @jsx Didact.createElement */\n\n\nvar randomLikes = function randomLikes() {\n  return Math.ceil(Math.random() * 100);\n};\n\nvar stories = [{\n  name: \"Didact introduction\",\n  url: \"http://bit.ly/2pX7HNn\"\n}, {\n  name: \"Rendering DOM elements \",\n  url: \"http://bit.ly/2qCOejH\"\n}, {\n  name: \"Element creation and JSX\",\n  url: \"http://bit.ly/2qGbw8S\"\n}, {\n  name: \"Instances and reconciliation\",\n  url: \"http://bit.ly/2q4A746\"\n}, {\n  name: \"Components and state\",\n  url: \"http://bit.ly/2rE16nh\"\n}];\n\nvar App =\n/*#__PURE__*/\nfunction (_Didact$Component) {\n  _inherits(App, _Didact$Component);\n\n  function App() {\n    _classCallCheck(this, App);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));\n  }\n\n  _createClass(App, [{\n    key: \"render\",\n    value: function render() {\n      return _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"div\", null, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"h1\", null, \"Didact Stories\"), _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"ul\", null, this.props.stories.map(function (story) {\n        return _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(Story, {\n          name: story.name,\n          url: story.url\n        });\n      })));\n    }\n  }]);\n\n  return App;\n}(_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Component);\n\nvar Story =\n/*#__PURE__*/\nfunction (_Didact$Component2) {\n  _inherits(Story, _Didact$Component2);\n\n  function Story(props) {\n    var _this;\n\n    _classCallCheck(this, Story);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(Story).call(this, props));\n    _this.state = {\n      likes: Math.ceil(Math.random() * 100)\n    };\n    return _this;\n  }\n\n  _createClass(Story, [{\n    key: \"like\",\n    value: function like() {\n      this.setState({\n        likes: this.state.likes + 1\n      });\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this2 = this;\n\n      var _this$props = this.props,\n          name = _this$props.name,\n          url = _this$props.url;\n      var likes = this.state.likes;\n      var likesElement = _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"span\", null);\n      return _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"li\", null, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"button\", {\n        onClick: function onClick(e) {\n          return _this2.like();\n        }\n      }, likes, _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"b\", null, \"\\u2764\\uFE0F\")), _Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"a\", {\n        href: url\n      }, name));\n    }\n  }]);\n\n  return Story;\n}(_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Component);\n\n_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].render(_Didact__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(App, {\n  stories: stories\n}), document.getElementById(\"root\"));\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./reconciler.js":
/*!***********************!*\
  !*** ./reconciler.js ***!
  \***********************/
/*! exports provided: render, scheduleUpdate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scheduleUpdate\", function() { return scheduleUpdate; });\n/* harmony import */ var _dom_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils */ \"./dom-utils.js\");\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component */ \"./component.js\");\n\n // Fiber tags\n\nvar HOST_COMPONENT = 'host';\nvar CLASS_COMPONENT = 'class';\nvar HOST_ROOT = 'root'; // Effect tags\n\nvar PLACEMENT = 1;\nvar DELETION = 2;\nvar UPDATE = 3;\nvar ENOUGH_TIME = 1; // Global state\n\nvar updateQueue = [];\nvar nextUnitOfWork = null;\nvar pendingCommit = null; // 根节点的render方法\n\nfunction render(elements, containerDom) {\n  updateQueue.push({\n    from: HOST_ROOT,\n    dom: containerDom,\n    newProps: {\n      children: elements\n    }\n  });\n  requestIdleCallback(performWork);\n} // 组件的setState()中会调用该方法。\n\nfunction scheduleUpdate(instance, partialState) {\n  updateQueue.push({\n    from: CLASS_COMPONENT,\n    instance: instance,\n    partialState: partialState\n  });\n  requestIdleCallback(performWork);\n}\n\nfunction performWork(deadline) {\n  workLoop(deadline);\n\n  if (nextUnitOfWork || updateQueue.length > 0) {\n    requestIdleCallback(performWork);\n  }\n}\n\nfunction workLoop(deadline) {\n  if (!nextUnitOfWork) {\n    resetNextUnitOfWork();\n  }\n\n  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {\n    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);\n  }\n\n  if (pendingCommit) {\n    commitAllWork(pendingCommit);\n  }\n} // 产生第一个nextUnitOfWork，也就是根fiber节点\n\n\nfunction resetNextUnitOfWork() {\n  var update = updateQueue.shift();\n\n  if (!update) {\n    return;\n  }\n\n  if (update.partialState) {\n    update.instance.__fiber.partialState = update.partialState;\n  } // 根fiber对应dom有个__rootContainer属性，保存着根fiber节点。\n\n\n  var root = update.from == HOST_ROOT ? update.dom.__rootContainerFiber : getRoot(update.instance.__fiber);\n  console.log(update); // 返回一个新的根fiber\n\n  nextUnitOfWork = {\n    tag: HOST_ROOT,\n    stateNode: update.dom || root.stateNode,\n    props: update.newProps || root.props,\n    alternate: root\n  };\n} // 从某一fiber节点往上寻找根fiber节点\n\n\nfunction getRoot(fiber) {\n  var node = fiber;\n\n  while (node.parent) {\n    node = node.parent;\n  }\n\n  return node;\n}\n\nfunction performUnitOfWork(wipFiber) {\n  beginWork(wipFiber); // beginWork()之后，wipFiber可能会含有child属性\n\n  if (wipFiber.child) {\n    return wipFiber.child;\n  }\n\n  var uow = wipFiber; // 如果没有子节点，则返回自己的兄弟节点或者最近的含有兄弟节点的祖先节点的兄弟节点\n\n  while (uow) {\n    completeWork(uow);\n\n    if (uow.sibling) {\n      return uow.sibling;\n    }\n\n    uow = uow.parent;\n  }\n} // 分类处理fiber\n\n\nfunction beginWork(wipFiber) {\n  if (wipFiber.tag == CLASS_COMPONENT) {\n    updateClassComponent(wipFiber);\n  } else {\n    updateHostComponent(wipFiber);\n  }\n} // 处理原生DOM对应的fiber\n\n\nfunction updateHostComponent(wipFiber) {\n  if (!wipFiber.stateNode) {\n    // 先检查有无stateNode，没有的话创建\n    wipFiber.stateNode = Object(_dom_utils__WEBPACK_IMPORTED_MODULE_0__[\"createDomElement\"])(wipFiber);\n  }\n\n  var newChildElements = wipFiber.props.children;\n  reconcileChildrenArray(wipFiber, newChildElements);\n} // 处理组件对应的fiber\n\n\nfunction updateClassComponent(wipFiber) {\n  var instance = wipFiber.stateNode;\n\n  if (instance == null) {\n    instance = wipFiber.stateNode = Object(_component__WEBPACK_IMPORTED_MODULE_1__[\"createInstance\"])(wipFiber);\n  } else if (wipFiber.props == instance.props && !wipFiber.partialState) {\n    // No need to render, clone children from last time\n    cloneChildFibers(wipFiber);\n    return;\n  }\n\n  instance.props = wipFiber.props; // 这地方似乎没必要做这样一个赋值操作\n\n  instance.state = Object.assign({}, instance.state, wipFiber.partialState);\n  wipFiber.partialState = null;\n  var newChildElements = wipFiber.stateNode.render();\n  reconcileChildrenArray(wipFiber, newChildElements);\n}\n\nfunction arrify(val) {\n  return val == null ? [] : Array.isArray(val) ? val : [val];\n} // 对传入的子元素进行一致性校验\n\n\nfunction reconcileChildrenArray(wipFiber, newChildElements) {\n  var elements = arrify(newChildElements);\n  var index = 0; // 获取对应oldFiber的child\n\n  var oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;\n  var newFiber = null;\n\n  while (index < elements.length || oldFiber != null) {\n    var prevFiber = newFiber;\n    var element = index < elements.length && elements[index];\n    var sameType = oldFiber && element && element.type == oldFiber.type;\n\n    if (sameType) {\n      // 如果是同种类型，则新fiber的很多属性可以直接从对应的oldFiber上取\n      newFiber = {\n        type: oldFiber.type,\n        tag: oldFiber.tag,\n        stateNode: oldFiber.stateNode,\n        props: element.props,\n        parent: wipFiber,\n        alternate: oldFiber,\n        partialState: oldFiber.partialState,\n        effectTag: UPDATE\n      };\n    }\n\n    if (element && !sameType) {\n      // 不同类型\n      newFiber = {\n        type: element.type,\n        tag: typeof element.type === 'string' ? HOST_COMPONENT : CLASS_COMPONENT,\n        props: element.props,\n        parent: wipFiber,\n        effectTag: PLACEMENT\n      };\n    } // 如果是不同类型的，则oldFiber需要被删除，并且需要被放到新fiber的effects数组中。\n\n\n    if (oldFiber && !sameType) {\n      oldFiber.effectTag = DELETION;\n      wipFiber.effects = wipFiber.effects || [];\n      wipFiber.effects.push(oldFiber);\n    }\n\n    if (oldFiber) {\n      oldFiber = oldFiber.sibling; // 继续兄弟元素\n    }\n\n    if (index == 0) {\n      wipFiber.child = newFiber; // 第一个子fiber挂在child属性上\n    } else if (prevFiber && element) {\n      prevFiber.sibling = newFiber; // 同级子fiber之间通过sibling来关联\n    }\n\n    index++;\n  }\n} // 克隆一个fiber节点\n\n\nfunction cloneChildFibers(parentFiber) {\n  var oldFiber = parentFiber.alternate;\n\n  if (!oldFiber.child) {\n    return;\n  }\n\n  var oldChild = oldFiber.child;\n  var prevChild = null;\n\n  while (oldChild) {\n    var newChild = {\n      type: oldChild.type,\n      tag: oldChild.tag,\n      stateNode: oldChild.stateNode,\n      props: oldChild.props,\n      partialState: oldChild.partialState,\n      alternate: oldChild,\n      parent: parentFiber\n    };\n\n    if (prevChild) {\n      prevChild.sibling = newChild;\n    } else {\n      parentFiber.child = newChild;\n    }\n\n    prevChild = newChild;\n    oldChild = oldChild.sibling;\n  }\n} // 将当前fiber及其子fiber放入fiber.parent的effects数组中，当前fiber的工作就完成了。\n// 然后就要进行下一个节点即fiber.sibling了。（查看performUnitOfWork()方法）\n\n\nfunction completeWork(fiber) {\n  if (fiber.tag == CLASS_COMPONENT) {\n    fiber.stateNode.__fiber = fiber;\n  }\n\n  if (fiber.parent) {\n    // 将变更放到父fiber的effects数组中\n    var childEffects = fiber.effects || [];\n    var thisEffect = fiber.effectTag != null ? [fiber] : [];\n    var parentEffects = fiber.parent.effects || [];\n    fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);\n  } else {\n    pendingCommit = fiber;\n  }\n} // 提交此次更新\n\n\nfunction commitAllWork(fiber) {\n  fiber.effects.forEach(function (f) {\n    commitWork(f);\n  });\n  fiber.stateNode.__rootContainerFiber = fiber;\n  nextUnitOfWork = null;\n  pendingCommit = null;\n} //  提交某个fiber\n\n\nfunction commitWork(fiber) {\n  if (fiber.tag == HOST_ROOT) {\n    return;\n  }\n\n  var domParentFiber = fiber.parent;\n\n  while (domParentFiber.tag == CLASS_COMPONENT) {\n    // 寻找最近的父dom\n    domParentFiber = domParentFiber.parent;\n  }\n\n  var domParent = domParentFiber.stateNode;\n\n  if (fiber.effectTag == PLACEMENT && fiber.tag == HOST_COMPONENT) {\n    domParent.appendChild(fiber.stateNode); // 增加一个元素\n  } else if (fiber.effectTag == UPDATE) {\n    Object(_dom_utils__WEBPACK_IMPORTED_MODULE_0__[\"updateDomProperties\"])(fiber.stateNode, fiber.alternate.props, fiber.props); // 更新\n  } else if (fiber.effectTag == DELETION) {\n    commitDeletion(fiber, domParent); // 删除\n  }\n} // 删除一个fiber节点\n\n\nfunction commitDeletion(fiber, domParent) {\n  var node = fiber;\n\n  while (true) {\n    if (node.tag == CLASS_COMPONENT) {\n      // 先去找到一个HOST_COMPONENT\n      node = node.child;\n      continue;\n    }\n\n    domParent.removeChild(node.stateNode);\n\n    while (node != fiber && !node.sibling) {\n      // 所有节点删除后node恢复原值\n      node = node.parent;\n    }\n\n    if (node == fiber) {\n      return;\n    }\n\n    node = node.sibling;\n  }\n}\n\n//# sourceURL=webpack:///./reconciler.js?");

/***/ })

/******/ });