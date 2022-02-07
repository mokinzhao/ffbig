---
title: React基础-JSX
---

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/01.React-JSX.png)

## 概念

- JSX 是对 javaScript 的一种语法扩展,有简洁、易懂等特性

- JSX 更像是一种语法糖，通过类似 XML 的描述方式

- JSX 通过 babel 编译成 React.createElement(),React.createElement()将返回一个叫作"React Element"的 js 对象.

## 选用 JSX 语法的动机

### 设计初衷

谈论其他方案之前，就需要谈到 React 的设计初衷，也是计算机科学里面一个非常重要的概念，叫作关注点分离（Separation of concerns）

关注点分离在计算机科学中，是将代码分隔为不同部分的设计原则，是面向对象的程序设计的核心概念。其中每一部分会有各自的关注焦点。

关注点分离的价值在于简化程序的开发和维护。当关注点分开时，各部分可以重复使用，以及独立开发和更新。具有特殊价值的是能够稍后改进或修改一段代码，而无须知道其他部分的细节必须对这些部分进行相应的更改。

在 React 中，关注点的基本单位是组件。在接触一段时间 React 开发后，你会发现 React 单个组件是高内聚的，组件之间耦合度很低。

- 那模板不能做到吗？

React 团队认为引入模板是一种不佳的实现。 因为模板分离了技术栈，而非关注点的模板同时又引入了更多的概念。比如新的模板语法、模板指令等，以 AngularJS 为例，我们可以看一下有多少新概念的引入

```html
<!doctype html>

<html ng-app="docsBindExample">

  <head>

    <script src="http://code.angularjs.org/1.2.25/angular.min.js"></script>

    <script src="script.js"></script>

  </head>

  <body>

    <div ng-controller="Ctrl1">

      Hello <input ng-model='name'> <hr/>

      <span ng-bind="name"></span> <br/>

      <span ng:bind="name"></span> <br/>

      <span ng_bind="name"></span> <br/>

      <span data-ng-bind="name"></span> <br/>

      <span x-ng-bind="name"></span> <br/>

    </div>

  </body>

</html>

angular.module('docsBindExample', [])

  .controller('Ctrl1', function Ctrl1($scope) {

    $scope.name = 'Max Karl Ernst Ludwig Planck (April 23, 1858 –  October 4, 1947)';

  });

```

JSX 主要用于声明 React 元素，但 React 中并不强制使用 JSX。即使使用了 JSX，也会在构建过程中，通过 Babel 插件编译为 React.createElement。所以 JSX 更像是 React.createElement 的一种语法糖。

### JSX 以外的三种技术方案进行对比

- 首先是模板，React 团队认为模板不应该是开发过程中的关注点，因为引入了模板语法、模板指令等概念，是一种不佳的实现方案。

- 其次是模板字符串，模板字符串编写的结构会造成多次内部嵌套，使整个结构变得复杂，并且优化代码提示也会变得困难重重。

- 最后是 JXON，同样因为代码提示困难的原因而被放弃。

所以 React 最后选用了 JSX，因为 JSX 与其设计思想贴合，不需要引入过多新的概念，对编辑器的代码提示也极为友好。

## JSX 是如何映射为 DOM 的

- JSX 通过 babel 编译成 React.createElement(),React.createElement()将返回一个叫作"React Element"的 js 对象.

### React.createElement函数

```js
/**
 React的创建元素方法
 */

export function createElement(type, config, children) {

  // propName 变量用于储存后面需要用到的元素属性
  let propName; 
  // props 变量用于储存元素属性的键值对集合
  const props = {}; 
  // key、ref、self、source 均为 React 元素的属性，此处不必深究
  let key = null;
  let ref = null; 
  let self = null; 
  let source = null; 

  // config 对象中存储的是元素的属性
  if (config != null) { 
    // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 此处将 key 值字符串化
    if (hasValidKey(config)) {
      key = '' + config.key; 
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName) 
      ) {
        props[propName] = config[propName]; 
      }
    }
  }

  // childrenLength 指的是当前元素的子元素的个数，减去的 2 是 type 和 config 两个参数占用的长度
  const childrenLength = arguments.length - 2;
  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点出现了
  if (childrenLength === 1) { 
    // 直接把这个参数的值赋给props.children
    props.children = children; 
    // 处理嵌套多个子元素的情况
  } else if (childrenLength > 1) { 
    // 声明一个子元素数组
    const childArray = Array(childrenLength); 
    // 把子元素推进数组里
    for (let i = 0; i < childrenLength; i++) { 
      childArray[i] = arguments[i + 2];
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray; 

  } 
  // 处理 defaultProps
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) { 
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );

}

```

