---
title: Webpack 知识综合二
---

## webpack的 loader 和 plugin 区别

- loader
加载器，webpack原生只能解析js文件，
通过配置一些加载器能加载和解析非js文件的能力

- 扩展webpack，让webpack更具灵活性
webpack构建过程中有很多事件，
可以去监听这些事件，在合适的时机通过webpackAPI改变输出结果

## webpack 常用插件

## webpack 如何做代码拆分

## webpack tree shaking 原理

## webpack 动态导入原理

## webpack 热更新原理，怎么找到对应的局部模块做更新的

## webpack5 新特性

## less-loader 的 less 转成 css 的底层原理

## Webpack bundle、chunk、module的区别

## hash/chunkhash/contenthash 的区别

- hash 反映了项目的构建版本，因此同一次构建过程中生成的 hash 都是一样的。换句话说，如果项目里某个模块发生更改，触发项目的重新构建，那么文件的 hash 值将会相应地改变。如果使用 hash 策略，存在一个问题：即使某个模块的内容压根没有改变，但是重新构建后会产生一个新的 hash 值，使得缓存命中率较低。

- 针对以上问题，chunkhash 和 contenthash 就不一样了，chunkhash 会根据入口文件（Entry）进行依赖解析。

- contenthash 则会根据文件具体内容，生成 hash 值。

## 推荐阅读

[透过分析 webpack 面试题，构建 webpack5.x 知识体系](https://juejin.cn/post/7023242274876162084#heading-2)

[webpack 十连问你能接住几题](https://juejin.cn/post/7002839760792190989#heading-9)

[Webpack5核心打包原理全流程解析](https://juejin.cn/post/7031546400034947108)

[面试官：webpack原理都不会？](https://juejin.cn/post/6859538537830858759#heading-21)
