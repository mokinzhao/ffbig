---
title: React原理-Reconciler&Fiber
---
## 你是如何理解 fiber 的?

React Fiber 是一种基于浏览器的**单线程调度算法**.

React 16 之前 ，`reconcilation`  算法实际上是递归，想要中断递归是很困难的，React 16 开始使用了循环来代替之前的递归.

`Fiber`：**一种将 `recocilation` （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。**

- React Fiber 又称为纤程可以理解为：

    React内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。

- Fiber包含三层含义：

    - 作为架构来说，之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。

    - 作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。

    - 作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

## 你对 Time Slice 的理解?

**时间分片**

- React 在渲染（render）的时候，不会阻塞现在的线程
- 如果你的设备足够快，你会感觉渲染是同步的
- 如果你设备非常慢，你会感觉还算是灵敏的
- 虽然是异步渲染，但是你将会看到完整的渲染，而不是一个组件一行行的渲染出来
- 同样书写组件的方式

也就是说，这是 React 背后在做的事情，对于我们开发者来说，是透明的，具体是什么样的效果呢？

![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603412900-e2811022-5c2d-44d1-9893-a4647c394bb3.jpeg#align=left&display=inline&height=472&originHeight=472&originWidth=565&size=0&status=done&width=565)![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603412850-0ca87f6b-f5af-432e-b9de-e082b1b089de.jpeg#align=left&display=inline&height=472&originHeight=472&originWidth=565&size=0&status=done&width=565)有图表三个图表，有一个输入框，以及上面的三种模式<br />**这个组件非常的巨大，而且在输入框**每次**输入东西的时候，就会进去一直在渲染。**为了更好的看到渲染的性能，Dan 为我们做了一个表。

我们先看看，同步模式：<br />![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603413125-b8d05f9e-e9c6-4c64-ab7d-c509678fd461.jpeg#align=left&display=inline&height=405&originHeight=405&originWidth=566&size=0&status=done&width=566)![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603412868-029ea058-8277-4990-87a5-8576697084ee.jpeg#align=left&display=inline&height=405&originHeight=405&originWidth=566&size=0&status=done&width=566)<br />同步模式下，我们都知道，我们没输入一个字符，React 就开始渲染，当 React 渲染一颗巨大的树的时候，是非常卡的，所以才会有 shouldUpdate 的出现，在这里 Dan 也展示了，这种卡！

我们再来看看第二种（Debounced 模式）：<br />![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603413109-a25c5666-3671-452a-b3b5-30af1c531d61.jpeg#align=left&display=inline&height=402&originHeight=402&originWidth=532&size=0&status=done&width=532)![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603412827-c64b8982-803b-4a17-8d3c-7d43f7efeafa.jpeg#align=left&display=inline&height=402&originHeight=402&originWidth=532&size=0&status=done&width=532)<br />Debounced 模式简单的来说，就是延迟渲染，比如，当你输入完成以后，再开始渲染所有的变化。<br />这么做的坏处就是，至少不会阻塞用户的输入了，但是依然有非常严重的卡顿。

切换到异步模式：<br />![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603413159-53ff5ff7-4931-4454-8b73-06127d6db6bc.jpeg#align=left&display=inline&height=426&originHeight=426&originWidth=578&size=0&status=done&width=578)![](https://cdn.nlark.com/yuque/0/2019/jpeg/128853/1564603412901-c9f08337-d931-495c-91f3-e5a613126c47.jpeg#align=left&display=inline&height=426&originHeight=426&originWidth=578&size=0&status=done&width=578)<br />异步渲染模式就是不阻塞当前线程，继续跑。在视频里可以看到所有的输入，表上都会是原谅色的。

时间分片正是基于可随时打断、重启的 Fiber 架构,可打断当前任务,优先处理紧急且重要的任务,保证页面的流畅运行.

### 源码顺序

- 实现虚拟Dom

- 开始workOnRoot

1. beginWork构建

2. completeWork完成

- 遍历fiber

1. 开始遍历fiber节点之后
2. 如果有儿子，开始处理儿子
3. 如果没有儿子，自己结束了，开始处理弟弟
4. 如果没有弟弟，父亲就结束了，说明自己是最小到儿子了，开始处理叔叔
5. 如果没有叔叔，找它爷爷

## 问答环节


### react的fiber为什么要用链表?

![](https://s0.lgstatic.com/i/image/M00/67/59/Ciqc1F-hJTGANs5yAAD4e6ACv8Q643.png)

根据图中高亮部分的提示不难看出，首次渲染和更新渲染的区别，在于调用的是 mountState，还是 updateState。mountState 做了什么，你已经非常清楚了；而 updateState 之后的操作链路，虽然涉及的代码有很多，但其实做的事情很容易理解：按顺序去遍历之前构建好的链表，取出对应的数据信息进行渲染。

我们把 mountState 和 updateState 做的事情放在一起来看：mountState（首次渲染）构建链表并渲染；updateState 依次遍历链表并渲染。

看到这里，你是不是已经大概知道怎么回事儿了？没错，hooks 的渲染是通过“依次遍历”来定位每个 hooks 内容的。如果前后两次读到的链表在顺序上出现差异，那么渲染的结果自然是不可控的。

这个现象有点像我们构建了一个长度确定的数组，数组中的每个坑位都对应着一块确切的信息，后续每次从数组里取值的时候，只能够通过索引（也就是位置）来定位数据。也正因为如此，在许多文章里，都会直截了当地下这样的定义：Hooks 的本质就是数组。但读完这一课时的内容你就会知道，Hooks 的本质其实是链表


## 推荐阅读

[面试官问：React 为什么要使用 Fiber 架构 ？](https://mp.weixin.qq.com/s/4F_1G3zfmO8mxUgVw1HlyQ)
