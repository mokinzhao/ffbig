---
title: SWC
---

## 简介

[官网](https://swc.rs)

SWC 是一个可扩展的基于 Rust 的平台，适用于下一代快速开发工具。它被 Next.js、Parcel 和 Deno 等工具以及 Vercel、ByteDance、腾讯、Shopify 等公司使用。

SWC 可用于编译和捆绑。对于编译，它使用现代 JavaScript 功能获取 JavaScript / TypeScript 文件，并输出所有主流浏览器都支持的有效代码。

>SWC在单线程上比 Babel 快 20倍，在四核上快 70 倍。

## 安装使用

```sh
# Download prebuilt binaries
npm i -D @swc/cli @swc/core

# Transpile JavaScript file and emit to stdout
npx swc ./file.js
```

## 特点

SWC 被设计为可扩展的。目前，支持：

- 汇编
- 捆绑 (swcpack)
- 压缩
- 使用 WebAssembly 进行转换
- webpack ( swc-loader)内部的用法
- 提高 Jest 性能 ( @swc/jest)
- 自定义插件

## 参考

[新一代的编译工具 SWC](https://juejin.cn/post/7052644023651008548#heading-2)