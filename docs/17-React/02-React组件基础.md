---
title: React组件-基础
---

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/02.React-Component.png)

在 React 的一切皆为组件的思想里，组件可以分为两类，一类是类（ Class ）组件，一类是函数（ Function ）组件. 为了秉承React 组合优于继承的设计理念，React团队推荐以函数组件+Hooks作为项目的主要的开发方式。

## class类组件

- 定义一个类组件

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

在 class 组件中，除了继承 React.Component,底层还加入了 updater 对象，组件中调用的 setState 和 forceUpdate 本质上是调用了 updater 对象上的 enqueueSetState 和 enqueueForceUpdate 方法。

- React 底层如何让定义类组件的

```js
//react/src/ReactBaseClasses.js
function Component(props, context, updater) {
  this.props = props;      //绑定props
  this.context = context;  //绑定context
  this.refs = emptyObject; //绑定ref
  this.updater = updater || ReactNoopUpdateQueue; //上面所属的updater 对象
}
/* 绑定setState 方法 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}
/* 绑定forceupdate 方法 */
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
}
```

### 类组件的生命周期

![](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/react/lifecycle.png)

> 一个查看 react 生命周期的[网站](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

React 16 之后有三个生命周期被废弃(但并未删除)

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

官方计划在 17 版本完全删除这三个函数，只保留 UNSAVE\_前缀的三个函数，目的是为了向下兼容，但是对于开发者而言应该尽量避免使用他们，而是使用新增的生命周期函数替代它们

类组件的生命周期主要有挂载、更新、卸载、错误处理四个阶段

- 挂载（当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下）

    - constructor: 构造函数，最先被执行,我们通常在构造函数里初始化 state 对象或者给自定义方法绑定 this

    - getDerivedStateFromProps: `static getDerivedStateFromProps(nextProps, prevState)`,这是个静态方法,当我们接收到新的属性想去修改我们 state，可以使用 getDerivedStateFromProps

    - UNSAVE_componentWillMount (已废弃) 过去用于网络请求或绑定函数，异步渲染机制下，该方法可能会被多次调用

    - render: render 函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的 DOM、React 组件、Fragment、Portals、字符串和数字、Boolean 和 null 等内容

    - componentDidMount: 组件装载之后调用，此时我们可以获取到 DOM 节点并操作，比如对 canvas，svg 的操作，服务器请求，订阅都可以写在这个里面，但是记得在 componentWillUnmount 中取消订阅

- 更新（当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下）

    - UNSAVE_componentWillReceiveProps（已废弃） 跟getDerivedStateFromProps一致

    - getDerivedStateFromProps: 此方法在更新个挂载阶段都可能会调用

    - shouldComponentUpdate: `shouldComponentUpdate(nextProps, nextState)`,有两个参数 nextProps 和 nextState，表示新的属性和变化之后的 state，返回一个布尔值，true 表示会触发重新渲染，false 表示不会触发重新渲染，默认返回 true,我们通常利用此生命周期来优化 React 程序性能

    - UNSAVE_componentWillUpdate（已废弃） 执行更新操作，异步渲染机制下，该方法可能会被暂停执行

    - render: 更新阶段也会触发此生命周期

    - getSnapshotBeforeUpdate: `getSnapshotBeforeUpdate(prevProps, prevState)`,这个方法在 render 之后，componentDidUpdate 之前调用，有两个参数 prevProps 和 prevState，表示之前的属性和之前的 state，这个函数有一个返回值，会作为第三个参数传给 componentDidUpdate，如果你不想要返回值，可以返回 null，此生命周期必须与 componentDidUpdate 搭配使用

    - componentDidUpdate: `componentDidUpdate(prevProps, prevState, snapshot)`,该方法在 getSnapshotBeforeUpdate 方法之后被调用，有三个参数 prevProps，prevState，snapshot，表示之前的 props，之前的 state，和 snapshot。第三个参数是 getSnapshotBeforeUpdate 返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

- 卸载（当组件从 DOM 中移除时会调用如下方法）

    - componentWillUnmount: 当我们的组件被卸载或者销毁了就会调用，我们可以在这个函数里去清除一些定时器，取消网络请求，清理无效的 DOM 元素等垃圾清理工作

- 错误处理 (当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法)

    - static getDerivedStateFromError()

    - componentDidCatch()

```js
//错误处理使用案例
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}

```





### 类组件的通信方式

- 父子（props+callback）
    - 父组件 -> 通过自身 state 改变，重新渲染，传递 props -> 通知子组件
    - 子组件 -> 通过调用父组件 props 方法 -> 通知父组件。
- 兄弟
    - context
    - 父子中转
    - EventEmitter
    - ref
- 爷孙
    - 父子透传
    - EventEmitter
    - context
    - ref
    - 状态管理工具(Redux/Mobx/Dva/Recoil)

### 类组件的State

## 函数组件

- 定义一个函数组件

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

### 函数组件的生命周期

- 忘掉 Class 组件的生命周期

基于 Class 的组件作为 React 诞生之处就存在的机制，它的用法早已深入人心，甚至至今 为止 React 的官方文档中仍然是以 Class 组件为基础的，而函数组件和 Hooks 则是作为 新特性做了补充说明和解释。

Class 组件和函数组件是两种实现 React 应用的方式，虽然它们是等价的，但是开发的思 想有很大不同。如果你是从 Class 组件转换到 Hooks 的方式，那么很重要的一点就是，你 要学会忘掉 Class 组件中的生命周期概念，千万不要将原来习惯的 Class 组件开发方式映 射到函数组。

比如如何在函数组件中实现 componentDidMount, componentDidUpdate 这样的 Class 组件才有的生命周期方法，你应该通过理解 Hooks 的方式去思考业务需求应该如何 实现。
为了理解函数组件的执行过程，我们不妨思考下 React 的本质:从 Model 到 View 的映 射。假设状态永远不变，那么实际上函数组件就相当于是一个模板引擎，只执行一次。但 是 React 本身正是为动态的状态变化而设计的，而可能引起状态变化的原因基本只有两 个:

1. 用户操作产生的事件，比如点击了某个按钮。
2. 副作用产生的事件，比如发起某个请求正确返回了。

这两种事件本身并不会导致组件的重新渲染，但我们在这两种事件处理函数中，一定是因 为改变了某个状态，这个状态可能是 State 或者 Context，从而导致了 UI 的重新渲染。
对于第一种情况，其实函数组件和 Class 组件的思路几乎完全一样:通过事件处理函数来 改变某个状态;对于第二种情况，在函数组件中是通过 useEffect 这个 Hook 更加直观和 语义化的方式来描述。对应到 Class 组件，则是通过手动判断 Props 或者 State 的变化来 执行的。

在函数组件中你要思考的方式永远是:当某个状态发生变化时，我要做什么， 而不再是在 Class 组件中的某个生命周期方法中我要做什么

所以如果你是从 Class 组件转型到函数组件，那么你要做的就是忘掉 Class 组件的生命周 期机制，去逐渐习惯函数组件的思考方式。相信这样你就能够体会到函数组件带来的直 观、简洁的好处了

- 构造函数

在类组件中有一个专门的方法叫 constructor，也就是构造函数，在里面我们会做一些初始 化的事情，比如设置 State 的初始状态，或者定义一些类的实例的成员。

而现在，函数组件只是一个函数，没有所谓的对象，或者说类的实例这样的概念，那自然
也就没有构造函数的说法了。

那么在函数组件中，我们应该如何去做一些初始化的事情呢?答案是:函数组件基本上没 有统一的初始化需要，因为 Hooks 自己会负责自己的初始化。比如 useState 这个 Hook，接收的参数就是定义的 State 初始值。而在过去的类组件中，你通常需要在构造函 数中直接设置 this.state ，也就是设置某个值来完成初始化。

- 三种常用的生命周期方法

在类组件中，componentDidMount，componentWillUnmount，和 componentDidUpdate 这三个生命周期方法可以说是日常开发最常用的。业务逻辑通常 要分散到不同的生命周期方法中，比如说在上面的 Blog 文章的例子中，你需要同时在 componentDidMount 和 componentDidUpdate 中去获取数据。
而在函数组件中，这几个生命周期方法可以统一到 useEffect 这个 Hook，正如 useEffect 的字面含义，它的作用就是触发一个副作用，即在组件每次 render 之后去执行。

```js

useEffect(() => {
// componentDidMount + componentDidUpdate
console.log('这里基本等价于 componentDidMount + componentDidUpdate'); 
return () => {
// componentWillUnmount
console.log('这里基本等价于 componentWillUnmount');
 }
}, [deps])

```

但是 Class 组件中还有其它一些比较少用的方法，比如 getSnapshotBeforeUpdate, componentDidCatch, getDerivedStateFromError。比较遗憾的是目前 Hooks 还没法实 现这些功能。因此如果必须用到，你的组件仍然需要用类组件去实现。

### 函数组件的useState



## 掌握props





## 问答环节

::: warning 问
React 中类组件和函数组件有什么异同?
:::

::: tip 答
React官方团队认为React 设计初衷就是关注点分离，React 团队认为引入模板是一种不佳的实现。因为模板分离了技术栈，而非关注点的模板同时又引入了更多的概念。比如新的模板语法、模板指令等，以 AngularJS 为例引入了太多概念。所以 React 最后选用了 JSX，因为 JSX 与其设计思想贴合，不需要引入过多新的概念，对编辑器的代码提示也极为友好，更加简洁和灵活，降低上手成本
:::

::: warning 问
React 的请求应该放在哪个生命周期中?
:::

::: tip 答
React 的异步请求到底应该放在哪个生命周期里,有人认为在`componentWillMount`中可以提前进行异步请求,避免白屏,其实这个观点是有问题的.

由于 JavaScript 中异步事件的性质，当您启动 API 调用时，浏览器会在此期间返回执行其他工作。当 React 渲染一个组件时，它不会等待 componentWillMount 它完成任何事情 - React 继续前进并继续 render,没有办法“暂停”渲染以等待数据到达。

而且在`componentWillMount`请求会有一系列潜在的问题,首先,在服务器渲染时,如果在 componentWillMount 里获取数据，fetch data 会执行两次，一次在服务端一次在客户端，这造成了多余的请求,其次,在 React 16 进行 React Fiber 重写后,`componentWillMount`可能在一次渲染中多次调用.

目前官方推荐的异步请求是在`componentDidmount`中进行.

如果有特殊需求需要提前请求,也可以在特殊情况下在`constructor`中请求:[](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f)

> react 17 之后`componentWillMount`会被废弃,仅仅保留`UNSAFE_componentWillMount`
:::

::: warning 问
为什么要用 getDerivedStateFromProps 不是 componentWillMount 的替代品？
:::

::: tip 答
先给出答案: 有时表现出异步,有时表现出同步


:::

::: warning 问
为什么要用 getDerivedStateFromProps 代替 componentWillReceiveProps?
:::

::: tip 答
先给出答案: 有时表现出异步,有时表现出同步


:::

::: warning 问
setState 到底是异步还是同步?
:::

::: tip 答
先给出答案: 有时表现出异步,有时表现出同步

1. **`setState`只在合成事件和钩子函数中是“异步”的，在原生事件和`setTimeout`中都是同步的。**
2. **`setState`的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数  `setState(partialState, callback)`  中的`callback`拿到更新后的结果。**
3. **`setState`  的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次`setState`，`setState`的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时`setState`多个不同的值，在更新时会对其进行合并批量更新。**
:::





