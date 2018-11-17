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

我们用原生的JS对象来描述我们要渲染的东西，我们称这个对象为Didact Elements。这些元素对应的JS对象都有两个必要的属性：`type`和`props`。