---
title: Node基础
---

## 什么是 Node.js

Chrome 控制浏览器
Node 控制计算机

## node 应用场景和作用

### 前端工程化

- 受众群体：前端开发工程师
- 特点：提升研发效率和保证工程质量
- 具体应用：Webpack、Goulp 、客户端应用（Electron）

### 服务端渲染 SSR

- 搜索引擎优化
- 优化首屏加载速度

### 后端服务

- 受众群体：真实用户和产研，提供数据处理和接口
- 特点：并发处理，保障稳定性和安全性，真正发挥出 Node.js 的异步驱动特性

- 具体应用：SSR,BFF Server

异步驱动特性，在主线程不被 CPU 密集型所影响时，可真正发挥出 Node.js 高并发特性，可以作为大部分网络 I/O 较高的后端服务

#### 服务分类

- RESTful

- RPC

- ServerLess

#### 运行环境

- devops
- pm2
- 监控和告警机制
- 日志打印和跟踪染色

## 架构

### Natives Modules（API 层）

由 js 实现，提供了应用程序可直接调用库，例如 fs、path、http 等；

### Builtin Modules（胶水层）

主要由 c++ 代码编写而成，除了内置模块，也包含了很多第三方模块，需要 v8 引擎配合实现，相当于提供了对底层库的功能对照表；

### v8, libuv, c-ares, http parser, zlib, ... （底层）

- v8：执行 js 代码，提供桥梁接口
- libuv：事件循环、事件队列、异步 IO

## 核心特性

### 高性能体现：事件循环机制

- timers：本阶段执行已被 setTimeout()和 setInterval()调度的回调函数，由这两个函数启动的回调函数
- pending callbacks: 本阶段执行某些系统操作的回调函数
- idle、prepare：仅系统内部使用，只需要知道有这 2 个阶段就可以
- poll：检索新的 i/o 事件，执行与 i/o 相关的回调其他情况 Node.js 将在适当时在此阻塞
- check：setImmediate（）回调函数在这里执行 setImmediate 并不是立马执行而是当事件循环 poll 中没有新的事件处理时就执行该部分

### 单线程/多线程

主线程是单线程执行的，但 Node.js 存在多线程执行，多线程包括 setTimeout 和异步 i/o 事件，
其实 Node.js 还存在其他线程，包括垃圾回收、内存优化等

### 总结

- 优点：善于 网络 I/O 密集型处理，并发特性处理好
- 缺点：不善于处理 大内存和 cpu 密集型计算，例如：图片处理，大字符串，大数组处理，大文件读写

## 全局变量

### 常用全局变量

- global: 上下文对象
- \_\_filename: 返回正在执行脚本文件的绝对路径
- \_\_dirname: 返回正在执行脚本文件所在的目录
- timer 类函数: 执行顺序与事件循环间的关系
- process: 进程相关
- require: 模块加载
- module、exports: 模块导出

### process

```js
/**
 * 1. 资源
 */
// 内存使用情况
console.log(process.memoryUsage());
// cpu使用情况
console.log(process.cpuUsage());

/**
 * 2. 运行环境
 */
// 项目目录
console.log(process.cwd());
// node版本
console.log(process.version);
// node及底层lib版本
console.log(process.versions);
// cpu架构
console.log(process.arch);
// 环境字段（需要配置）
console.log(process.env.NODE_ENV);
// 本机环境变量
console.log(process.env.PATH);
// 用户环境(windows)
console.log(process.env.USERPROFILE);
// 用户环境(MacOS)
console.log(process.env.HOME);
// 系统平台
console.log(process.platform);

/**
 * 3. 运行状态
 */
// 启动参数
console.log(process.argv);
// PID
console.log(process.pid);
// 运行时间
console.log(process.uptime());
```

## 核心模块

### path

用来处理文件/目录的路径

```js
const path = require("path");
```

#### basename() 获取路径中的基础名称

```js
console.log(path.basename(__filename)); // xxx.js
console.log(path.basename(__filename, ".js")); // xxx
console.log(path.basename(__filename, ".abc")); // xxx.js
console.log(path.basename("/a/b/c")); // c
console.log(path.basename("/a/b/c/")); // c
```

#### dirname() 获取路径中目录名称

```js
console.log(path.dirname(__filename)); // /xxx/xxx/xxx
console.log(path.dirname("/a/b/c")); // /a/b
console.log(path.dirname("/a/b/c/")); // /a/b
```

