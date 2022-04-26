---
title: Taro
---

## 简介

Taro在App端使用的是React Native的渲染引擎，原生的UI体验较好，但据说在实时交互和高响应要求的操作方面不是很理想。
微信小程序方面，结合度感觉没有那么顺滑，有一些常见功能还是需要自己去封装。
另外就是开发环境难度稍高，需要自己去搭建iOS和Android的环境，对于想要一处开发到处应用的傻瓜式操作来讲，稍显繁琐。

- 但Taro 3的出现，支持了React 和 Vue两种DSL，适合的人群会更多一点，并且对快应用的支持也更好。

## Taro

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f80d5680ee9~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f80de1d86b8~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

![](hhttps://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f80f9b4eb93~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f80fe86d3aa~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

## Taro Next

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f8113469adc~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

这是Taro Next 的整体架构图，即使各个 Framework 的框架拥有不同的组件库、生命周期、API，但我们仍然可以选定微信小程序作为一个基准，然后使用各种框架，去对接微信小程序的组件库、生命周期、API，然后在 Taro 运行时，内部对各个平台的缺失部分进行补全。例如在小程序里面，它没有 DOM 和 BOM，那我们就去实现对应的DOM 和 BOM，然后在 H5 端并没有微信小程序规范的组件库、路由规范、API 等等，我们也要去实现，最后用 Webpack 去对运行时的代码进行打包，就可以让整份代码运行在不同的平台上面。

### 更强大

1. 不限制语言和语法，运行真实的框架
2. 渲染HTML
3. 支持跨框架组件

整体来说 Taro Next 有三个优点。第一点是 Taro Next 更强大了，我们现在不限制语言和语法，可以运行各种真实的框架，还提供了渲染 HTML 和跨框架组件这些比较特色的功能。

### 更迅速

1. 剥离AST操作，更快的构建速度
2. 提升初始化、更新操作的性能
3. 提供一系列的优化选项

第二点是 Taro Next 更迅速了。我们剥除了 AST 操作，让构建速度更快。其次，我们也提升了项目初始化、更新操作的性能。除了Taro 自身的优化外，我们还提供了一系列的优化选项给用户，让用户可以根据自己的实际情况对项目进行调用。

### 更灵活

1. 插件化系统
2. 暴漏配置
3. 依赖瘦身

第三点是更灵活了，我们现在提供了一个插件化的系统，用户可以根据自己的场景去拓展一些自己的能力。然后我们还把一些 Taro 的内部配置项、Webpack 的配置项给暴露出来，用户可以配置的项目就更加之多。其次对 Taro 的依赖做了瘦身，现在 Taro 用户可以根据自己的实际情况去安装对应的依赖，而不是像以前一样把所有的依赖都打包到 Taro 的 cli 里面。

## 基础应用

## 原理浅析

### 小程序端

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f82acd85752~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f830b8884ea~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### H5端

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/22/17373f831d7d409d~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

Taro 这边遵循的是以微信小程序为主，其他小程序为辅的组件与 API 规范。 但浏览器并没有小程序规范的组件与 API 可供使用，我们不能在浏览器上使用小程序的 view 组件和 getSystemInfo API。因此Taro在 H5 端实现一套基于小程序规范的组件库和 API 库。

接下来看一下 H5 端的架构，同样的也是需要把用户的 React 或者 Vue 代码通过 Webpack 进行打包。然后在运行时我们需要去做三件事情：第一件事情是我们需要去实现一个组件库，组件库需要同时给到 React 、Vue 甚至更加多的一些框架去使用，因此我们就使用了 Stencil 去实现了一个基于 WebComponents 且遵循微信小程序规范的组件库，第二、三件事是我们需要去实现一个小程序规范的 API 和路由机制，最终我们就可以把整个程序给运行在浏览器上面。

- 实现组件库

最先容易想到的是使用 Vue 再开发一套组件库，这样最为稳妥，工作量也没有特别大。
但考虑到以下两点，官方遂放弃了此思路：

组件库的可维护性和拓展性不足。每当有问题需要修复或新功能需要添加，需要分别对 React 和 Vue 版本的组件库进行改造。
Taro Next 的目标是支持使用任意框架开发多端应用。倘若将来支持使用 Angular 等框架进行开发，那么需要再开发对应支持 Angular 等框架的组件库。

那么是否存在着一种方案，使得只用一份代码构建的组件库能兼容所有的 web 开发框架呢？
Taro的选择是 Web Components。

著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### RN端

- Taro3 React Native 是整体方案是利用 Metro 基于 Taro 源码打包。
- Metro 是针对 React Native 的 JavaScript 模块打包工具，接收一个入口文件和打包配置，将项目中所有依赖打包在一个或多个js文件。

- 打包过程会分为三个阶段：

1. Resolution：构建模块的依赖图，处理模块的依赖关系
2. Transformation：负责将模块转换成目标平台可以理解的格式
3. Serialization：模块转换序列化，组合这些模块来生成一个或多个包

对于 Taro 写法的支持，我们在 Transformation 转化阶段，通过自定义的 taro-rn-transformer 与 taro-rn-style-transformer 对 Taro 的代码进行转换。

[Taro3.2 适配 React Native 之运行时架构详解](https://blog.csdn.net/qq_39221436/article/details/117216480)

## 推荐阅读

[Taro多端组件库的设计与实现](https://juejin.cn/post/7080561486648590349)

[借助Taro Next横穿跨端业务线](https://juejin.cn/post/6854573214341791757)

[Taro3跨端跨框架原理初探-Elab](https://juejin.cn/post/6989968343163731981)

[Taro竟然适配鸿蒙了！](https://juejin.cn/post/7031826512126935076)






