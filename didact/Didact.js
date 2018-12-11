/**
 * render => reconcile => instantiate => 初始化实例，creratePublicInstance
 * publicInstance:{updateInstance:(f), __internalInstance:(Object)}
 * updateInstance=>reconcile(internalInstance.dom.parentDom, internalInstance, internalInstance.element) =>重新执行公共实例render方法，获取新的子元素
 * 
*/

import { createElement } from './element';
import { Component } from './component';
import { render } from './reconciler';

export default {
  render,
  createElement,
  Component
}

export { createElement, Component, render };