---
title: 微前端之MicroApp
---

## 特性

![](https://img10.360buyimg.com/imagetools/jfs/t1/168885/23/20790/54203/6084d445E0c9ec00e/d879637b4bb34253.png)

### 没有沿袭single-spa的思路

### 借鉴了WebComponent的思想

过CustomElement结合自定义的ShadowDom，将微前端封装成一个类WebComponent组件，从而实现微前端的组件化渲染。并且由于自定义ShadowDom的隔离特性

### 成本低

micro-app不需要像single-spa和qiankun一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改webpack配置，是目前市面上接入微前端成本最低的方案

## 优势

1. 使用简单

我们将所有功能都封装到一个类WebComponent组件中，从而实现在基座应用中嵌入一行代码即可渲染一个微前端应用。

同时micro-app还提供了js沙箱、样式隔离、元素隔离、预加载、数据通信、静态资源补全等一系列完善的功能。

2. 零依赖

micro-app没有任何依赖，这赋予它小巧的体积和更高的扩展性。

3. 兼容所有框架

为了保证各个业务之间独立开发、独立部署的能力，micro-app做了诸多兼容，在任何技术框架中都可以正常运行。

## 参考

- [micro-app官网](https://cangdu.org/micro-app/docs.html#/)
- [初探 MicroApp，一个极致简洁的微前端框架](https://juejin.cn/post/7058112712076689439)
