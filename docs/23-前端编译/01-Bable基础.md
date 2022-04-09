---
title: Babel基础
---

## babel 的由来

babel 最开始叫 6to5，顾名思义是 es6 转 es5，但是后来随着 es 标准的演进，有了 es7、es8 等， 6to5 的名字已经不合适了，所以改名为了 babel。

babel 是巴别塔的意思，来自圣经中的典故：

>当时人类联合起来兴建希望能通往天堂的高塔，为了阻止人类的计划，上帝让人类说不同的语言，使人类相互之间不能沟通，计划因此失败，人类自此各散东西。此事件，为世上出现不同语言和种族提供解释。这座塔就是巴别塔。

这很符合 babel 的转译器的定位。

## babel 的用途

我们平时主要用 babel 来做 3 种事情：

- 转译 esnext、typescript、flow 等到目标环境支持的 js

这个是最常用的功能，用来把代码中的 esnext 的新的语法、typescript 和 flow 的语法转成基于目标环境支持的语法的实现。并且还可以把目标环境不支持的 api 进行 polyfill。

babel7 支持了 preset-env，可以指定 targets 来进行按需转换，转换更加的精准，产物更小。

- 一些特定用途的代码转换

babel 是一个转译器，暴露了很多 api，用这些 api 可以完成代码到 AST 的 parse，AST 的转换，以及目标代码的生成。

开发者可以用它来来完成一些特定用途的转换，比如函数插桩（函数中自动插入一些代码，例如埋点代码）、自动国际化、default import 转 named import 等。这些都是后面的实战案例。

现在比较流行的小程序转译工具 taro，就是基于 babel 的 api 来实现的。

- 代码的静态分析

对代码进行 parse 之后，能够进行转换，是因为通过 AST 的结构能够理解代码。理解了代码之后，除了进行转换然后生成目标代码之外，也同样可以用于分析代码的信息，进行一些检查。

- linter 工具就是分析 AST 的结构，对代码规范进行检查。

- api 文档自动生成工具，可以提取源码中的注释，然后生成文档。

- type checker 会根据从 AST 中提取的或者推导的类型信息，对 AST 进行类型是否一致的检查，从而减少运行时因类型导致的错误。

- 压缩混淆工具，这个也是分析代码结构，进行删除死代码、变量名混淆、常量折叠等各种编译优化，生成体积更小、性能更优的代码。

- js 解释器，除了对 AST 进行各种信息的提取和检查以外，我们还可以直接解释执行 AST。

## Babel 编译流程

babel 是 source to source 的转换，整体编译流程分为三步：

- parse：通过 parser 把源码转成抽象语法树（AST）

- transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改


- generate：把转换后的 AST 打印成目标代码，并生成 sourcemap


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee9eaa1f265c4c49ad156f2c691748d9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/2/16d8d0cd559c7e1e~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 为什么会分为这三步

源码是一串按照语法格式来组织的字符串，人能够认识，但是计算机并不认识，想让计算机认识就要转成一种数据结构，通过不同的对象来保存不同的数据，并且按照依赖关系组织起来，这种数据结构就是抽象语法树（abstract syntax tree）。之所以叫抽象语法树是因为数据结构中省略掉了一些无具体意义的分隔符比如 ; { } 等。有了 AST，计算机就能理解源码字符串的意思，而理解是能够转换的前提，所以编译的第一步需要把源码 parse 成 AST。

转成 AST 之后就可以通过修改 AST 的方式来修改代码，这一步会遍历 AST 并进行各种增删改，这一步也是 babel 最核心的部分。

经过转换以后的 AST 就是符合要求的代码，就可以再转回字符串，转回字符串的过程中把之前删掉的一些分隔符再加回来。

- 简单总结一下就是：
为了让计算机理解代码需要先对源码字符串进行 parse，生成 AST，把对代码的修改转为对 AST 的增删改，转换完 AST 之后再打印成目标代码字符串。

### 步骤一：parse

parse 阶段的目的是把源码字符串转换成机器能够理解的 AST，这个过程分为词法分析、语法分析。

比如 let name = 'guang'; 这样一段源码，我们要先把它分成一个个不能细分的单词（token），也就是 let, name, =, 'guang'，这个过程是词法分析，按照单词的构成规则来拆分字符串成单词。

