---
title: React原理-Reconciler&Fiber
---

## Reconciler

### Stack Reconciler（React15）

- Stack Reconciler 是一个同步的递归过程

1. 栈调和机制下的diff算法，其实是树的深度优先遍历的过程

2. 递归的过程是同步的，不可以被打断，意味着javaScript线程长时间占用主线程

3. 导致渲染卡顿/卡死、交互长时间无响应

## Fiber Reconciler（React16）

Fiber Reconciler 是一种基于浏览器的**单线程调度算法**.


## Fiber

### 你是如何理解 fiber 的?

React 16 之前 ，`reconcilation`  算法实际上是递归，想要中断递归是很困难的，React 16 开始使用了循环来代替之前的递归.

`Fiber`：**一种将 `recocilation` （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。**

- React Fiber 又称为纤程可以理解为：

    React内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。

- Fiber包含三层含义：

    - 作为架构来说，之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。

    - 作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。

    - 作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。




## 执行顺序

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