- createElement 有三个入参

    - type：用于标识节点的类型。它可以是类似“h1”“div”这样的标准 HTML 标签字符串，也可以是 React 组件类型或 React fragment 类型。

    - config：以对象形式传入，组件所有的属性都会以键值对的形式存储在 config 对象中。

    - children：以对象形式传入，它记录的是组件标签之间嵌套的内容，也就是所谓的“子节点”“子元素”。

```js

React.createElement("ul", {
  // 传入属性键值对
  className: "list"
   // 从第三个入参开始往后，传入的参数都是 children
}, React.createElement("li", {
  key: "1"
}, "1"), React.createElement("li", {
  key: "2"
}, "2"));
```

- 转化为DOM结构

```js
<ul className="list">
  <li key="1">1</li>
  <li key="2">2</li>
</ul>
```

### ReactElement对象

```js
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创造该元素的组件
    _owner: owner,
  };
  if (__DEV__) {
    // 这里是一些针对 __DEV__ 环境下的处理，对于大家理解主要逻辑意义不大，此处我直接省略掉，以免混淆视听
  }
  return element;
};
```

ReactElement 的代码出乎意料的简短，从逻辑上我们可以看出，ReactElement 其实只做了一件事情，那就是“创建”，说得更精确一点，是“组装”：ReactElement 把传入的参数按照一定的规范，“组装”进了 element 对象里，并把它返回给了 React.createElement，最终 React.createElement 又把它交回到了开发者手中

需要特别注意 2 个属性:

1. key属性在reconciler阶段会用到, 目前只需要知道所有的ReactElement对象都有 key 属性(且其默认值是 null, 这点十分重要, 在 diff 算法中会使用到).

2. type属性决定了节点的种类:

    - 它的值可以是字符串(代表div,span等 dom 节点), 函数(代表fuction, class等节点), 或者 react 内部定义的节点类型(portal,context,fragment等)
    - 在reconciler阶段, 会根据 type 执行不同的逻辑(在 fiber 构建阶段详细解读).
        - 如 type 是一个字符串类型, 则直接使用.
        - 如 type 是一个ReactComponent类型, 则会调用其 render 方法获取子节点.
        - 如 type 是一个function类型,则会调用该方法获取子节点

在v17.0.2中, 定义了 20 种内部节点类型. 根据运行时环境不同, 分别采用 16 进制的字面量和Symbol进行表示.

这个 ReactElement 对象实例，本质上是以 JavaScript 对象形式存在的对 DOM 的描述，也就是老生常谈的“虚拟 DOM”（准确地说，是虚拟 DOM 中的一个节点)

那就意味着和渲染到页面上的真实 DOM 之间还有一些距离，这个“距离”，就是由大家喜闻乐见的ReactDOM.render方法来填补的

### React Component

对于ReactElement来讲, ReactComponent仅仅是诸多type类型中的一种.

对于开发者来讲, ReactComponent使用非常高频(在状态组件章节中详细解读), 在本节只是先证明它只是一种特殊的ReactElement.

```js
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <header>header</header>
        <Content />
        <footer>footer</footer>
      </div>
    );
  }
}

class Content extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </React.Fragment>
    );
  }
}

export default App;

```

编译之后的代码(此处只编译了 jsx 语法, 并没有将 class 语法编译成 es5 中的 fuction), 可以更直观的看出调用逻辑.

createElement函数的第一个参数将作为创建ReactElement的type. 可以看到Content这个变量被编译器命名为App_Content, 并作为第一个参数(引用传递), 传入了createElement.

```js
class App_App extends react_default.a.Component {
  render() {
    return /*#__PURE__*/ react_default.a.createElement(
      'div',
      {
        className: 'app',
      } /*#__PURE__*/,
      react_default.a.createElement('header', null, 'header') /*#__PURE__*/,

      // 此处直接将Content传入, 是一个指针传递
      react_default.a.createElement(App_Content, null) /*#__PURE__*/,
      react_default.a.createElement('footer', null, 'footer'),
    );
  }
}
class App_Content extends react_default.a.Component {
  render() {
    return /*#__PURE__*/ react_default.a.createElement(
      react_default.a.Fragment,
      null /*#__PURE__*/,
      react_default.a.createElement('p', null, '1'),
      /*#__PURE__*/

      react_default.a.createElement('p', null, '2'),
      /*#__PURE__*/

      react_default.a.createElement('p', null, '3'),
    );
  }
}
```

上述示例演示了ReactComponent是诸多ReactElement种类中的一种情况, 但是由于ReactComponent是 class 类型, 自有它的特殊性(可对照源码, 更容易理解).

1. ReactComponent是 class 类型, 继承父类Component, 拥有特殊的方法(setState,forceUpdate)和特殊的属性(context,updater等).

2. 在reconciler阶段, 会依据ReactElement对象的特征, 生成对应的 fiber 节点. 当识别到ReactElement对象是 class 类型的时候, 会触发ReactComponent对象的生命周期, 并调用其 render方法, 生成ReactElement子节点.

### JSX与Fiber节点