之后要把 token 进行递归的组装，生成 AST，这个过程是语法分析，按照不同的语法结构，来把一组单词组合成对象。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03bdbe8096944a0fa09c86ac2ff09e56~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)


### 步骤二：transform

transform 阶段是对 parse 生成的 AST 的处理，会进行 AST 的遍历，遍历的过程中处理到不同的 AST 节点会调用注册的相应的 visitor 函数，visitor 函数里可以对 AST 节点进行增删改，返回新的 AST（可以指定是否继续遍历新生成的 AST）。这样遍历完一遍 AST 之后就完成了对代码的修改。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/494b0bc006f64c71a92947f560e97e8c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)


### 步骤三：generate

generate 阶段会把 AST 打印成目标代码字符串，并且会生成 sourcemap。不同的 AST 对应的不同结构的字符串。比如 IfStatement 就可以打印成 if(test) {} 格式的代码。这样从 AST 根节点进行递归打印，就可以生成目标代码的字符串。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84530b477a7540ee87e5bb12e9375569~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

sourcemap 记录了源码到目标代码的转换关系，通过它我们可以找到目标代码中每一个节点对应的源码位置。

## Babel工具集

babel 7 把这些功能的实现放到了不同的包里面：

- @babel/parser 解析源码成 AST，对应 parse 阶段
- @babel/traverse 遍历 AST 并调用 visitor 函数，对应 transform 阶段
@babel/generate 打印 AST，生成目标代码和 sorucemap，对应 generate 阶段
其中，遍历过程中需要创建 AST，会用到：

- @babel/types 创建、判断 AST
- @babel/template 根据模块批量创建 AST
上面是每一个阶段的功能， babel 整体功能的入口是在：

- @babel/core 解析配置、应用 plugin、preset，整体整体编译流程
插件和插件之间有一些公共函数，这些都是在：

- @babel/helpers 用于转换 es next 代码需要的通过模板创建的 AST，比如 _typeof、_defineProperties 等

- @babel/helper-xxx 其他的插件之间共享的用于操作 AST 的公共函数
当然，除了编译期转换的时候会有公共函数以外，运行时也有，这部分是放在：

- @babel/runtime 主要是包含 corejs、helpers、regenerator 这 3 部分：
    - helper： helper 函数的运行时版本（不是通过 AST 注入了，而是运行时引入代码）
    - corejs： es next 的 api 的实现，corejs 2 只支持静态方法，corejs 3 还支持实例方法
    - regenerator：async await 的实现，由 facebook 维护
（babel 做语法转换是自己实现的 helper，但是做 polyfill 都不是自己实现的，而是借助了第三方的 corejs、regenerator）

- @babel/cli babel 的命令行工具，支持通过 glob 字符串来编译多个文件

- @babel/preset-env 这里可以理解为一个preset就是一组插件的集合.

如果想要转换ES6+的其它代码为ES5, 我们可以使用"preset"来代替预先设定的一组插件, 而不是逐一添加我们想要的所有插件

## Babel常用插件

Babel 在现代的前端开发中扮演着一个很重要的角色，越来越多的框架或库会创建自己的 Babel 插件，它们会在编译阶段做一些优化，来提高用户体验、开发体验以及运行时的性能

- babel-plugin-lodash 将lodash导入转换为按需导入
- babel-plugin-import 上篇文章提过的这个插件，也是实现按需导入
- babel-react-optimize 静态分析React代码，利用一定的措施优化运行效率。比如将静态的props或组件抽离为常量
- root-import 将基于根目录的导入路径重写为相对路径
- styled-components 典型的CSS-in-js方案，利用Babel 插件来支持服务端渲染、预编译模板、样式压缩、清除死代码、提升调试体验。
- preval 在编译时预执行代码
- babel-plugin-graphql-tag 预编译GraphQL查询

## 推荐阅读

- [一文彻底读懂Babel](https://juejin.cn/post/6901649054225465352#heading-4)

- [由 Babel 理解前端编译原理](https://juejin.cn/post/7080832945136599077)

- [深入浅出 Babel 上篇：架构和原理 + 实战](https://juejin.cn/post/6844903956905197576)

- [读完这篇你还不懂Babel我给你寄口罩](https://juejin.cn/post/6844904065223098381)
