---
title: React原理-Reconciler&Fiber
---
## 你是如何理解 fiber 的?

React Fiber 是一种基于浏览器的**单线程调度算法**.

React 16 之前 ，`reconcilation`  算法实际上是递归，想要中断递归是很困难的，React 16 开始使用了循环来代替之前的递归.

`Fiber`：**一种将 `recocilation` （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。**

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

::: warning 问
react的fiber为什么要用链表?
:::

::: tip 答

:::