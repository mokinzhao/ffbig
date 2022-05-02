---
title: Uni-app
---


## 简介

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/21/1736ec7c68e860c0~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/21/1736ec7c6b7360a2~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)


## 方案概要

业内主流的小程序跨端框架，基本都是**编译器 + 运行时**配合实现，uni-app 同样如此。

uni-app 遵循 Vue.js 语法规范，Vue.js 是单文件、三段式结构。而小程序是多文件结构，以微信为例，小程序有 wxml/wxss/js/json 4 个文件组成。
uni-app 会在编译阶段，将 .vue 格式的单文件拆分成小程序开发工具所接受的多文件。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/21/1736ec7ca5302c21~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)


Vue.js 和小程序都是典型的逻辑视图层框架，逻辑层和视图层之间的工作方式为：数据变更驱动视图更新；视图交互触发事件，事件响应函数修改数据再次触发视图更新。
Vue.js 和小程序这两个机制接近的框架之间，如何分工协同？
这就需要 uni-app Runtime 作为中间桥梁，uni-app 提供了一个运行时，打包到最终运行的小程序发行代码中，该运行时实现了 Vue.js 和小程序两系统之间的数据同步、事件同步以及生命周期管理。
具体来说，实现方式如 PPT 上原理图：

uni-app Runtime 将小程序的数据绑定功能，托管给了 Vue；Vue 数据变更后，通过 uni-app Runtime  的数据同步机制将最新数据同步到小程序；
小程序负责视图层展示及用户交互，用户在小程序视图中触发点击、滚动等操作后，先触发小程序的事件函数，接着通过 uni-app Runtime 的事件代理机制，触发 Vue 的事件函数，因此业务逻辑同样收敛在 Vue 中；
小程序的生命周期，纳入 Vue 实例的生命周期中。

这样，开发者就可以将精力聚焦在 Vue.js 上，遵循 Vue.js 规范编写业务逻辑，也就实现了完整的 Vue 开发体验。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/21/1736ec7c9f7fdf92~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

## 性能优化

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/21/1736ec7d393b298e~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

## 总结

uni-app 小程序 SDK 具备如下几个特征：

- 性能更高：支持 native 渲染，扩展 wxs，更高的通讯性能；

- 开放性更强：更灵活的配置，支持更多 App 的体验；

- 生态丰富：支持微信小程序自定义组件，支持所有 uni-app 插件，uni-app 插件市场目前已有上千款成熟插件。

## 参考

[如何打磨 uni-app 的高性能和易用性](https://juejin.cn/post/6854573212924117005)
