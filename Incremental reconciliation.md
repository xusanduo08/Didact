翻译自这里：https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec

React16已经发布了，其内部重写了很多代码，内部解构也发生了一些变化，有一些新的特性也随之推出。我们在之前系列里写的代码多多少少有些过时了。在这一节，我们将会根据React16的最新结构来重写大部分的代码，代码结构和变量命名我们也会尽量按照React16的来。我们会将代码的公开API需要的其他的方法一并添加上去，这些公开API包括：

* `Didact.createElement`
* `Didact.render()`（用来DOM渲染）
* `Didact.Component`(带有`setState()`，但没有`context`及其他生命周期方法)

如果你想直接看代码及运行效果，可以看[这里](https://codepen.io/pomber/pen/veVOdd)，或者访问[代码库](https://github.com/pomber/didact)。



好了，先来解释下以前的代码为什么需要重写代码。

#### Why Fiber

> 我们不会解释的很详细，如果你想具体了解，可以看一下这个[list](https://github.com/koba04/react-fiber-resources)

当浏览器的主线程一直被某一任务占用时，其他任务就无法去执行，知道占用主线程的任务完成，其他任务才有可能被执行。

我做了一个[demo](https://pomber.github.io/incremental-rendering-demo/react-sync.html)来展示上面提到的问题。为了保持星球的持续转动，主线程至少每隔16ms就需要空闲出来以渲染页面。假如主线程一直被其他任务占用，比如占用了200ms，你就会发现动画有一些丢帧（通俗的说就是卡顿），在主线程被占用时星球会停着不动。

那么是什么一直占用着主线程，使得主线程无法去执行渲染任务以至于页面有卡顿呢？

还记得我们写的[一致性校验的代码](https://engineering.hexacta.com/didact-instances-reconciliation-and-virtual-dom-9316d650f1d0)么？一旦开始一致性校验，过程就不会开始。此时，如果其他任务需要执行，那么只有排队等待。而且，因为一致性校验是一个递归的规程，所以很难暂停。所以接下来我们将会使用一种新的数据结构来重写一致性校验的代码，并用循环来代替递归。

#### Scheduling micro-tasks

我们需要把任务分割成更细小的任务片，以单位任务片的方式来执行这些任务片，在执行的间隙，主线程可以去执行有更高优先级的其他任务，结束之后再回来继续剩余的任务片。

我们将定义一个`requestIdleCallback()`方法来完成上述功能。这个方法会维护一个回调，这个回调是下次浏览器空闲是需要去执行的任务，在执行这个回调时还会传入一个`deadline`参数，用来描述当前有多少时间可以用来执行这个任务。

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

