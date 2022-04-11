---
title: React原理-ErrorBoundaries
---



## 异常捕获的限制

1. 只能在Class组件中使用
2. 不会捕获异步代码(比如setTimeout,Promise)中的异常
3. 不能捕获服务端渲染的错误
4. 假如异常边界组件自身报错了，也不能被捕获
5. 事件里面的报错

## 参考

- [React，优雅的捕获异常](https://juejin.cn/post/6974383324148006926#heading-3)
- [React，优雅的捕获异常进阶篇，含Hooks方案](https://juejin.cn/post/6976414994107727909#heading-16)
- [Error Boundaries是这么实现的，还挺巧妙](https://mp.weixin.qq.com/s/kkAhSMFmhiEgE_pgfP8bOg)
