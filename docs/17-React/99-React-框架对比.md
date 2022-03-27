---
title: React扩展-框架对比
---

## React VS Vue

### 技术区别

- 设计理念

react 一个渐进式的UI库

Vue 响应式

- 渲染机制

react ：单向数据流，基于 Fiber 架构，异步可中断更新，

Vue2.x 基于 Object.DefineProperty

Vue3.x 基于Proxy

监听劫持对象，响应式操作DomDiff算法

- Diff算法不一样

Vu3 有静态标记

- 其他

- 相同点：

1. 都是单向数据流
2. 都使用了虚拟DOM的技术
3. 都支持SSR
4. 组件化开发

- 不同点：

1. 前者template，后者JSX
2. 数据改变，前者响应式，后者手动setState
3. React单向绑定，Vue双向绑定
4. React状态管理工具Redux、Mobx，Vue状态管理工具Vuex

### 生态区别

- 作者

React:faceBook

Vue：尤雨稀为主的团队

- React 生态强大 阿里、字节等大厂React技术栈偏多

- Vue 中小厂使用的多一些，上手简单方便。有一揽子解决方案

### 推荐阅读

- [阿里三面：灵魂拷问——有react fiber，为什么不需要vue fiber？](https://mp.weixin.qq.com/s?__biz=Mzg2Nzc0NzQ3OQ==&mid=2247484417&idx=1&sn=d0e84f484fc88b67ebcc36d179b8eff8&chksm=ceb797f9f9c01eefeaa817c0634c68ec6b05c844ac8370aee05b6424011fa4c5da42b9aa28ab&scene=178&cur_album_id=2279444241133240321#rd)

## React VS Angular

- 体系结构

React : 只有 MVC 中的 View

Angular: 完整的 MVC

- 渲染

可以在服务器端渲染

客户端渲染

- DOM

使用 virtual DOM

使用 real DOM

- 数据绑定

单向数据绑定

双向数据绑定

- 调试

编译时调试

运行时调试

- 作者

Facebook

Google

## 其他框架

### Preact

### Solid

[Solid.js 就是我理想中的 React](https://mp.weixin.qq.com/s/0sGJ9r_9C9EPzliEkUuyTg)

### Svelte

在《Stack Overflow 于 2021 年准备的最新调查》中，71.47% 的受访者将 Svelte 选为最受欢迎的框架，领先于 React.js 的 69.28% 和 Vue 的 64.41%。而在 JS 现状 2020 调查 中，Svelte 在用户满意度 89%、兴趣度 66% 均取得了第一的成绩表现。Svelte 从一诞生，就用来对标 React/Vue 等框架，我们也看到了关于 Svelte 与 React 的争论，看到了 19 年尤大回复的《如何看待 Svelte 这个前端框架》以及 21 年 vue-Svelte-size-analysis 评测，足见 Svelte 的发展态势。

我们调查发现，开发者喜爱 Svelte，主要源于以下几点：

- 更高的开发效率。Svelte 有着极其简洁的语法，交互式教程让其有较低的学习曲线和上手成本，熟悉 vue 语法的基本上很快能够上手。

- 更小的体积。Svelte 的核心思想在于通过静态编译减少框架运行时的代码量，这在小型应用中，优势相当明显，React 的压缩版本大小为 42.2KB，Svelte 的压缩版本大小为 1.6KB。但是在中大型应用中，这个优势会被慢慢缩小，甚至成为劣势。

- 更高的性能。Svelte 没有采用现在普遍使用的 Virtual Dom，而是另辟蹊径采用 Template 语法，让编译器在编译阶段就记录了哪些数据需要更新。这让 Svelte 性能不仅胜过 React，还胜过 Angular 和 Vue。

- 更优的 Web Components 分发。Svelte 直接编译成 JS，生成浏览器能够识别的 Web Components 组件，这让基于 Svelte 开发的组件能够用于其它框架，譬如 React/Vue/Angular 等。

时光飞逝，Svelte 的发展速度可能也超乎我们的想象。被诟病不支持 TypeScript 的前端框架没有未来的 Svelte 在 2021 年也支持了 TypeScript，UI 库 Svelte Material UI 也在逐步迭代中，开发者社区也加入了越来越多的小伙伴，丰富了 Svelte 在单元测试、Web Components、SSR 等方面的实践。

回顾 2021 年，Svelte 最重要的莫过于下面两件事：

1. 2021 年 11 月 20 日举办了秋季峰会。峰会 Rich Harris 给我们讲述了 Svelte 的历史，并宣布他将入职 Vercel，之后全职维护 Svelte。峰会上也邀请到了社区众多的开发者，分享 Svelte 的一些实践，让我们看到 Svelte 更多的可能性。

2. SvelteKit 正式发布 beta 版。SvelteKit 是基于 Svelte 开发的 web 应用框架，类似于基于 Vue.js 开发的 Nuxt.js 框架。它继承了服务端渲染 SSR，路由，支持

- 总结

虽然我们看到 Svelte 深受开发者的喜欢，但是到目前为止，仍然很难看到有大型应用在使用 Svelte，其性能优势、体积优势等并没有在大型应用中得到验证。由于 React/Vue/Angular 先入为主，尤其是在大公司，已经有非常完备成体系的配套方案，成熟的体系基本上很难去改动，后起之秀也很难有如 React 等框架活跃的社区，Svelte 要走的路还是很长。但是我们观察到，包括阿里、字节、腾讯等大公司也都在新业务中尝试使用 Svelte 开发，在中小型应用、h5 应用、Web Components 等方面确实有它的优势所在，也值得尝试。尽管 Svelte 有很多优势，但想以一己之力挑战 React/Vue/Angular 的江湖地位，目前来看还是需要静待标杆大型应用，静待各大大公司推出基于 Svelte 开发的 UI 库，或许 Svelte 大放异彩的时机就会到来。

[一文详解 Svelte](https://mp.weixin.qq.com/s/pUCk75aKfyvCSyT28HpwKQ)

## 参考

[框架究竟解决了啥问题？我们可以脱离它们吗](https://mp.weixin.qq.com/s/J_Fs2jrhOsGdAxlBnJKYCw)
