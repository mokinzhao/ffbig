---
title: React基础-开篇
---

- 先放几张思维导图

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/2.2.0%E5%85%A8%E6%A0%88%E5%A4%A7%E5%89%8D%E7%AB%AF%E4%B9%8B%E9%AB%98%E7%BA%A7%E8%BF%9B%E9%98%B6-React%E5%9F%BA%E7%A1%80.png)

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/2.2.0%E5%85%A8%E6%A0%88%E5%A4%A7%E5%89%8D%E7%AB%AF%E4%B9%8B%E9%AB%98%E7%BA%A7%E8%BF%9B%E9%98%B6-React%E5%BF%85%E7%AD%94%E4%BA%8C.png)

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/2.2.1%E5%85%A8%E6%A0%88%E5%A4%A7%E5%89%8D%E7%AB%AF%E4%B9%8B%E9%AB%98%E7%BA%A7%E8%BF%9B%E9%98%B6-ReactHooks.png)

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/2.2.1%E5%85%A8%E6%A0%88%E5%A4%A7%E5%89%8D%E7%AB%AF%E4%B9%8B%E9%AB%98%E7%BA%A7%E8%BF%9B%E9%98%B6-React%E7%94%9F%E6%80%81.png)

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/2.2.3%E5%85%A8%E6%A0%88%E5%A4%A7%E5%89%8D%E7%AB%AF%E4%B9%8B%E9%AB%98%E7%BA%A7%E8%BF%9B%E9%98%B6-React%E6%BA%90%E7%A0%81.png)

## 概念

一个用于构建用户界面的 JavaScript 库

React 的中文含义是“反应”或“响应”，它描述了 React 这样一个前端框架的核心原 理:当数据发生变化时，UI 能够自动把变化反映出来。这在 React 当时出现的背景之下， 可以说是一个颠覆式的创新。

我之所以用“颠覆”这个词，是因为它不仅提供了一个框架，而且彻底改变了前端的开发 思路，甚至电脑桌面、手机应用的开发也受到了 React 开发思路的影响。

在 2013 年 React 出现之时，主流的开发 UI 的方式仍然是基于浏览器 DOM 的 API，去 精细地控制 DOM 节点的创建、修改和删除。为了保证 UI 上的一致性，我们需要非常小心 地处理因各种数据的变化而导致的 UI 的变化。

举个例子。对于一个聊天应用，当来了一条新消息时，我们一方面需要在聊天框内添加一 条新消息，同时也要在显示消息数量的地方让数字加 1，这样才能保证 UI 的一致性。

在 React 之前，我们需要调用 DOM 的 API 来修改 DOM 树的结构，从而改变 UI 的展 现。而在有了 React 之后，我们只需要在业务状态和 UI 状态之间建立一个绑定的关系就 行了。绑定完成后，我们就不需要再关心怎么去精细控制 UI 的变化，因为 React 会在数 据发生变化时，帮助我们完成 UI 的变化。

### 核心特性

- 声明式

React 使创建交互式 UI 变得轻而易举。为你应用的每一个状态设计简洁的视图，当数据变动时 React 能高效更新并渲染合适的组件。

以声明式编写 UI，可以让你的代码更加可靠，且方便调试。

- 组件化

构建管理自身状态的封装组件，然后对其组合以构成复杂的 UI。

由于组件逻辑使用 JavaScript 编写而非模板，因此你可以轻松地在应用中传递数据，并保持状态与 DOM 分离。

- 跨平台

无论你现在使用什么技术栈，在无需重写现有代码的前提下，通过引入 React 来开发新功能。

React 还可以使用 Node 进行服务器渲染，或使用 React Native 开发原生移动应用

## React不足

 React 并不是一个一揽子框架，比如路由一类的功能，React 团队更希望交给社区来解决。所以导致在技术选型与学习使用上有比较高的成本。但也正因为社区蓬勃发展，非官方的一揽子解决方案还是有的，比如 DvaJS、React-coat 等填补了生态位的缺失。所以 React 也是一个使用者上限与下限差距极大的框架。
