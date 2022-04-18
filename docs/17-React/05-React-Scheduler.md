---
title: React原理-Scheduler&TimeSlice
---

## 调度器（Scheduler）




## 时间切片（TimeSlice）

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



## requestIdleCallback



## 问答环节

::: warning 问
requestIdleCallback 和 requestAnimationFrame 的区别？
:::

::: tip 答
requestAnimationFrame 的回调会在每一帧确认执行, 属于高优先级任务. 而 requestIdleCallback 的回调不一定, 属于低优先级任务.
我们看到的页面是浏览器一帧一帧绘制出来的, 通常 FPS 在 60 的时候是比较流畅的, 而 FPS 比较低的时候就会感觉到卡顿.
:::

## 推荐阅读

[深入理解 scheduler 原理](https://juejin.cn/post/7087933643821154312)

[实现 React requestIdleCallback 调度能力](https://juejin.cn/post/7021506472232583199)