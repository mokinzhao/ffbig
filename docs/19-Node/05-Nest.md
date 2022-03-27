---
title: Nest
---

## 基本概念

Nest.js 是“Angular 的服务端实现”，基于装饰器。Nest.js 与其他前端服务框架或库的设计思路完全不同。我们通过查看请求生命周期中的几个节点的用法来体验下 Nest.js 的设计方式。

先来看下 Nest.js 完整的的生命周期：

```js
收到请求
中间件
全局绑定的中间件
路径中指定的 Module 绑定的中间件
守卫
全局守卫
Controller 守卫
Route 守卫
拦截器（Controller 之前）
全局
Controller 拦截器
Route 拦截器
管道
全局管道
Controller 管道
Route 管道
Route 参数管道
Controller（方法处理器）
服务
拦截器（Controller 之后）
Router 拦截器
Controller 拦截器
全局拦截器
异常过滤器
路由
控制器
全局
服务器响应

```

可以看到根据功能特点拆分的比较细，其中拦截器在 Controller 前后都有，与 Koa 洋葱圈模型类似



## 推荐阅读

[这可能是你看过最全的 「NestJS」 教程了](https://juejin.cn/post/7078847428455530526)

[Nest.js 用了 Express 但也没完全用](https://mp.weixin.qq.com/s/qcy5sL0sV6wnxif8EEBrMQ)

[Nest.js 是如何实现 AOP 架构的？](https://mp.weixin.qq.com/s/fs7EPC8lzOABHhj3ayS0Jw)
