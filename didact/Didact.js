const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];

  props.children = rawChildren.filter(c => c != null && c !== false)
    .map(c => c instanceof Object ? c : createTextElement(c));

  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

let rootInstance = null;

function render(element, container) {
  const prevProps = rootInstance;
  const nextInstance = reconcile(container, prevProps, element);
  rootInstance = nextInstance;
}

// 实例化一个元素（就是将元素对应的DOM放到对应父DOM中，只有新增的元素需要实例化）
function instantiate(element) {
  const { type, props } = element;
  const isTextElement = type === 'TEXT_ELEMENT';
  const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
  updateDomProperties(dom, [], props);

  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate); // 递归实例化子元素
  const childDoms = childInstances.map(childInstance => childInstance.dom);
  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = { dom, element, childInstances };
  return instance;
}

// 更新DOM节点属性
function updateDomProperties(dom, prevProps, nextProps){
  const isEvent = name => name.startsWith("on");
  const isAttribute = name => !isEvent(name) && name != "children";

  Object.keys(prevProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  });

  Object.keys(prevProps).filter(isAttribute).forEach(name => {
    dom[name] = null;
  });

  Object.keys(nextProps).filter(isAttribute).forEach(name => {
    dom[name] = nextProps[name];
  });

  Object.keys(nextProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name]);
  });
}

// 一致性校验
function reconcile(parentDom, instance, element){
  if(instance == null){ // 有新增的元素
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance
  } else if(element == null){ // 需要删除一些节点
    parentDom.removeChild(instance.dom);
    return null;
  } else if(instance.element.type === element.type){ // 类型相同，更新节点
    updateDomProperties(instance.dom, instance.element.props, element.props); // 更新属性
    instance.childInstances = reconcileChildren(instance, element); // 对子元素进行一致性校验
    instance.element = element;
    return instance; 
  } else {
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}

function reconcileChildren(instance, element){
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];
  const count = Math.max(childInstances.length, nextChildElements.length);

  for(let i = 0; i < count; i++){
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter(instance => instance != null);
}

export default {
  render,
  createElement
}