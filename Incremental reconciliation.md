翻译自这里：https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec

React16已经发布了，其内部重写了很多代码，内部结构也发生了一些变化，有一些新的特性也随之推出。我们在之前系列里写的代码多多少少有些过时了。在这一节，我们将会根据React16的最新结构来重写大部分的代码，代码结构和变量命名我们也会尽量按照React16的来。对于我们暴露出来的API用不到的东西我们会一并跳过，这些公开API包括：

* `Didact.createElement`
* `Didact.render()`（用来DOM渲染）
* `Didact.Component`(带有`setState()`，但没有`context`及其他生命周期方法)

如果你想直接看代码及运行效果，可以看[这里](https://codepen.io/pomber/pen/veVOdd)，或者访问[代码库](https://github.com/pomber/didact)。



好了，先来解释下以前的代码为什么需要重。

#### Why Fiber

> 我们不会解释的很详细，如果你想具体了解，可以看一下这个[list](https://github.com/koba04/react-fiber-resources)

当浏览器的主线程一直被某一任务占用时，其他任务就无法去执行，直到占用主线程的任务完成，其他任务才有可能被执行。

我做了一个[demo](https://pomber.github.io/incremental-rendering-demo/react-sync.html)来展示上面提到的问题。为了保持星球的持续转动，主线程至少每隔16ms就需要空闲出来以渲染页面。假如主线程一直被其他任务占用，比如占用了200ms，你就会发现动画有一些丢帧（通俗的说就是卡顿），在主线程被占用时星球会停着不动。

那么是什么一直占用着主线程，使得主线程无法去执行渲染任务以至于页面有卡顿呢？

还记得我们写的[一致性校验的代码](https://engineering.hexacta.com/didact-instances-reconciliation-and-virtual-dom-9316d650f1d0)么？一旦开始一致性校验，过程就不会停止。此时，如果其他任务需要执行，那么只有排队等待。而且，因为一致性校验是一个递归的规程，所以很难暂停。接下来我们将会使用一种新的数据结构来重写一致性校验的代码，并用循环来代替递归。

#### Scheduling micro-tasks

我们需要把任务分割成更细小的任务片，以单位任务片的方式来执行这些任务片，在执行的间隙，主线程可以去执行有更高优先级的其他任务，结束之后再回来继续执行剩余的任务片。

我们将定义一个`requestIdleCallback()`方法来完成上述功能。这个方法会维护一个回调，这个回调是下次浏览器空闲时需要去执行的任务。在执行这个回调时还会传入一个`deadline`参数，用来描述当前有多少时间可以用来执行这个任务。

```javascript
const ENOUGH_TIME = 1; // 毫秒

let workQueue = [];
let nextUnitOfWork = null;

function schedule(task){
    workQueue.push(task);
    requestIdleCallback(performWork);
}

function performWork(deadline){
    if(!nextUnitOfWork){
       nextUnitOfWork = workQueue.shift();
    }
    
    while(nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME ){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    
    if(nextUnitOfWork || workQueue.length > 0){
        requestIdleCallback(performWork);
    }
}
```

真正执行任务的是`performUnitOfWork`这个方法，我们的一致性校验算法也需要写到这个方法里面。这个方法会执行任务片并返回继续执行下次任务所需要的所有信息。

我们使用fiber来跟踪任务片的执行。

####The fiber data structure

每个组件我们都会为其创建一个fiber。`nextUnitOfWork`指向的是下一次我们要运行的fiber。`performUnitOfWork`会执行当前的fiber并在执行结束后返回一个新的fiber。跟紧我，接下来我将详细解释一下。

先来看下fiber的结构：

```javascript
let fiber = {
    tag: HOST_COMPONENT,
   	type: 'div',
    parent: parentFiber,
    child: childFiber,
    sibling: null,
    alternate: currentFiber,
    stateNode: document.createElement('div'),
    props: {children: [], className: 'foo'},
    partialState: null,
    effectTag: PLACEMENT,
   	effects: []
}
```

看起来只是一个很普通的JS对象。

`parent`，`child`以及`sibling`将被用来构建一颗描述组件的fiber树。`stateNode`则是指向一个DOM元素或者是用户定义的组件的实例。

![变量说明](.\img\201812031109.png)

上面的图片展示了我们需要支持的三种类型的组件：

* `b`，`p`及`i`这一类的fiber我们称为__host components__，用`tag:HOST_COMPONENT`来表示。这一类fiber的`type`属性值为一个字符串（即对应的html元素标签名）。`props`则放置着对应元素的属性和事件。
* `Foo`对应的fiber我们称为__class components__，对应的`tag`标签值为`CLASS_COMPONENT`。这一类fiber的`type`属性值为指向用户定义的组件类的引用。
* `div`对应的fiber我们称为__host root__。host root和host component都含有一个DOM元素作为`stateNode`的属性值，但host root作为fiber树的根，它将会受到一些特别的对待。我们使用`tag:HOST_ROOT`来区分host root。注意到，此类fiber的`stateNode`对应的DOM节点将会被传入到`Didact.render()`中。

另一个比较重要的属性是`alternate`。大多数情况下我们代码中存在两棵fiber树：一颗对应着已经渲染到页面的DOM，我们称之为current tree或者old tree；另一颗为我们更新（调用`setState()`或者`Didact.render()`）过程中构建出来的树，我们称之为work-in-progress tree。（这两棵树的节点都是一个个fiber）

work-in-progress tree不会和old tree共享fiber。一旦work-in-progress tree执行结束，对应的DOM都被渲染完毕后，work-in-progress tree就会变成old tree。

`alternate`用来连接work-in-progress tree上的fiber对应的old tree上的fiber。一个fiber与它的`alternate`指向的old tree上的fiber拥有相同的`tag`，`type`和`stateNode`。当我们在渲染一个新的结构时，对应的fiber不会含有`alternate`属性。

接下来是`effects`数组和`effectTag`。当work-in-progress tree上的某一个fiber需要对DOM做一些变更时，我们会给这个fiber设置`effecttTag`属性，取值有三种：`PLACEMENT`，`UPDATE`，或者`DELETION`。为了更方便的实施DOM的变更，我们将来自当前fiber下含有`effectTag`的子fiber都保存在`effects`数组中。

上面说了比较多的概念，一时理解有些困难，如果跟不上也不要担心，下面我们在实际代码中来了解一下fiber。

####Didact call hierarchy

我们来通过流程图来感知一下即将要写的代码的层次结构：

![fiber流程](./img/201812038046.png)

我们会从`render()`或者`setState()`开始，到`commitAllWork()`结束。

#### Old code

在开始重写之前先来回顾下以前写的代码。

在[Element creation and JSX](https://engineering.hexacta.com/didact-element-creation-and-jsx-d05171c55c56)中我们编写了[`crerateElement()`](https://gist.github.com/pomber/2bf987785b1dea8c48baff04e453b07f)方法用来转译JSX。这个方法不需要改动，元素的结构也没有发生变化。如果你不知道我们所说的元素，`type`，`props`和`children`是什么，那么你需要回顾一下之前的内容。

在[Instances, reconciliation and virtual DOM](https://engineering.hexacta.com/didact-instances-reconciliation-and-virtual-dom-9316d650f1d0)这一节我们写了`updateDomProperties()`方法用来更新DOM节点的属性。我们还写了`createDomElement()`方法用来创建DOM节点。这两个方法你都可以在[dom-utils.js](https://gist.github.com/pomber/c63bd22dbfa6c4af86ba2cae0a863064)中看到。

在[Components and state](https://engineering.hexacta.com/didact-components-and-state-53ab4c900e37)这一节我们编写了`Component`基础类。这个类需要一些改动。`setState()`方法中需要去调用`scheduleUpdate()`方法。此外还要创建一个`createInstance`方法来代替之前的`createPublicInstance()`方法。`createInstance`创建的实例保存了自身对应的fiber的引用。

```javascript
class Component{
    constructor(props){
        this.props = props || {};
        this.state = this.state || {};
    }
    
    setState(partialState){
        scheduleUpdate(this, partialState);
    }
}

function createInstance(fiber){
    const instance = new fiber.type(fiber.props);
    instance.__fiber = fiber;
    return instance;
}
```

我们就从上面这段代码开始，重写剩下的功能。

![render()&scheduleUpdate()](./img/201812032124.png)

除了`Component`类和`createElement()`方法外，我们还有两个暴露出来的方法：`render()`和`setState()`，并且我们知道我们将在`setState()`中调用`scheduleUpdate()`。

`render()`方法和`scheduleUpdate()`方法有些类似，它们都会接收一个更新任务，然后放到队列中。

```javascript
// Fiber tags
const HOST_COMPONENT = 'host';
const CLASS_COMPONENT = 'class';
const HOST_ROOT = 'root';

// Global state
const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

function render(elements, containerDom){
    updateQueue.push({
        from: HOST_ROOT,
        dom: containerDom,
        newProps: {children: elements}
    });
    requestIdleCallback(performWork);
}

function scheduleUpdate(instance, partialState){
    updateQueue.push({
        from: CLASS_COMPONENT,
        instance: instance,
        partialState: partialState
    });
    requestIdleCallback(performWork); // 延迟调用performWork
}
```

`updateQueue`数组用来盛装要实施的更新，每次调用`render()`或者`scheduleUpdate()`方法都会往`updateQueue`中增加一个更新操作。每个更新操作携带的信息都不尽相同，我们将会在接下来的`resetNextUnitOfWork()`方法看到如何去实施这些更新。

在把更新放到队列中之后，我们对`performWork()`做了一个延迟调用。

![performWork()&workLoop()](./img/201812040958.png)

```javascript
const ENOUGH_TIME = 1;

function performWork(deadline){
    workLoop(deadline);
    if(nextUnitOfWork || updateQueue.length > ){
        requestIdleCallback(performWork);
    }
}

function workLoop(deadline){
    if(!nextUnitOfWork){
        resetNextUnitOfWork();
    }
    while(nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if(pendingCommit){
        commitAllWork(pendingCommit);
    }
}
```

`requestIdleCallback()`方法会将一个deadline传入目标方法（就是`performWork`）中，并执行这个方法。`performWork()`会将接收到的deadline传递给`workLoop()`方法，`workLoop()`执行结束后，`performWork()`中剩下的代码还会检查是否还有等待完成的任务，如果有，则会在浏览器空闲的时候再次调用自己。

`workLoop()`会监视着deadline参数，如果deadline太短，方法内部会自动停止循环，并保持nextUnitOfWork不做改变，下次会继续执行这个任务。

>  ENOUGH_TIME是一个代表1ms的常量，通过`deadline.timeRemaining()`与ENOUGH_TIME的比较来判断是否有足够的时间来执行当前这个任务。如果`performUnitOfWork()`所需要的时间超过ENOUGH_TIME，我们会适当增加deadline的值。deadline只是浏览器所建议的一个时间，所以增加几毫秒时没有什么问题的。

`performUnitOfWork()`会为当前的更新操作构建一颗work-in-progress tree，并会比较出需要对DOM实施的变更。这些操作都是逐步进行的，每次构建一个fiber节点。

当`performUnitOfWork()`结束了当前更新所需要做的任务之后，会返回null（这样循环就结束了）并将要实施的更新操作保存在`pendingCommit`变量中。最后，`commitAllWork()`会从`pendingCommit`中取出`effects`，并对对应的DOM实施变更操作。

注意到`commitAllWork()`是在循环外面调用的。`performUnitOfWork()`的任务完成后并没有对DOM进行变更，所以它是可以分开执行的。而`commitAllWork()`是会对DOM进行改变的，所以为了保证和UI显示一致，需要一次性将`commitAllWork()`执行完毕。

说了这么多，我们依然不知道第一个`nextUnitOfWork`来自于哪里。

![resetUnitOfWork()](./img/201812042140.png)

`resetUnitOfWork()`方法会接收一个更新操作并将其转化为`nextUnitOfWork`。

```javascript
function resetNextUnitOfWork(){
    const update = updateQueue.shift();
    if(!update){
        return;
    }
    // 将更新操作中携带的state复制给对应fiber
    if(update.partialState){
        update.instance.__fiber.partialState = update.partialState;
    }
    
    const root = update.from == HOST_ROOT
    	? update.dom.__rootContainerFiber
    	: getRoot(update.instance.__fiber);
    
    nextUnitOfWork = {
        tag: HOST_ROOT,
        stateNode: update.dom || root.stateNode,
        props: update.newProps || root.props;
        alternate: root
    };
}

function getRoot(fiber){
    let node = fiber;
    while(node.parent){
        node = node.parent;
    }
    return node;
}
```

首先，`resetNextUnitOfWork()`会从`updateQueue`头部取出一个更新操作，如果这个更新操作携带有`partialState`信息，那么将该信息复制到此次更新对应实例的fiber上，在稍后调用组件的`render()`方法时会用到这个`partialState`。

接下来是寻找old fiber tree的根节点。如果此次更新是整个应用第一次调用`render()`（第一次渲染，严格的说不是更新了，应该叫挂载）引起的，则不存在根fiber节点，所以`root = null`；如果此次更新是由非第一次调用`render()`方法引起的，我们则可以通过DOM节点的`__rootContainerFiber`属性找到根fiber节点；如果此次更新是由`setState()`引起的，则需要从当前fiber往上查找，直到找到没有`parent`属性那个fiber节点，即为根fiber节点。

找完根fiber节点后，我们给`nextUnitOfWork`赋值一个新的fiber。__这个fiber是一棵新work-in-progress tree的根fiber节点__（因为是本次渲染的第一个`nextUnitOfWork`，所以是根fiber节点）。

如果不存在old root（说明这是初次渲染），则`stateNode`就是传入`render()`方法的那个DOM节点，`props`是来自于此次渲染的`newProps`，`newProps`的`children`数组含有的其他元素也会被传入到`render()`方法中。`alternate`属性将会是`null`。

如果存在old root（说明是更新操作，增量渲染），则`stateNode`就是上一次渲染的根DOM节点，`props`同样会从`newProps`取值，如果`newProps`为`null`的话，则从old root上取值。`alternate`指向的就是old root。

现在已经有了work-in-progress tree个根fiber节点，接下来我们从这个根节点开始构建work-in-progress fiber tree。

![performUnitOfWork](./img/201812051509.png)

```javascript
function performUnitOfWork(wipFiber){
    beginWork(wipFiber);
    if(wipFiber.child){
        return wipFiber.child;
    }
    
    // 如果没有子元素，则寻找兄弟元素
    let uow = wipFiber;
    while(uow){
        completeWork(uow);
        if(uow.sibling){
            return uow.sibling； // 返回找到的兄弟元素，构建一个节点。
        }
        uow = uow.parent;
    }
}
```

`performUnitOfWork()`方法会贯穿于整棵fiber树的构建过程。

`beginWork()`用来根据入参创建当前已有fiber的一个子fiber节点，然后将该节点返回作为下一个`nextUnitOfWork`参数。

如果当前已有fiber不存在子节点，则执行`completeWork()`方法，然后返回其兄弟节点作为下一个`nextUnitOfWork`参数。

如果当前fiber连兄弟节点也不存在，则向上查找，并逐层调用`completeWork`方法，直到找到并返回兄弟节点或者到达根节点。

`performUnitOfWork()`会被多次调用以来创建fiber树。

我们会以深度优先的原则去创一棵fiber树。从根节点开始，遍历每个节点的第一个子fiber（child属性），当到达某一个fiber节点时，我们会将该节点作为入参去调用`performUnitOfWork()`；如果某一fiber节点不含有子节点，则往右移动找寻兄弟节点，如果不存在兄弟节点则往上寻找祖先元素的兄弟节点，再将兄弟节点带入到`performUnitOfWork()`中执行。然后以当前节点为起点，继续按照深度优先的原则去遍历和创建fiber节点，整个过程会调用`performUnitOfWork`多次，直到整棵树创建完毕。（可以在这里[fiber-debugger](https://fiber-debugger.surge.sh/)查看更生动的描述）

![beginWork&updateHostComponent&updateClassComponent](./img/201812052125.png)

```
function beginWork(wipFiber){
    if(wipFiber.tag == CLASS_COMPONENT){
        updateClassComponent(wipFiber)
    }
}
```

