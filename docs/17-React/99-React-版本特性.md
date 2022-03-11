---
title: React扩展-版本特性
---

- React 版本演进图

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/version.jpg)

## React 15

## React 16+



## React 17

### 无新特性

React v17 的发布非比寻常，因为它没有增加任何面向开发者的新特性。但是，这个版本会使得 React 自身的升级变得更加容易。

值得特别说明地是，React v17 作为后续版本的 ”基石“，它让不同版本的 React 相互嵌套变得更加容易。

除此之外，还会使 React 更容易嵌入到由其他技术构建的应用中。

### 渐进式升级

React v17 开启了 React 渐进式升级的新篇章。当你从 React 15 升级至 16 时（或者，从 16 升级到 17），你通常会一次性升级整个应用程序，这对大部分应用来说十分有效。但是，如果代码库编写于几年前，并且没有及时的维护升级，这会使得升级成本越来越高。并且，在 React 17 之前，如果在同一个页面上使用不同的 React 版本（可以这么做，但是有风险），会导致事件问题的出现，会有一些未知的风险。

我们正在修复 React v17 中的许多问题。这意味着，当 React 18 或未来版本来临时，你将有更多选择。首选，当然还是一次性升级整个应用；但你还有个可选方案，渐进式升级你的应用。举个例子，你可能将大部分功能升级至 React v18，但保留部分懒加载的对话框或子路由在 React v17。

但这并不意味着你必须进行渐进式升级。对于大多数应用来说，一次性升级仍是更好的选择。加载两个版本的 React，仍然不是理想方案 —— 即使其中一个版本是按需加载的。但对于那些长期未维护的大型应用来说，这意义非凡，React v17 开始让这些应用不会被轻易淘汰。

我们准备了示例仓库，此示例演示了如何在必要时懒加载旧版本的 React。此示例由 Create React App 构建，使用其他工具也可以实现同样的效果。欢迎使用其他工具的小伙伴通过 PR 的形式提供 Demo。

### 事件委托的变更

React v17 中，React 不会再将事件处理添加到 document 上，而是将事件处理添加到渲染 React 树的根 DOM 容器中：

```js
const rootNode = document.getElementById('root');
ReactDOM.render(<App />, rootNode);
```

在 React 16 及之前版本中，React 会对大多数事件进行 document.addEventListener() 操作。React v17 开始会通过调用 rootNode.addEventListener() 来代替。

![react17-click](https://zh-hans.reactjs.org/static/bb4b10114882a50090b8ff61b3c4d0fd/31868/react_17_delegation.png)


### 全新的 JSX 转换(无需import React)

React v17 支持了全新的 JSX 转换。我们还针对 React 16.14.0，React 15.7.0 和 0.14.0 版本做了兼容。请注意，此功能完全可选，并非必须使用。之前的 JSX 转换将会继续维护，并且没有停止支持它的计划。

React 17 引入了新的 JSX 编译方式，无须在组件中显式地 import React。注意需要配合 TypeScript 4.1+ 版本使用。


## React 18

React 18 在 2021 年下半年完成了 Alpha、Beta 和 Release Candidate 版本的发布，将于 2022 年初发布正式版本。

当 React 18 发布时，它将包含开箱即用的改进（如 Automatic batching)，全新的 API（如 startTransition）以及内置支持了 React.lazy 的全新 SSR 架构。

这些功能之所以能够实现，要归功于在 React 18 中新加入的可选的 “并发渲染（concurrent rendering）” 机制，它为 React 解锁了非常多新的可能性，来帮助你提高你应用程序的实际与感知性能。

React 18 采用循序渐进的策略，由于 React 18 中的并发性是可选功能，所以并不会立刻对组件行为带来任何明显的破坏性变化。你几乎不需要对应用程序中的代码进行任何改动就可以直接升级到 React 18，且可以根据自己的节奏和需要来尝试新特性。

总的来说，React 18 带来了以下 3 个方面的更新：

### Automatic batching

React 17 的批量更新只在事件回调中才会生效。这次 React 18 后对 Promise、setTimeout 等同样会做自动批量更新。

React 18 通过默认执行更多 batching (批处理) 来增加开箱即用的性能改进，无需在应用程序或库代码中手动批处理更新。

batching 是指，React 可以将回调函数中多个 setState 事件合并为一次渲染。

React 17 只在事件回调中 batching，React 18 则会对任何来源的 setState 做尽可能多的 batching， 即使在 promise、timeout 或者 event 回调中调用多次 setState，也都会合并为一次渲染。

将 ReactDOM.render 替换为 ReactDOM.createRoot 调用方式，即可开启这些新特性。

### SSR for Suspense（Streaming SSR with selective hydration）

即像水流一样，打造一个从服务端到客户端持续不断的渲染管线，而不是 renderToString 那样一次性渲染机制。selective hydration 表示选择性水合，水合指的是后端内容打到前端后，JS 需要将事件绑定其上，才能响应用户交互或者 DOM 更新行为，而在 React 18 之前，这个操作必须是整体性的，而水合过程可能比较慢，会引起全局的卡顿，所以选择性水合可以按需优先进行水合。

可以让 Suspense 在 SSR 后端生效，多个组件渲染的场景下，不需要所有组件都完成再吐给前端，而是可以部分完成后 streaming 流式的返回给前端。具体 streaming 的实现是轮训还是 web socket，我还不知道。。介绍完这个特性以后，有 Shopify 来站台分享，他们做了 Hydrogen这个框架加速自建商店的开发。基于 React Server Component 和 Suspense for SSR 这些。有 Shopify 的支持，Hydrogen 这个框架值得期待，但这个妹子的 PPT 准备确实一般。

### New APIs for app and library developers

***并发渲染 （Concurrent Rendering）***  相关的变动是 React 18 的主要变动之一，简而言之，这个能力会让 React 应用保持更好的响应性。这是一种可中断渲染的设计架构。什么时候中断渲染呢？当一个更高优先级渲染到来时，通过放弃当前的渲染，立即执行更高优先级的渲染，换来视觉上更快的响应速度。

- useTransition：允许组件在切换到下一个界面之前等待内容加载，从而避免不必要的加载状态。

- startTransition：被 startTransition 回调包裹的 setState 触发的渲染 被标记为不紧急的渲染，这些渲染可能被其他紧急渲染所抢占。

- useDeferredValue：返回一个延迟响应的值，例如一个选择输入框过滤列表的场景，我们可以针对列表使用 useDeferredValue 传入选择器对应的值。

新的 startTransition 与 useDeferredValue API，本质上都是允许你将 UI 的一部分标记为较低的更新优先级。

### 其他API

- useSyncExternalStore：useSyncExternalStore 将替代 useMutableSource 用于订阅外部源，解决 Concurrent Rendering 可能导致的数据不一致的问题，也是库作者可能需要，一般开发者不太能用到。

- useId：useId 用于在客户端与服务端之间产生唯一 ID ，避免 SSR hydrate 时元素不匹配。

- useInsertionEffect：用于插入全局 DOM 节点。

React 18 将在明年与新的 React Native 架构（可用 React 18 特性）一起发布。



## 参考链接

[React18 中新的 Suspense SSR 架构](https://mp.weixin.qq.com/s/XY0ko6MFy0ag3e_QGF6JDg)

[React18 这次是真的来了](https://mp.weixin.qq.com/s/doYHRP5_uepSGBTZPPiNqg)
