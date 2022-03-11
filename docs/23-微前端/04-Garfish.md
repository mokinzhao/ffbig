---
title: 微前端之Garfish
---

## 特性

- 🌈 丰富高效的产品特征
    - Garfish 微前端子应用支持任意多种框架、技术体系接入
    - Garfish 微前端子应用支持「独立开发」、「独立测试」、「独立部署」
    - 强大的预加载能力，自动记录用户应用加载习惯增加加载权重，应用切换时间极大缩短
    - 支持依赖共享，极大程度的降低整体的包体积，减少依赖的重复加载
    - 内置数据收集，有效的感知到应用在运行期间的状态
    - 支持多实例能力，可在页面中同时运行多个子应用提升了业务的拆分力度
    - 提供了高效可用的调试工具，协助用户在微前端模式下带来的与传统研发模式不同带来的开发体验问题
- 📦 高扩展性的核心模块
    - 通过 Loader 核心模块支持 HTML entry、JS entry 的支持，接入微前端应用简单易用
    - Router 模块提供了路由驱动、主子路由隔离，用户仅需要配置路由表应用即可完成自主的渲染和销毁，用户无需关心内部逻辑
    - Sandbox 模块为应用的 Runtime 提供运行时隔离能力，能有效隔离 JS、Style 对应用的副作用影响
    - Store 提供了一套简单的通信数据交换机制
- 🎯 高度可扩展的插件机制（coming soon...）
    - 提供业务插件满足业务方的各种定制需求

## 架构

![](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/d456c7d2235c41daa298aba69ade435f~tplv-em5hxbkur4-noop.image?width=1126&height=454)



## 参考

[字节跳动是如何落地微前端的](https://juejin.cn/post/7016911648656982024#heading-32)

[字节跳动Garfish微前端实现原理](https://mp.weixin.qq.com/s/OIdrqLk-opQBDY2Wyw5gJw)




