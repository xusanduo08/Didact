翻译自这里：https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec

React16已经发布了，其内部重写了很多代码，内部解构也发生了一些变化，有一些新的特性也随之推出。我们在之前系列里写的代码多多少少有些过时了。在这一节，我们将会根据React16的最新结构来重写大部分的代码，代码结构和变量命名我们也会尽量按照React16的来。对于我们暴露出来的API用不到的东西我们会一并跳过，这些公开API包括：

* `Didact.createElement`
* `Didact.render()`（用来DOM渲染）
* `Didact.Component`(带有`setState()`，但没有`context`及其他生命周期方法)

如果你想直接看代码及运行效果，可以看[这里](https://codepen.io/pomber/pen/veVOdd)，或者访问[代码库](https://github.com/pomber/didact)。



好了，先来解释下以前的代码为什么需要重写代码。

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

每个组件我们都会为其创建一个fiber。`nextUnitOfWork`指向的是下一次我们要运行的fiber。`performUnitOfWork`会执行当前的fiber在执行结束后返回一个新的fiber。跟紧我，接下来我将详细解释一下。

先来看下一个fiber的结构：

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

`parent`，`child`以及`sibling`将被用来构建一颗描述组件树的fiber树。`stateNode`则是指向一个DOM元素或者是用户定义的组件的实例。

![变量说明](F:\Didact\img\201812031109.png)

上面的图片展示了我们需要支持的三种类型的组件：

* `b`，`p`及`i`这一类的fiber我们称为__host components__，用`tag:HOST_COMPONENT`来表示。这一类fiber的`type`属性值为一个字符串（即对应的html元素标签名）。`props`则放置着对应元素的属性和事件。
* `Foo`对应的fiber我们称为__class components__，对应的`tag`标签值为`CLASS_COMPONENT`。这一类fiber的`type`属性值为指向用户定义的组件类的引用。
* `div`对应的fiber我们称为__host root__。host root和host component都含有一个DOM元素作为`stateNode`的属性值，但host root作为fiber树的根，它将会受到一些特别的对待。我们使用`tag:HOST_ROOT`来区分host root。注意到，此类fiber的`stateNode`对应的DOM节点将会被传入到`Didact.render()`中。

另一个比较重要的属性是`alternate`。大多数情况下我们代码中存在两棵fiber树：一颗对应着已经渲染到页面的DOM，我们称之为current tree或者old tree；另一颗为我们更新（调用`setState()`或者`Didact.render()`）过程中构建出来的树，我们称之为work-in-progress-tree。

work-in-progress tree不会和old tree共享任何fiber信息。一旦work-in-progress tree执行完毕，对应的DOM都被渲染完毕后就被变成old tree。

`alternate`用来连接work-in-progress fibers和其对应的old tree上的fibers。一个fiber与它的`alternate`指向的old tree上的fiber拥有相同的`tag`，`type`和`stateNode`。当我们在渲染一个新的结构时，对应的fiber不会含有`alternate`属性。

接下来是`effects`数组和`effectTag`。当work-in-progress tree上的某一个fiber需要对DOM做一些变更时，我们会给这个fiber设置`effecttTag`属性，取值有三种：`PLACEMENT`，`UPDATE`，或者`DELETION`。为了更方便的实施DOM的变更，我们将来自fiber子结构的含有`effectTag`的fiber都保存在`effects`数组中。

上面说了比较多的概念，一时理解有些困难，如果跟不上也不要担心，下面我们在实际代码中来了解一下fiber。

####Didact call hierarchy

