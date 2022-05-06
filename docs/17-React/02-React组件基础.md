---
title: React基础-组件应用
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

React 项目中 UI 的改变来源于 state 改变，类组件中 setState 是更新组件，渲染视图的主要方式。

#### 基本用法

```js
setState(obj,callback)

/* 第一个参数为function类型 */
this.setState((state,props)=>{
    return { number:1 } 
})
/* 第一个参数为object类型 */
this.setState({ number:1 },()=>{
    console.log(this.state.number) //获取最新的number
})

```

- 第一个参数：当 obj 为一个对象，则为即将合并的 state ；如果 obj 是一个函数，那么当前组件的 state 和 props 将作为参数，返回值用于合并新的 state。

- 第二个参数 callback ：callback 为一个函数，函数执行上下文中可以获取当前 setState 更新后的最新 state 的值，可以作为依赖 state 变化的副作用函数，可以用来做一些基于 DOM 的操作。

#### 在 React 底层主要做了那些事

- 首先，setState 会产生当前更新的优先级（老版本用 expirationTime ，新版本用 lane ）。
- 接下来 React 会从 fiber Root 根部 fiber 向下调和子节点，调和阶段将对比发生更新的地方，更新对比 expirationTime ，找到发生更新的组件，合并 state，然后触发 render 函数，得到新的 UI 视图层，完成 render 阶段。
- 接下来到 commit 阶段，commit 阶段，替换真实 DOM ，完成此次更新流程。
- 此时仍然在 commit 阶段，会执行 setState 中 callback 函数,如上的()=>{ console.log(this.state.number) }，到此为止完成了一次 setState 全过程。

### 类组件如何限制 state 更新视图

1. pureComponent 可以对 state 和 props 进行浅比较，如果没有发生变化，那么组件不更新。
2. shouldComponentUpdate 生命周期可以通过判断前后 state 变化来决定组件需不需要更新，需要更新返回true，否则返回false。

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

React-hooks 正式发布以后， useState 可以使函数组件像类组件一样拥有 state，也就说明函数组件可以通过 useState 改变 UI 视图。那么 useState 到底应该如何使用，底层又是怎么运作的呢，首先一起看一下 useState

- useState用法

```js
 [ ①state , ②dispatch ] = useState(③initData)

```

- ① state，目的提供给 UI ，作为渲染视图的数据源。
- ② dispatch 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。
- ③ initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。

- initData 为非函数的情况:

```js
/* 此时将把 0 作为初使值 */
const [ number , setNumber ] = React.useState(0)
```

- initData 为函数的情况:

```js
 const [ number , setNumber ] = React.useState(()=>{
       /*  props 中 a = 1 state 为 0-1 随机数 ， a = 2 state 为 1 -10随机数 ， 否则，state 为 1 - 100 随机数   */
       if(props.a === 1) return Math.random() 
       if(props.a === 2) return Math.ceil(Math.random() * 10 )
       return Math.ceil(Math.random() * 100 ) 
    })
```

- 对于 dispatch的参数,也有两种情况：

1. 第一种非函数情况，此时将作为新的值，赋予给 state，作为下一次渲染使用;

2. 第二种是函数的情况，如果 dispatch 的参数为一个函数，这里可以称它为reducer，reducer 参数，是上一次返回最新的 state，返回值作为新的 state。

## 掌握props

首先应该明确一下什么是 props ，对于在 React 应用中写的子组件，无论是函数组件 FunComponent ，还是类组件 ClassComponent ，父组件绑定在它们标签里的属性/方法，最终会变成 props 传递给它们。但是这也不是绝对的，对于一些特殊的属性，比如说 ref 或者 key ，React 会在底层做一些额外的处理。首先来看一下 React 中 props 可以是些什么东西？

```js
/* children 组件 */
function ChidrenComponent(){
    return <div> In this chapter, let's learn about react props ! </div>
}
/* props 接受处理 */
class PropsComponent extends React.Component{
    componentDidMount(){
        console.log(this,'_this')
    }
    render(){
        const {  children , mes , renderName , say ,Component } = this.props
        const renderFunction = children[0]
        const renderComponent = children[1]
        /* 对于子组件，不同的props是怎么被处理 */
        return <div>
            { renderFunction() }
            { mes }
            { renderName() }
            { renderComponent }
            <Component />
            <button onClick={ () => say() } > change content </button>
        </div>
    }
}
/* props 定义绑定 */
class Index extends React.Component{
    state={  
        mes: "hello,React"
    }
    node = null
    say= () =>  this.setState({ mes:'let us learn React!' })
    render(){
        return <div>
            <PropsComponent  
               mes={this.state.mes}  // ① props 作为一个渲染数据源
               say={ this.say  }     // ② props 作为一个回调函数 callback
               Component={ ChidrenComponent } // ③ props 作为一个组件
               renderName={ ()=><div> my name is alien </div> } // ④ props 作为渲染函数
            >
                { ()=> <div>hello,world</div>  } { /* ⑤render props */ }
                <ChidrenComponent />             { /* ⑥render component */ }
            </PropsComponent>
        </div>
    }
}
```