从上面的内容我们可以发现，JSX是一种描述当前组件内容的数据结构，他不包含组件schedule、reconcile、render所需的相关信息。

比如如下信息就不包括在JSX中：

- 组件在更新中的优先级
- 组件的state
- 组件被打上的用于Renderer的标记
这些内容都包含在Fiber节点中。

所以，在组件mount时，Reconciler根据JSX描述的组件内容生成组件对应的Fiber节点。

在update时，Reconciler将JSX与Fiber节点保存的数据对比，生成组件对应的Fiber节点并根据对比结果为Fiber节点打上标记。

React 针对不同 React element 对象会产生不同 tag (种类) 的fiber 对象。首先，来看一下 tag 与 element 的对应关系：

```js
export const FunctionComponent = 0;       // 函数组件
export const ClassComponent = 1;          // 类组件
export const IndeterminateComponent = 2;  // 初始化的时候不知道是函数组件还是类组件 
export const HostRoot = 3;                // Root Fiber 可以理解为根元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4;              // 对应  ReactDOM.createPortal 产生的 Portal 
export const HostComponent = 5;           // dom 元素 比如 <div>
export const HostText = 6;                // 文本节点
export const Fragment = 7;                // 对应 <React.Fragment> 
export const Mode = 8;                    // 对应 <React.StrictMode>   
export const ContextConsumer = 9;         // 对应 <Context.Consumer>
export const ContextProvider = 10;        // 对应 <Context.Provider>
export const ForwardRef = 11;             // 对应 React.ForwardRef
export const Profiler = 12;               // 对应 <Profiler/ >
export const SuspenseComponent = 13;      // 对应 <Suspense>
export const MemoComponent = 14;          // 对应 React.memo 返回的组件
```

- fiber 对应关系
    - child： 一个由父级 fiber 指向子级 fiber 的指针。
    - return：一个子级 fiber 指向父级 fiber 的指针。
    - sibiling: 一个 fiber 指向下一个兄弟 fiber 的指针。

- 温馨提示：
    - 对于上述在 jsx 中写的 map 数组结构的子节点，外层会被加上 fragment ；
    - map 返回数组结构，作为 fragment 的子节点。

![JSX与Fiber节点](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/873f00b1255d4f5f8dac4954cf37dc9f~tplv-k3u1fbpfcp-watermark.awebp)

### ReactDOM.render

在每一个 React 项目的入口文件中，都少不了对 React.render 函数的调用。下面我简单介绍下 ReactDOM.render 方法的入参规则：

```js
ReactDOM.render(
    // 需要渲染的元素（ReactElement）
    element, 
    // 元素挂载的目标容器（一个真实DOM）
    container,
    // 回调函数，可选参数，可以用来处理渲染结束后的逻辑
    [callback]
)
```

ReactDOM.render 方法可以接收 3 个参数，其中第二个参数就是一个真实的 DOM 节点，这个真实的 DOM 节点充当“容器”的角色，React 元素最终会被渲染到这个“容器”里面去。比如，示例中的 App 组件，它对应的 render 调用是这样的:

```js
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

注意，这个真实 DOM 一定是确实存在的。比如，在 App 组件对应的 index.html 中，已经提前预置 了 id 为 root 的根节点：

```js
<body>
    <div id="root"></div>
</body>
```

## 问答环节

::: warning 问
React为何选用JSX呢,为何不是其他模版语言?
:::

::: tip 答
React官方团队认为React 设计初衷就是关注点分离，React 团队认为引入模板是一种不佳的实现。因为模板分离了技术栈，而非关注点的模板同时又引入了更多的概念。比如新的模板语法、模板指令等，以 AngularJS 为例引入了太多概念。所以 React 最后选用了 JSX，因为 JSX 与其设计思想贴合，不需要引入过多新的概念，对编辑器的代码提示也极为友好，更加简洁和灵活，降低上手成本
:::

::: warning 问
Babel 插件如何实现 JSX 到 JS 的编译?
:::

::: tip 答
Babel 读取代码并解析，生成 AST，再将 AST 传入插件层进行转换，在转换时就可以将 JSX 的结构转换为 React.createElement 的函数
:::

::: warning 问
老版本的 React 中，为什么写 jsx 的文件要默认引入 React?
:::

::: tip 答
因为 React 17版本以前 jsx 在被 babel 编译后，写的 jsx 会变成上述 React.createElement 形式，所以需要引入 React,防止找不到 React 引起报错.在React17中，已经不需要显式导入React了。详见介绍[全新的 JSX 转换](https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
:::

::: warning 问
React.createElement 和 React.cloneElement 到底有什么区别呢?
:::

::: tip 答
可以理解为，一个是用来创建 element.另一个是用来修改 element，并返回一个新的 React.element 对象
:::

## 参考资料

- 深入浅出搞定React

- React技术揭秘

- 图解React

- React进阶实践指南