#### extname() 获取路径中扩展名称

```js
console.log(path.extname(__filename)); // .js
console.log(path.extname("/a/b")); // 空
console.log(path.extname("/a/b/index.html.js.css")); // .css
console.log(path.extname("/a/b/index.html.js.")); // .
```

#### parse() 解析路径

```js
const o1 = path.parse("/a/b/c/index.html");
console.log(o1); // { root: "/", dir: "/a/b/c", base: "index.html", ext: ".html", name: "index" }

const o2 = path.parse("/a/b/c"); // path.parse("/a/b/c/")
console.log(o2); // { root: "/", dir: "/a/b", base: "c", ext: "", name: "c" }

const o3 = path.parse("./a/b/c");
console.log(o3); // { root: "/", dir: "/a/b", base: "c", ext: "", name: "c" }
```

#### format() 序列化路径

```js
const obj = path.parse("./a/b/c");
console.log(path.format(obj)); // ./a/b/c
```

#### isAbsolute() 是否为绝对路径

```js
console.log(path.isAbsolute("/foo")); // true
console.log(path.isAbsolute("///foo")); // true
console.log(path.isAbsolute("foo")); // false
console.log(path.isAbsolute("")); // false
console.log(path.isAbsolute(".")); // false
console.log(path.isAbsolute("../foo")); // false
```

#### join() 拼接路径

```js
console.log(path.join("a/b", "c", "index.html")); // a/b/c/index.html
console.log(path.join("/a/b", "c", "index.html")); // /a/b/c/index.html
console.log(path.join("/a/b", "c", "../", "index.html")); // /a/b/index.html
console.log(path.join("/a/b", "c", "./", "index.html")); // /a/b/c/index.html
console.log(path.join("/a/b", "c", "", "index.html")); // /a/b/c/index.html
console.log(path.join("")); // .
```

#### normalize() 规范化路径

```js
console.log(path.normalize("a/b/c/d")); // a/b/c/d
console.log(path.normalize("a////b/c/d")); // a/b/c/d
console.log(path.normalize("a//\\/b/c/d")); // a/b/c/d
console.log(path.normalize("a//\b/c/d")); // a/c/d
console.log(path.normalize("")); // .
```

#### resolve() 绝对路径

```js
console.log(path.resolve()); // 返回工作目录
console.log(path.resolve("a", "b")); // D:/xxx/xxx/xxx/a/b
console.log(path.resolve("index.html")); // D:/工作目录/index.html
```

### Buffer

- 全局变量，实现 NodeJS 平台下二进制文数据的操作
- 一般配合 Stream 流使用，充当数据缓冲区
- 它不占用 v8 堆内存的空间，但是内存的使用由 Node 来控制，由 v8 的 GC 来回收

#### 创建 Buffer

```js
const b1 = Buffer.alloc(6);
const b2 = Buffer.form("中"); // 可接收 字符串，数组，buffer
const b3 = b2.toString();
```

#### Buffer 的实例方法

```js
let buffer = Buffer.alloc(6);
// fill: 使用数据填充buffer（循环填充，到满为止）
buffer.fill("123");
// write: 写数据
buffer.write("123");
// toString: 提取数据
buffer.toString();
// slice: 截取buffer
buffer.slice(3, 6);
// indexOf: 查找数据位置
buffer.indexOf("2");
// copy: 拷贝数据
const to = Buffer.alloc(6);
const from = Buffer.from("中国");
from.copy(to);
```

#### Buffer 的静态方法

```js
let b1 = Buffer.form("你");
let b2 = Buffer.form("好");
// concat: 拼接多个buffer
const b = Buffer.concat([b1, b2]);
// isBuffer: 是否为buffer
console.log(b.isBuffer());
```

### 自定义实现 Buffer 的 split 操作

```js
ArrayBuffer.prototype.split = function (sep) {
	let len = Buffer.form(sep).length;
	let ret = [];
	let start = 0;
	let offset = 0;

	while ((offset = this.indexOf(sep, start) !== -1)) {
		ret.push(this.slice(start, offset));
		start = offset + len;
	}
	set.push(this.slice(start));
	return set;
};

let buf = "我爱唱歌，爱跳舞，爱音乐，爱蹦跶爱";
let bufArr = buf.split("爱");

// ["我", "唱歌，", "跳舞，", "音乐，", "蹦跶", ""];
console.log(bufArr);
```