1. props 作为一个子组件渲染数据源。
2. props 作为一个通知父组件的回调函数。
3. props 作为一个单纯的组件传递。
4. props 作为渲染函数。
5. render props ， 和4的区别是放在了 children 属性上。
6. render component 插槽组件。

在标签内部的属性和方法会直接绑定在 props 对象的属性上，对于组件的插槽会被绑定在 props 的 Children 属性中

### 如何定义的props？

- 在 React 组件层级 props 充当的角色

一方面父组件 props 可以把数据层传递给子组件去渲染消费。另一方面子组件可以通过 props 中的 callback ，来向父组件传递信息。还有一种可以将视图容器作为 props 进行渲染。

- 从 React 更新机制中 props 充当的角色

在 React 中，props 在组件更新中充当了重要的角色，在 fiber 调和阶段中，diff 可以说是 React 更新的驱动器，熟悉 vue 的同学都知道 vue 中基于响应式，数据的变化，就会颗粒化到组件层级，通知其更新，但是在 React 中，无法直接检测出数据更新波及到的范围，props 可以作为组件是否更新的重要准则，变化即更新，于是有了 PureComponent ，memo 等性能优化方案。

- 从React插槽层面props充当的角色

React 可以把组件的闭合标签里的插槽，转化成 Children 属性，一会将详细介绍这个模式。

### 如何监听props改变

- 类组件中

componentWillReceiveProps 可以作为监听props的生命周期，但是 React 已经不推荐使用 componentWillReceiveProps ，未来版本可能会被废弃，因为这个生命周期超越了 React 的可控制的范围内，可能引起多次执行等情况发生。于是出现了这个生命周期的替代方案 getDerivedStateFromProps ，在下一章节，会详细介绍 React 生命周期。

- 函数组件中

函数组件中同理可以用 useEffect 来作为 props 改变后的监听函数。(不过有一点值得注意, useEffect 初始化会默认执行一次)

```js
React.useEffect(()=>{
    // props 中number 改变，执行这个副作用。
    console.log('props改变：' ，props.number  )
},[ props.number ])

```

## 问答环节

::: warning 问
React 类组件和函数组件有什么异同?
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
事实上，componentWillMount 的存在不仅“鸡肋”而且危险，因此它并不值得被“代替”，它就应该被废弃。 在 Fiber 带来的异步渲染机制下，可能会导致非常严重的 Bug, componentWillUpdate 里滥用 setState 导致重复渲染死循环的

而 getDerivedStateFromProps 这个 API，其设计的初衷不是试图替换掉 componentWillMount，而是试图替换掉 componentWillReceiveProps，因此它有且仅有一个用途：使用 props 来派生/更新 state。
:::

::: warning 问
为什么要用 getDerivedStateFromProps 代替 componentWillReceiveProps?
:::

::: tip 答
它相对于早期的 componentWillReceiveProps 来说，正是做了“合理的减法”。而做这个减法的决心之强烈，从 getDerivedStateFromProps 直接被定义为 static 方法这件事上就可见一斑—— static 方法内部拿不到组件实例的 this，这就导致你无法在 getDerivedStateFromProps 里面做任何类似于 this.fetch()、不合理的 this.setState（会导致死循环的那种）这类可能会产生副作用的操作。

因此，getDerivedStateFromProps 生命周期替代 componentWillReceiveProps 的背后，是 React 16 在强制推行“只用 getDerivedStateFromProps 来完成 props 到 state 的映射”这一最佳实践。意在确保生命周期函数的行为更加可控可预测，从根源上帮开发者避免不合理的编程方式，避免生命周期的滥用；同时，也是在为新的 Fiber 架构铺路
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

::: warning 问
类组件中的 setState 和函数组件中的 useState 有什么异同？
:::

::: tip 答

- 相同点:
首先从原理角度出发，setState和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则。

- 不同点

1. 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。

2. setState 有专门监听 state 变化的回调函数 callback，可以获取最新state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。

3. setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。

:::

## 参考资料

- React进阶实践指南