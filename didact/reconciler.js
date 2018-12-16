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

// 根节点的render方法
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

// 循环处理节点，而不是递归，这样方便暂停
function workLoop(deadline){
  if(!nextUnitOfWork){
    resetNextUnitOfWork(); // 每次都要从根fiber节点开始构建新的fiber树
  }

  while(nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME){
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if(pendingCommit){
    commitAllWork(pendingCommit);
  }
}

// 产生第一个nextUnitOfWork，也就是根fiber节点
function resetNextUnitOfWork(){
  const update = updateQueue.shift();
  if(!update){
    return;
  }

  if(update.partialState){
    update.instance.__fiber.partialState = update.partialState;
  }

  // 根fiber对应的dom有个__rootContainer属性，保存着根fiber节点。
  const root = update.from == HOST_ROOT ? update.dom.__rootContainerFiber
    : getRoot(update.instance.__fiber);
  // 返回一个新的根fiber
  nextUnitOfWork = {
    tag: HOST_ROOT,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root
  };
}

// 从某一fiber节点往上寻找根fiber节点
function getRoot(fiber){
  let node = fiber;
  while(node.parent){
    node = node.parent;
  }
  return node;
}

// 第一次传进来的就是一个根fiber节点
// 从根节点开始逐层的的去校验每层的子节点
// 当前节点子节点校验完毕后，会去处理当前节点的兄弟节点或者祖先元素的兄弟节点
function performUnitOfWork(wipFiber){
  beginWork(wipFiber); // beginWork()之后，wipFiber可能会含有child属性，这个方法里会去完成子节点的校验
  if(wipFiber.child){
    return wipFiber.child;
  }

  let uow = wipFiber;
  // 如果没有子节点，则返回自己的兄弟节点或者最近的含有兄弟节点的祖先节点的兄弟节点
  while(uow){
    completeWork(uow); // 将当前fiber的effects放入到父fiber的effects中，然后当前fiber的就算处理完了，就到它的sibling了
    if(uow.sibling){
      return uow.sibling
    }
    uow = uow.parent;
  }
}

// 分类处理fiber
function beginWork(wipFiber){
  if(wipFiber.tag == CLASS_COMPONENT){
    updateClassComponent(wipFiber);
  } else {
    updateHostComponent(wipFiber);
  }
}

// 处理原生DOM对应的fiber
function updateHostComponent(wipFiber){
  if(!wipFiber.stateNode){ // 先检查有无stateNode，没有的话创建
    wipFiber.stateNode = createDomElement(wipFiber);
  }

  const newChildElements = wipFiber.props.children;
  reconcileChildrenArray(wipFiber, newChildElements);
}

// 处理组件对应的fiber
function updateClassComponent(wipFiber){
  let instance = wipFiber.stateNode;
  if(instance == null){
    instance = wipFiber.stateNode = createInstance(wipFiber);
  } else if(wipFiber.props == instance.props && !wipFiber.partialState){
    // No need to render, clone children from last time
    cloneChildFibers(wipFiber);
    return;
  }

  instance.props = wipFiber.props; // 这地方似乎没必要做这样一个赋值操作
  instance.state = Object.assign({}, instance.state, wipFiber.partialState);
  wipFiber.partialState = null;

  const newChildElements = wipFiber.stateNode.render();
  reconcileChildrenArray(wipFiber, newChildElements);
}

function arrify(val){
  return val == null ? [] :  Array.isArray(val) ? val : [val];
}

// 对传入的子元素进行一致性校验
function reconcileChildrenArray(wipFiber, newChildElements){
  const elements = arrify(newChildElements);

  let index = 0;
  // 获取对应oldFiber的child
  let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;
  let newFiber = null;
  while(index < elements.length || oldFiber != null){
    const prevFiber = newFiber;
    const element = index < elements.length && elements[index];
    const sameType = oldFiber && element && element.type == oldFiber.type;

    if(sameType){ // 如果是同种类型，则新fiber的很多属性可以直接从对应的oldFiber上取
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: element.props,
        parent: wipFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: UPDATE
      };
    }

    if(element && !sameType){ // 不同类型
      newFiber = {
        type: element.type,
        tag: typeof element.type === 'string' ? HOST_COMPONENT : CLASS_COMPONENT,
        props: element.props,
        parent: wipFiber,
        effectTag: PLACEMENT
      }
    }

    // 如果是不同类型的，则oldFiber需要被删除，并且需要被放到新fiber的effects数组中。
    if(oldFiber && !sameType){
      oldFiber.effectTag = DELETION;
      wipFiber.effects = wipFiber.effects || [];
      wipFiber.effects.push(oldFiber);
    }

    if(oldFiber){
      oldFiber = oldFiber.sibling; // 继续兄弟元素
    }

    if(index == 0){
      wipFiber.child = newFiber; // 第一个子fiber挂在child属性上
    } else if(prevFiber && element){
      prevFiber.sibling = newFiber; // 同级子fiber之间通过sibling来关联
    }

    index++;
  }
}

// 克隆一个fiber节点
function cloneChildFibers(parentFiber){
  const oldFiber = parentFiber.alternate;
  if(!oldFiber.child){
    return;
  }

  let oldChild = oldFiber.child;
  let prevChild = null;
  while(oldChild){
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      partialState: oldChild.partialState,
      alternate: oldChild,
      parent: parentFiber
    };
    if(prevChild){
      prevChild.sibling = newChild;
    } else {
      parentFiber.child = newChild;
    }

    prevChild = newChild;
    oldChild = oldChild.sibling;
  }
}

// 将当前fiber及其子fiber放入fiber.parent的effects数组中，当前fiber的工作就完成了。
// 然后就要进行下一个节点即fiber.sibling了。（查看performUnitOfWork()方法）
function completeWork(fiber){
  if(fiber.tag == CLASS_COMPONENT){
    fiber.stateNode.__fiber = fiber;
  }

  if(fiber.parent){
    // 将变更放到父fiber的effects数组中
    const childEffects = fiber.effects || [];
    const thisEffect = fiber.effectTag != null ? [fiber] : [];
    const parentEffects = fiber.parent.effects || [];
    fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
  } else {
    pendingCommit = fiber;
  }
}

// 提交此次更新
function commitAllWork(fiber){
  fiber.effects.forEach(f => {
    commitWork(f);
  });

  fiber.stateNode.__rootContainerFiber = fiber;
  nextUnitOfWork = null;
  pendingCommit = null;
}

//  提交某个fiber
function commitWork(fiber){
  if(fiber.tag == HOST_ROOT){
    return;
  }

  let domParentFiber = fiber.parent;
  while(domParentFiber.tag == CLASS_COMPONENT){ // 寻找最近的父dom
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.stateNode;

  if(fiber.effectTag == PLACEMENT && fiber.tag == HOST_COMPONENT){
    domParent.appendChild(fiber.stateNode); // 增加一个元素
  } else if(fiber.effectTag == UPDATE){
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props); // 更新
  } else if(fiber.effectTag == DELETION){
    commitDeletion(fiber, domParent); // 删除
  }
}

// 删除一个fiber节点
function commitDeletion(fiber, domParent){
  let node = fiber;
 
  while(true){
    if(node.tag == CLASS_COMPONENT){ // 先去找到一个HOST_COMPONENT
      node = node.child;
      continue;
    }

    domParent.removeChild(node.stateNode);
    while(node != fiber && !node.sibling){ // 所有节点删除后node恢复原值
      node = node.parent;
    }

    if(node == fiber){
      return;
    }

    node = node.sibling;
  }
}