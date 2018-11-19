const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(type, config, ...args){
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];

  props.children = rawChildren.filter(c => c != null && c !== false)
    .map(c => c instanceof Object ? c : createTextElement(c));
  
  return { type, props};
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value});
}

function render(element, parentDom){
  const { type, props } = element;

  const isTextElement = type === 'TEXT ELEMENT';
  const dom = isTextElement ? document.createTextNode('') : document.createElement(type);

 

  const isListener = name => name.startsWith('on');
  Object.keys(props).filter(isListener).forEach(name => {
    const eventType = name.toLocaleLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  })

  const isAttribute = name => !isListener(name) && name != 'children';
  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  })

  const childElements = props.children || [];
  childElements.forEach(childElement => render(childElement, dom));
  console.log(element, parentDom)
  parentDom.appendChild(dom);
}

export default {
  render,
  createElement
}