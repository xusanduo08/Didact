#### DOM review

开始之前，我们先看下我们要用到的DOM API：

```javascript
// Get an element by id
const domRoot = document.getElementById("root");
// Create a new element given a tag name
const domInput = document.createElement("input");
// Set properties
domInput["type"] = "text";
domInput["value"] = "Hi world";
domInput["className"] = "my-class";
// Listen to events
domInput.addEventListener("change", e => alert(e.target.value));
// Create a text node
const domText = document.createTextNode("");
// Set text node content
domText["nodeValue"] = "Foo";
// Append an element
domRoot.appendChild(domInput);
// Append a text node (same as previous)
domRoot.appendChild(domText);
```

注意到这里我们给元素设置了properties而不是attributes，而且只有有效的properties才能被设置。

#### Didact Elements

我们用原生的JS对象来描述我们要渲染的东西，我们称这类对象为Didact Elements。这些元素对应的JS对象都有两个必要的属性：`type`和`props`。`type`可以是个字符串也可以是一个函数，但在我们介绍组件之前我们先只使用字符串。`props`是一个可以为空（`null`）的对象。`props`下还可以含有`children`属性，`children`属性值为一个装有Didact Elements的数组。

> 我们后面将会频繁的使用Didact Elements，所以我们会用元素称呼Didact Elements。不要和HTML的元素搞混了，HTML元素会被称作DOM元素或者使用命名变量时干脆就叫`dom`。

举个例子，我们会用下面这个对象：

```javascript
const element = {
  type: "div",
  props: {
    id: "container",
    children: [
      { type: "input", props: { value: "foo", type: "text" } },
      { type: "a", props: { href: "/bar" } },
      { type: "span", props: {} }
    ]
  }
};
```

来描述下面这个dom：

```javascript
<div id="container">
  <input value="foo" type="text">
  <a href="/bar"></a>
  <span></span>
</div>
```

Didact Elements和React Elements很像。但通常情况下你不会使用JS去创建一个React Elements，更多的是使用JSX或者是`createElement`方法来创建。在Didact中我们也会使用相同的方法创建元素，但会将这部分内容放在下一节。

#### Render DOM Elements

下一步是将元素及其子元素渲染成dom。我们使用`render`（类似于`ReactDOM.render`）方法来接收一个元素和一个dom容器。这个方法会将这个元素描述的dom子树结构创建出来，并添加到容器内。

```javascript
function render(element, parentDom){
    const { type, props } = element;
    const dom = document.createElement(type);
    const childElements = props.children || [];
    childElements.forEach(childElement => render(childElement, dom));
    parentDom.appendChild(dom);
}
```

我们现在仍没有处理属性和事件。我们先用`Object.keys`来获取`props`中的属性名字，然后循环将它们设定到元素上：

```javascript
function render(element, parentDom){
    const { type, props } = element;
    const dom = document.createElement(type);
    
    const isListener = name => name.startsWith("on");
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[name]);
    })
    
    const isAttribute = name => !isListener(name) && name != "children";
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] = props[name];
    })
    
    const childElements = props.children || [];
    childElements.forEach(childElement => render(childElement, dom));
    parentDom.appendChild(dom);
}
```

#### Render DOM Text Nodes

目前`render`还不支持文本节点。首先我们要定义文本节点是什么样的。在react中，一个`<span>Foo</span>`这样的元素需要这样描述：

```javascript
const reactElement = {
  type: "span",
  props: {
    children: ["Foo"]
  }
}
```

注意到这里的子元素已经不是对象，而只是一个字符串。这和我们对Didact Elements的定义有不一样：`children`应该是装有Didact Elements的数组，并且所有元素都有`type`和`props`属性。如果我们继续遵守这个规则接下来我们将较少使用`if`的次数。所以，Didact Elements将会使用`type="TEXT ELEMENT"`来表示文本节点，并使用`nodeValue`来装文本值。例如下面这样：

```javascript
const textElement = {
  type: "span",
  props: {
    children: [
      {
        type: "TEXT ELEMENT",
        props: { nodeValue: "Foo" }
      }
    ]
  }
};
```

现在我们已经定义好了能够渲染的文本节点。和其他节点不同的是，文本节点需要使用`createTextNode`来创建而不是`createElement`，而`nodeValue`会通过相同方法来设置。

```javascript

function render(element, parentDom) {
  const { type, props } = element;

  // Create DOM element
  const isTextElement = type === "TEXT ELEMENT";
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);

  // Add event listeners
  const isListener = name => name.startsWith("on");
  Object.keys(props).filter(isListener).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  });

  // Set properties
  const isAttribute = name => !isListener(name) && name != "children";
  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  });

  // Render children
  const childElements = props.children || [];
  childElements.forEach(childElement => render(childElement, dom));

  // Append to parent
  parentDom.appendChild(dom);
}
```

#### Summary

我们目前创建了一个可以渲染元素及其子元素为DOM的`render`方法。下一步我们需要一个块数简单的方法来创建元素。下一节我们将在Didact中使用JSX。

下一节：

https://engineering.hexacta.com/didact-element-creation-and-jsx-d05171c55c56