---
title: CSS工程化
---

## CSS预处理器

- 预处理器如：less，sass，stylus

用来预编译sass或者less，增加了css代码的复用性，还有层级，mixin， 变量，循环， 函数等，对编写以及开发UI组件都极为方便。

- 后处理器 postCss

通常被视为在完成的样式表中根据css规范处理css，让其更加有效。目前最常做的是给css属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

css预处理器为css增加一些编程特性，无需考虑浏览器的兼容问题，我们可以在CSS中使用变量，简单的逻辑程序，函数等在编程语言中的一些基本的性能，可以让我们的css更加的简洁，增加适应性以及可读性，可维护性等。

- 使用原因：

1. 结构清晰， 便于扩展
2. 可以很方便的屏蔽浏览器私有语法的差异
3. 可以轻松实现多重继承
4. 完美的兼容了CSS代码，可以应用到老项目中

### 组合方案Less/Sass + PostCSS

Less/Sass + PostCSS 这种方案在目前主流的组件库和企业级项目中使用很广，如 ant-design 等

它们的主要作用如下：

- 为 CSS 添加了类似 JS 的特性，你也可以使用变量、mixin，写判断等
- 引入了模块化的概念，可以在一个 less 文件中导入另外一个 less 文件进行使用
- 兼容标准，可以快速使用 CSS 新特性，兼容浏览器 CSS 差异等
这类工具能够与主流的工程化工具一起使用，如 Webpack，提供对应的 loader 如 sass-loader，然后就可以在 React/Vue 项目中建 .scss 文件，写 sass 语法，并导入到 React 组件中生效。

- 不足

这类方案的一个主要问题就是，只是对 CSS 本身进行了增强，但是在帮助开发者如何写更好的 CSS、更高效、可维护的 CSS 方面并没有提供任何建议。

1. 你依然需要自己定义 CSS 类、id，并且思考如何去用这些类、id 进行组合去描述 HTML 的样式
2. 你依然可能会写很多冗余的 Less/Sass 代码，然后造成项目的负担，在可维护性方面也有巨大问题

- 优化

1. 可以引入 CSS 设计规范：BEM 规范，来辅助用户在整个网页的 HTML 骨架以及对应的类上进行设计
2. 可以引入 CSS Modules，将 CSS 文件进行 “作用域” 限制，确保在之后维护时，修改一个内容不会引起全局中其他样式的效果

## CSS-in-js

- styled-components

- emotion

### styled-components/emotion 的纯 CSS-in-JS 侧方案

使用 JS 的模板字符串函数，在 JS 里面写 CSS 代码，这带来了两个认知的改变：

不是在根据 HTML，然后去写 CSS，而是站在组件设计的角度，为组件写 CSS，然后应用组件的组合思想搭建大应用
自动提供类似 CSS Modules 的体验，不用担心样式的全局污染问题

同时带来了很多 JS 侧才有的各种功能特性，可以让开发者用开发 JS 的方式开发 CSS，如编辑器自动补全、Lint、编译压缩等。

- 案例

```js
const Button = styled.button`

  /* Adapt the colors based on primary prop */

  background: ${props => props.primary ? "palevioletred" : "white"};

  color: ${props => props.primary ? "white" : "palevioletred"};

  font-size: 1em;

  margin: 1em;

  padding: 0.25em 1em;

  border: 2px solid palevioletred;

  border-radius: 3px;
`;

render(

  <div>

    <Button>Normal</Button>

    <Button primary>Primary</Button>

  </div>

);
```

- 不足

虽然这类方案提供了在 JS 中写 CSS，充分利用 JS 的插值、组合等特性，然后应用 React 组件等组合思想，将组件与 CSS 进行细粒度绑定，让 CSS 跟随着组件一同进行组件化开发，同时提供和组件类似的模块化特性，相比 Less/Sass 这一套，可以复用 JS 社区的最佳实践等。
但是它仍然有一些不足：

1. 仍然是是对 CSS 增强，提供非常大的灵活性，开发者仍然需要考虑如何去组织自己的 CSS
2. 没有给出一套 “有观点” 的最佳实践做法
3. 在上层也缺乏基于 styled-components 进行复用的物料库可进行参考设计和使用，导致在初始化使用时开发速度较低
4. 在 JS 中写 CSS，势必带来一些本属于 JS 的限制，如 TS 下，需要对 Styled 的组件进行类型注释
5. 官方维护的内容只兼容 React 框架，Vue 和其他框架都由社区提供支持

整体来说不太符合团队协作使用，需要人为总结最佳实践和规范等。

- 优化

1. 寻求一套写 CSS 的最佳实践和团队协作规范
2. 能够拥有大量的物料库或辅助类等，提高开发效率，快速完成应用开发

### CSS Modules

CSS Modules 主要为 CSS 添加局部作用域和模块依赖，使得 CSS 也能具有组件化。

```js
import React from 'react';

import style from './App.css';
export default () => {

  return (

    <h1 className={style.title}>

      Hello World

    </h1>

  );

};
```

```css
.title {

  composes: className;

  color: red;

}
```

上述经过编译会变成如下 hash 字符串：

```css
<h1 class="_3zyde4l1yATCOkgn-DBWEL">

  Hello World

</h1>

._3zyde4l1yATCOkgn-DBWEL {

  color: red;

}
```

- [【工程化】深入浅出 CSS Modules](https://juejin.cn/post/6952665769209495566)

### styled-components


### Tailwind CSS

这是一个实用程序优先的 CSS 框架，它的使用方法和 10 年前的“原子类”用法类似：
你可以通过诸如 flex，pt-4，text-center 这样的命名，生成相应的 CSS 代码。
有人说，这是在开历史的倒车。

但是大人，时代变了。
在目前高度组件化、CSS IN JS 横行的年代，在 Tailwind CSS 的助力下，原子化 CSS 展现了它便捷、高度语义化、高度约束性的优势。
“老树发新枝”或许不太合适，可能我们只有由衷地感叹一句“原子CSS”迎来了适合它的时代。

## BEM 规范

B （Block）、E（Element）、M（Modifier），具体就是通过块、元素、行为来定义所有的可视化功能。

```css
/* Block */
.btn {}

/* 依赖于 Block 的 Element */
.btn__price {}

/* 修改 Block 风格的 Modifier */
.btn--orange {}

.btn--big {}

```

遵循上述规范的一个真实的 Button：

```css
<a class="btn btn--big btn--orange" href="#">

  <span class="btn__price">$3</span>

  <span class="btn__text">BIG BUTTON</span>

</a>
```

## 参考

- [2021 年你需要知道的 CSS 工程化技术](https://juejin.cn/post/7030790310590447630)

- [零基础理解 PostCSS 的主流程](https://mp.weixin.qq.com/s/pER1Wp398Zb-Mjw44UiMCQ)


