---
title: Webpack ModuleFederation
---

# webpack的模块联邦




## 原理浅析

1. 下载并执行 remoteEntry.js，挂载入口点对象到 window.app1，他有两个函数属性，init 和 get。init 方法用于初始化作用域对象 initScope，get 方法用于下载 moduleMap 中导出的远程模块。
2. 加载 app1 到本地模块
3. 创建 app1.init 的执行环境，收集依赖到共享作用域对象 shareScope
4. 执行 app1.init，初始化 initScope
5. 用户 import 远程模块时调用 app1.get(moduleName) 通过 Jsonp 懒加载远程模块，然后缓存在全局对象 window['webpackChunk' + appName]
6. 通过 webpack_require 读取缓存中的模块，执行用户回调

## 参考

[解密Webpack5的Module Federation](https://mp.weixin.qq.com/s/wTOiubS5fm_UAQFaz1d6yg)

[Webpack5 模块联邦原理](https://github.com/Vincent0700/learning-webpack/blob/master/docs/Webpack%E6%A8%A1%E5%9D%97%E8%81%94%E9%82%A6%E5%8E%9F%E7%90%86.md)

