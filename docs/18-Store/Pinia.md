---
title: Pinia
---

## 简介

Pinia最初是在 2019 年 11 月左右重新设计使用Composition API的 Vue Store 外观的实验。从那时起，最初的原则仍然相同，但 Pinia 适用于 Vue 2 和 Vue 3 ，并且不需要你使用组合 API。除了安装和SSR之外，两者的 API 都是相同的，并且这些文档针对 Vue 3 ，并在必要时提供有关 Vue 2 的注释，以便 Vue 2 和 Vue 3 用户可以阅读！

[官网](https://pinia.vuejs.org/introduction.html)

### 核心特性

- 完整的 TypeScript 支持：与在 Vuex 中添加 TypeScript 相比，添加 TypeScript 更容易
- 极其轻巧(体积约 1KB)
- store 的 action 被调度为常规的函数调用，而不是使用 dispatch 方法或 MapAction 辅助函数，这在 Vuex 中很常见
- 去除 mutations，只有 state，getters，actions（这是我最喜欢的一个特点）；
- 支持多个Store，无需手动添加 store，store 一旦创建便会自动添加；
安装
- 没有模块嵌套，只有 store 的概念，store 之间可以自由使用，更好的代码分割；
- 支持 Vue devtools、SSR 和 webpack 代码拆分

### 为什么要使用 Pinia？

Pinia 是 Vue 的存储库，它允许您跨组件/页面共享状态。如果您熟悉 Composition API，您可能会认为您已经可以使用简单的export const state = reactive({}). 这对于单页应用程序来说是正确的，但如果它是服务器端呈现的，则会将您的应用程序暴露给安全漏洞。但即使在小型单页应用程序中，您也可以从使用 Pinia 中获得很多好处：

- 开发工具支持
跟踪动作、突变的时间表
商店出现在使用它们的组件中
时间旅行和更容易的调试
- 热模块更换
在不重新加载页面的情况下修改您的商店
在开发时保持任何现有状态
- 插件：使用插件扩展 Pinia 功能
- 为 JS 用户提供适当的 TypeScript 支持或自动完成功能
- 服务器端渲染支持

## 与 Vuex 的比较

Pinia 最初是为了探索 Vuex 的下一次迭代会是什么样子，结合了 Vuex 5 核心团队讨论中的许多想法。最终，我们意识到 Pinia 已经实现了我们在 Vuex 5 中想要的大部分内容，并决定实现它取而代之的是新的建议。

与 Vuex 相比，Pinia 提供了一个更简单的 API，具有更少的仪式，提供了 Composition-API 风格的 API，最重要的是，在与 TypeScript 一起使用时具有可靠的类型推断支持。

### 与 Vuex 3.x/4.x 的比较

>Vuex 3.x 是 Vuex 的 Vue 2 而 Vuex 4.x 是 Vue 3

Pinia API 与 Vuex ≤4 有很大不同，即：

- 突变不再存在。他们经常被认为是非常冗长的。他们最初带来了 devtools 集成，但这不再是问题。
- 无需创建自定义复杂包装器来支持 TypeScript，所有内容都是类型化的，并且 API 的设计方式尽可能利用 TS 类型推断。
- 不再需要注入魔法字符串、导入函数、调用它们，享受自动完成功能！
- 无需动态添加商店，默认情况下它们都是动态的，您甚至都不会注意到。请注意，您仍然可以随时手动使用商店进行注册，但因为它是自动的，您无需担心。
- 不再有模块的嵌套结构。您仍然可以通过在另一个商店中导入和使用商店来隐式嵌套商店，但 Pinia 通过设计提供平面结构，同时仍然支持商店之间的交叉组合方式。你甚至可以有 store 的循环依赖。
- 没有命名空间的模块。鉴于商店的扁平架构，“命名空间”商店是其定义方式所固有的，您可以说所有商店都是命名空间的。

## 推荐阅读

[新一代状态管理工具，Pinia.js 上手指南](https://juejin.cn/post/7049196967770980389)

[Pinia进阶：优雅的setup（函数式）写法+封装到你的企业项目](https://juejin.cn/post/7057439040911441957)
