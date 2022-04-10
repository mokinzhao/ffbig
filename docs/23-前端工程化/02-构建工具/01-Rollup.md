---
title: Rollup
---

2015 年，Rollup[13] 发布首版，并在 2019 年发布 1.0 正式版，它主打工具库的打包，相比 Webpack 配置更简单和轻量；

- Rollup 是一个 JS 模块打包器，它与 Webpack 定位不同，它更专注于 JS 类库的打包工作。操作过程和webpack差不多，它也是可以以命令行或者配置文件（rollup.config.js）的方式来完成打包操作的。默认支持 ES Module 中的 import/export 语法还有相对路径（Webpack中相对路径要配合path模块）。

1. Rollup 更适合用来开发一些纯 JS 库。
2. Rollup 不支持代码分割。
3. Rollup 默认只支持 import/export 方式导入导出，如需使用 CommonJS 模块规范，则必须单独配置插件。
4. Rollup 不能直接处理导入的第三方依赖模块，需要插件@rollup/plugin-node-resolve 来处理路径才能使用。
5. 开发服务器 Dev Server 需要通过 rollup-plugin-server 插件来实现。
6. 支持Tree-shaking
