---
title: Vite
---

## 简介

Vite基于esbuild与Rollup，依靠浏览器自身ESM编译功能， 实现极致开发体验的新一代构建工具！

Vite是新一代的前端构建工具，在尤雨溪开发Vue3.0的时候诞生。类似于Webpack+ Webpack-dev-server。其主要利用浏览器ESM特性导入组织代码，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。生产中利用Rollup作为打包工具，号称下一代的前端构建工具。

Vite有如下特点：

- 快速的冷启动: No Bundle + esbuild 预构建
- 即时的模块热更新: 基于ESM的HMR，同时利用浏览器缓存策略提升速度
- 真正的按需加载: 利用浏览器ESM支持，实现真正的按需加载

## Vite和传统打包方式的对比

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4af911f09d442b2a711bcea101c2fd7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### VS Webpack

Webpack是近年来使用量最大，同时社区最完善的前端打包构建工具，新出的5.x版本对构建细节进行了优化，在部分场景下打包速度提升明显。Webpack在启动时，会先构建项目模块的依赖图，如果在项目中的某个地方改动了代码，Webpack则会对相关的依赖重新打包，随着项目的增大，其打包速度也会下降。

Vite相比于Webpack而言，没有打包的过程，而是直接启动了一个开发服务器devServer。Vite劫持浏览器的HTTP请求，在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再返回给浏览器(整个过程没有对文件进行打包编译)。所以编译速度很快。

### VS SnowPack

Snowpack 首次提出利用浏览器原生ESM能力的打包工具，其理念就是减少或避免整个bundle的打包。默认在 dev 和 production 环境都使用 unbundle 的方式来部署应用。但是它的构建时却是交给用户自己选择，整体的打包体验显得有点支离破碎。

而 Vite 直接整合了 Rollup，为用户提供了完善、开箱即用的解决方案，并且由于这些集成，也方便扩展更多的高级功能。

两者较大的区别是在需要bundle打包的时候Vite 使用 Rollup 内置配置，而 Snowpack 通过其他插件将其委托给 Parcel/``webpack。

## 核心原理

1. 当声明一个 script标签类型为 module 时,如

```js
  <script type="module" src="/src/main.js"></script>

```

2. 当浏览器解析资源时，会往当前域名发起一个GET请求main.js文件

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

3. 请求到了main.js文件，会检测到内部含有import引入的包，又会import 引用发起HTTP请求获取模块的内容文件，如App.vue、vue文件

**Vite**其核心原理是利用浏览器现在已经支持ES6的import,碰见import就会发送一个HTTP请求去加载文件，Vite启动一个 koa 服务器拦截这些请求，并在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再以ESM格式返回返回给浏览器。Vite整个过程中没有对文件进行打包编译，做到了真正的按需加载，所以其运行速度比原始的webpack开发编译速度快出许多！

## 推荐阅读

- [深入理解Vite核心原理](https://juejin.cn/post/7064853960636989454#heading-6)
- [下一代前端开发利器——Vite（原理源码解析）](https://mp.weixin.qq.com/s/Y8wkrnkZxT6PdWJ_4jgV5A)
- [把 Vite 接入到 Webpack 项目里了！？](https://mp.weixin.qq.com/s/uBlKxIEhX5Hz0oe5xkVkQw)
- [深入浅出 Vite](https://juejin.cn/book/7050063811973218341)

- [前端框架源码解读之Vite](https://mp.weixin.qq.com/s/_w1b04nsEZk1AfaKDiRiUg)