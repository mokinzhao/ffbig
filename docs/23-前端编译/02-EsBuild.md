---
title: EsBuild
---

## 简介

- [官网](https://esbuild.github.io/)

Esbuild 是由 Figma 的 CTO 「Evan Wallace」基于 Golang 开发的一款打包工具，相比传统的打包工具，主打性能优势，在构建速度上可以快 10~100 倍。

- 为什么这么快 ？

1. js是单线程串行，esbuild是新开一个进程，然后多线程并行，充分发挥多核优势
2. go是纯机器码，肯定要比JIT快
3. 不使用 AST，优化了构建流程。（也带来了一些缺点，后面会说）

## 优点

### Golang 开发

采用 Go 语言开发，相比于 单线程 + JIT 性质的解释型语言 ，使用 Go 的优势在于 :

1. 一方面可以充分利用多线程打包，并且线程之间共享内容，而 JS 如果使用多线程还需要有线程通信(postMessage)的开销；

2. 另一方面直接编译成机器码，而不用像 Node 一样先将 JS 代码解析为字节码，然后转换为机器码，大大节省了程序运行时间。

### 多核并行

内部打包算法充分利用多核 CPU 优势。Esbuild 内部算法设计是经过精心设计的，尽可能充分利用所有的 CPU 内核。所有的步骤尽可能并行，这也是得益于 Go 当中多线程共享内存的优势，而在 JS 中所有的步骤只能是串行的。 Data to Drag

### 从零造轮子

从零开始造轮子，没有任何第三方库的黑盒逻辑，保证极致的代码性能。

### 高效利用内存

一般而言，在 JS 开发的传统打包工具当中一般会频繁地解析和传递 AST 数据，比如 string -> TS -> JS -> string，这其中会涉及复杂的编译工具链，比如 webpack -> babel -> terser，每次接触到新的工具链，都得重新解析 AST，导致大量的内存占用。而 Esbuild 中从头到尾尽可能地复用一份 AST 节点数据，从而大大提高了内存的利用效率，提升编译性能。

## 缺点

esbuild 同样不是完美的（如果真有那么完美为什么还没有大面积使用呢？），为了保证 esbuild 的编译效率，esbuild 没有提供 AST 的操作能力。所以一些通过 AST 处理代码的 babel-plugin 没有很好的方法过渡到 esbuild 中（说的就是你 babel-plugin-import）。so，如果你的项目使用了 babel-plugin-import, 或者一些自定义的 babel-plugin 。在目前来看是没有很好的迁移方案的。

## 与SWC对比

### 速度

Esbuild 与 SWC 在性能上是在一个量级的，这里通过仓库的例子 Esbuild 略快，但不排除其他例子里面 SWC 比 Esbuild 略快的场景

### 兼容性

- Esbuild 本身的限制，包括如下：
    - 没有 TS 类型检查
    - 不能操作 AST
    - 不支持装饰器语法
    - 产物 target 无法降级到 ES5 及以下

意味着需要 ES5 产物的场景只用 Esbuild 无法胜任。

- 相比之下，SWC 的兼容性更好：
    - 产物支持 ES5 格式
    - 支持装饰器语法
    - 可以通过写 JS 插件操作 AST

### 应用场景

对于 Esbuild 和 SWC，很多时候我们都在对比两者的性能而忽略了应用场景。对于前端的构建工具来说主要有这样几个垂直的功能:

- Bundler
- Transformer
- Minimizer

从上面的速度和兼容性对比可以看出，Esbuild 和 SWC 作为 transformer 性能是差不多的，但 Esbuild 兼容性远远不及 SWC。因此，SWC 作为 Transformer 更胜一筹。
但作为 Bundler 以及 Minimizer，SWC 就显得捉襟见肘了，首先官方的 swcpack 目前基本处于不可用状态，Minimizer 方面也非常不成熟，很容易碰到兼容性问题。
而 Esbuild 作为 Bundler 已经被 Vite 作为开发阶段的依赖预打包工具，同时也被大量用作线上 esm CDN 服务，比如esm.sh等等；作为 Minimizer ，Esbuild 也已足够成熟，目前已经被 Vite 作为 JS 和 CSS 代码的压缩工具用上了生产环境。

综合来看，SWC 与 Esbuild 的关系类似于当下的 Babel 和 Webpack，前者更适合做兼容性和自定义要求高的 Transformer(比如移动端业务场景)，而后者适合做 Bundler 和 Minimizer，以及兼容性和自定义要求均不高的 Transformer。

## 推荐阅读

[ESbuild 介绍](https://juejin.cn/post/6918927987056312327)

[前端构建新世代，Esbuild 原来还能这么玩！](https://juejin.cn/post/7049147751866564621)

[快速上手 Esbuild](https://mp.weixin.qq.com/s/TKcfBTMJgtBrz4doEwyytg)

[深度：使用Esbuild为你的构建提速](https://mp.weixin.qq.com/s/7MR1raMmafEELiC9qTSaYQ)
