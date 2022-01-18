---
title: React-版本特性
---

- React 版本演进图

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/version.jpg)

## React 16+



## React 17



## React 18

- Automatic batching：React 17 的批量更新只在事件回调中才会生效。这次 React 18 后对 Promise、setTimeout 等同样会做自动批量更新。

- startTransition & useDeferredValue：这里的 Transition 并不是动画的API，而是用来降低渲染优先级。分别用来包裹计算量大的 function 和 value，降低优先级，减少重复渲染次数。

- useId：是一个生成唯一 dom id 的 hooks。为了唯一的 id，最简单的做法是随机数，但这样的问题是 SSR 的场景下前后端生产的 id 不一致。useId 就是基于 DOM 的层级结构来生产唯一 id，确保前后端一致。

- Streaming SSR with Suspense：可以让 Suspense 在 SSR 后端生效，多个组件渲染的场景下，不需要所有组件都完成再吐给前端，而是可以部分完成后 streaming 流式的返回给前端。具体 streaming 的实现是轮训还是 web socket，我还不知道。。介绍完这个特性以后，有 Shopify 来站台分享，他们做了 Hydrogen这个框架加速自建商店的开发。基于 React Server Component 和 Suspense for SSR 这些。有 Shopify 的支持，Hydrogen 这个框架值得期待，但这个妹子的 PPT 准备确实一般。




