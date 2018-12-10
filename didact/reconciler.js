import { createDomElement, updateDomProperties } from './dom-utils';
import { createInstance } from './component';


// Fiber tags
const HOST_COMPONENT = 'host';
const CLASS_COMPONENT = 'class';
const HOST_ROOT = 'root';

// Effect tags
const PLACEMENT = 1;
const DELETION = 2;
const UPDATE = 3;

const ENOUGH_TIME = 1;

// Global state
const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

export function render(elements, containerDom) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: containerDom,
    newProps: { children: elements }
  });

  requestIdleCallback(performWork)
}

// 组件的setState()中会调用该方法。
export function scheduleUpdate(instance, partialState){
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance: instance,
    partialState: partialState
  });
  requestIdleCallback(performWork);
}

function performWork(deadline){
  workLoop(deadline);
  if(nextUnitOfWork || updateQueue.length > 0){
    requestIdleCallback(performWork);
  }
}

