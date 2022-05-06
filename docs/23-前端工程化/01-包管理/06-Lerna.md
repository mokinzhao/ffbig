---
title: Lerna
---

## 基础概念

### lerna是什么

Lerna是一个用来优化托管在 git\npm 上的多 package 代码库的工作流的一个管理工具,可以让你在主项目下管理多个子项目，从而解决了多个包互相依赖，且发布时需要手动维护多个包的问题。

- 关键词：多仓库管理，多包管理，自动管理包依赖

### lerna 优势

- 资源浪费

通常情况下，一个公司的业务项目只有一个主干，多 git repo 的方式，这样 node_module 会出现大量的冗余，比如它们可能都会安装 React、React-dom 等包，浪费了大量存储空间。

- 调试繁琐

很多公共的包通过 npm 安装，想要调试依赖的包时，需要通过 npm link 的方式进行调试。

- 资源包升级问题

一个项目依赖了多个 npm 包，当某一个子 npm 包代码修改升级时，都要对主干项目包进行升级修改。(这个问题感觉是最烦的，可能一个版本号就要去更新一下代码并发布)

## 原理浅析

- monorepo 和 multrepo 对比

monorepo：是将所有的模块统一的放在一个主干分支之中管理。multrepo：将项目分化为多个模块，并针对每一个模块单独的开辟一个 reporsitory来进行管理。

### lerna 软链实现(如何动态创建软链)

未使用 lerna 之前，想要调试一个本地的 npm 模块包，需要使用 npm link 来进行调试，但是在 lerna 中可以直接进行模块的引入和调试，这种动态创建软链是如何实现的？

- 软链是什么？

lerna  中也是通过这种方式来实现软链的，Node.js 中如何实现软链方式: fs.symlinkSync(target,path,type)

```js
fs.symlinkSync(target,path,type)
target <string> | <Buffer> | <URL>   // 目标文件
path <string> | <Buffer> | <URL>  // 创建软链对应的地址
type <string>
```

它会创建名为 path 的链接，该链接指向 target。type 参数仅在 Windows 上可用，在其他平台上则会被忽略。它可以被设置为 'dir'、 'file' 或 'junction'。如果未设置 type 参数，则 Node.js 将会自动检测 target 的类型并使用 'file' 或 'dir'。如果 target 不存在，则将会使用 'file'。Windows 上的连接点要求目标路径是绝对路径。当使用 'junction' 时， target 参数将会自动地标准化为绝对路径。

- 基本使用

```js
const res = fs.symlinkSync('./target/a.js','./b.js');
```

这段代码的意思是为  创建一个软链接 b.js 指向了文件 ./targert/a.js,当 a.js 中的内容发生变化时，b.js 文件也会发生相同的改变。

在 Node.js 文档中，fs.symlinkSync()lerna 的源码中动态链接也是通过 symlinkSync 来实现的。源码对应地址：软链实现源码地址参考

```js
function createSymbolicLink(src, dest, type) {
  log.silly("createSymbolicLink", [src, dest, type]);

  return fs
    .lstat(dest)
    .then(() => fs.unlink(dest))
    .catch(() => {
      /* nothing exists at destination */
    })
    .then(() => fs.symlink(src, dest, type));
}
```

## 基本使用

### 初始化一个lerna 项目

- lerna 在使用之前需要全局安装 lerna 工具。

```sh
npm install lerna -g
```

mkdir lerna-demo,在当前目录下创建文件夹lerna-demo,然后使用命令 lerna init执行成功后，目录下将会生成这样的目录结构。，一个 hello world级别的 lerna 项目就完成了。

```js
 - packages(目录)
 - lerna.json(配置文件)
 - package.json(工程描述文件)
```

### lerna 常用命令

1. 初始化 lerna 项目

```sh
lerna init 
```

2. 创建一个新的由 lerna 管理的包。

```sh
lerna create <name>
```

3. 安装所有·依赖项并连接所有的交叉依赖

```sh
lerna bootstrap
```

4. 增加模块包到最外层的公共 node_modules中

```sh
lerna add axios
```

5. 增加模块包到 packages 中指定项目 下面是将 ui-web 模块增加到 example-web 项目中

```sh
lerna add ui-web --scope=example-web
```

6. 在 packages 中对应包下的执行任意命令 下面的命令，是对 packages 下的 example-web 项目执行 yarn start 命令 ，比较常用，可以把它配置到最外层的 package.json 中。

```sh
lerna exec --scope example-web -- yarn start
```

如果命令中不增加 --scope example-web直接使用下面的命令，这会在 packages 下所有包执行命令rm -rf ./node_modules

```sh
lerna exec -- rm -rf ./node_modules
```

7. 显示所有的安装的包

```sh
lerna list // 等同于 lerna ls
```

这里再提一个命令也比较常用,可以通过json的方式查看 lerna 安装了哪些包,json 中还包括包的路径，有时候可以用于查找包是否生效。

```sh
lerna list --json
```

8. 从所有包中删除 node_modules 目录

```sh
lerna clean
```

>注意下 lerna clean 不会删除项目最外层的根 node_modules

9. 在当前项目中发布包

```sh
lerna publish
```

这个命令可以结合 lerna.json 中的  "version": "independent" 配置一起使用，可以完成统一发布版本号和packages 下每个模版发布的效果，具体会在下面的实战讲解。

>lerna publish 永远不会发布标记为 private 的包（package.json中的”private“: true）

以上命令基本够日常开发使用了，如果需要更详细内命令内容，可以查看下面的详细文档 lerna 命令详细文档参考

## 推荐阅读

[Lerna 运行流程剖析](https://mp.weixin.qq.com/s/qYK-4WABULffy5tRV9T46A)

[前端工程化-基于 Monorepo 的 lerna 模块(从原理到实战)](https://mp.weixin.qq.com/s/OsYX3hB8XeJC-8oHHoASzg)


