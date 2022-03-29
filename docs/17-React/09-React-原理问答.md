---
title: React原理-问答汇总
---

## Component

### 组件的生命周期有哪些？16版本后生命周期有哪些变化？

### React废弃了哪些生命周期？为什么？

1. componentWillMount
2. componentWillReceiveProps
3. componentWillUpdate

- 被废弃的三个函数都是在render之前，因为fiber的出现，很可能因为高优先级任务的出现而打断现有任务导致它们会被执行多次。
- 另外的一个原因则是，React想约束使用者，好的框架能够让人不得已写出容易维护和扩展的代码，这一点又是从何谈起，可以从新增加以及即将废弃的生命周期分析入手

### 组件之间的通讯方式有哪些？

### 为什么React并不推荐优先考虑使用Context？

1. Context目前还处于实验阶段，可能会在后面的发行版本中有很大的变化，事实上这种情况已经发生了，所以为了避免给今后升级带来大的影响和麻烦，不建议在app中使用context。
2. 尽管不建议在app中使用context，但是独有组件而言，由于影响范围小于app，如果可以做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用context
3. 对于组件之间的数据通信或者状态管理，有效使用props或者state解决，然后再考虑使用第三方的成熟库进行解决，以上的方法都不是最佳的方案的时候，在考虑context。
4. context的更新需要通过setState()触发，但是这并不是很可靠的，Context支持跨组件的访问，但是如果中间的子组件通过一些方法不影响更新，比如 shouldComponentUpdate() 返回false 那么不能保证Context的更新一定可以使用Context的子组件，因此，Context的可靠性需要关注

### HOC、RenderProps、Mixin、Hooks优劣如何？

- HOC

是接受一个组件并返回一个新组件的函数。基本上，这是一个模式，是从 React 的组合特性中衍生出来的，称其为纯组件

1. 代码重用、逻辑和引导抽象
2. 渲染劫持
3. state 抽象和操作
4. props 处理

- 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。具体而言，高阶组件是参数为组件，返回值为新组件的函数。
- render props是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术，更具体的说，render prop 是一个用于告知组件需要渲染什么内容的函数 prop。
- 通常，render props 和高阶组件只渲染一个子节点。让 Hook 来服务这个使用场景更加简单。这两种模式仍有用武之地，（例如，一个虚拟滚动条组件或许会有一个 renderltem 属性，或是一个可见的容器组件或许会有它自己的 DOM 结构）。但在大部分场景下，Hook 足够了，并且能够帮助减少嵌套。

- hook

1. 使用直观；
2. 解决hoc的prop 重名问题；
3. 解决render props 因共享数据 而出现嵌套地狱的问题；
4. 能在return之外使用数据的问题


### 受控组件和非受控组件的区别？

- 受控组件是 React 控制中的组件，并且是表单数据真实的唯一来源。
- 非受控组件是由 DOM 处理表单数据的地方，而不是在 React 组件中。

尽管非受控组件通常更易于实现，因为只需使用refs即可从 DOM 中获取值，但通常建议优先选择受控制的组件，而不是非受控制的组件

这样做的主要原因是受控组件支持即时字段验证，允许有条件地禁用/启用按钮，强制输入格式。

### 类组件与函数组件有什么异同？

![vs](https://s0.lgstatic.com/i/image/M00/7E/CE/CgqCHl_PXDiAO20DAABdvYlGsmA577.png)

- 相同点

组件是 React 可复用的最小代码片段，它们会返回要在页面中渲染的 React 元素。也正因为组件是 React 的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。

我们甚至可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件（虽然并不推荐这种重构行为）。从使用者的角度而言，很难从使用体验上区分两者，而且在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。所以，基本可认为两者作为组件是完全一致的。

- 不同点

- 它们在开发时的心智模型上却存在巨大的差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。
- 之前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。
- 性能优化上，类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能。
- 从上手程度而言，类组件更容易上手，从未来趋势上看，由于React Hooks 的推出，函数组件成了社区未来主推的方案。
- 类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展。

## State&Props

## state 和 props 区别是啥？

props和state是普通的 JS 对象。虽然它们都包含影响渲染输出的信息，但是它们在组件方面的功能是不同的。即

- state 是组件自己管理数据，控制自己的状态，可变；
- props 是外部传入的数据参数，不可变；
- 没有state的叫做无状态组件，有state的叫做有状态组件；
- 多用 props，少用 state，也就是多写无状态组件。

### setState 是异步还是同步？

1. 合成事件中是异步
2. 钩子函数中的是异步
3. 原生事件中是同步
4. setTimeout 中是同步

### setState 后发生了什么？

1. 在 setState 的时候，React 会为当前节点创建一个 updateQueue 的更新列队。
2. 然后会触发 reconciliation 过程，在这个过程中，会使用名为 Fiber 的调度算法，开始生成新的 Fiber 树， Fiber 算法的最大特点是可以做到异步可中断的执行。
3. 然后 React Scheduler 会根据优先级高低，先执行优先级高的节点，具体是执行 doWork 方法。
4. 在 doWork 方法中，React 会执行一遍 updateQueue 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换 等 Tag。
5. 当前节点 doWork 完成后，会执行 performUnitOfWork 方法获得新节点，然后再重复上面的过程。
6. 当所有节点都 doWork 完成后，会触发 commitRoot 方法，React 进入 commit 阶段。
在 commit 阶段中，React 会根据前面为各个节点打的 Tag，一次性更新整个 dom 元素

<br/>
<img src="./img/process.png" />
<br/>

## Reconciler&Fiber

### 什么是fiber？fiber架构解决了什么问题？

### Fiber root 和root fiber有什么区别？

### 不同fiber之间如何建立区别和联系？

### React的调和流程是什么？

### 两大阶段commit 和render 都做了哪些事情？

### 什么是双缓冲树有什么作用？

### Fiber深度优先遍历流程？

### Fiber 的调和能中断吗？如何中断？

## Scheduler&TimeSlice

### 异步调度原理？




### React 为什么不用setTimeout？

### 说一说时间切片？

### react 如何模拟 RequestIdleCallback?

### 简述一下调度流程？

## Hooks

### React Hooks 为什么必须在函数组件内部执行？React 如何能够监听 React Hooks 在外部执行并抛出异常？

### React Hooks 如何把状态保存起来？保存的信息存在了哪里？

### React Hooks 为什么不能写在条件语句中？

### useMemo 内部引用 useRef 为什么不需要添加依赖项，而 useState 就要添加依赖项？

### useEffect 添加依赖项 props.a ，为什么 props.a 改变，useEffect 回调函数 create 重新执行？

### React 内部如何区别 useEffect 和 useLayoutEffect ，执行时机有什么不同？

## 事件

### React 有自己的事件系统？

### 什么是合成事件？

- 兼容所有浏览器，更好的跨平台；
- 将事件统一存放在一个数组，避免频繁的新增与删除（垃圾回收）。
- 方便 react 统一管理和事务机制。

### React事件和原生事件的区别

- 对于事件名称命名方式，原生事件为全小写，react 事件采用小驼峰；
- 对于事件函数处理语法，原生事件为字符串，react 事件为函数；
- react 事件不能采用 return false 的方式来阻止浏览器的默认行为，而必须要地明确地调用preventDefault()来阻止默认行为

### 如何实现批量更新

### 事件系统如何模拟冒泡和捕获阶段

### 如何通过dom元素找到与之匹配答fiber？

### 为什么不能用return false 来阻止事件的默认行为？

### 事件是绑定在真实的dom上吗？为何不绑定在那里？

### V17 对事件系统做了哪些改变？

## 其他

### 懒加载（lazy）实现原理

- [深入理解React：懒加载（lazy）实现原理](https://juejin.cn/post/6844904191853494280)

### React的异常捕获原理是什么？

### React的设计理念？

### React 与其他库的区别？

## 性能优化手段

1. React 渲染控制的方法？缓存 react element ，pureComponent ，Memo ，shouldComponentUpdate
2. shallowEqual 浅比较原理。
3. React 中节流防抖运用。
4. 合理运用状态管理。
5. 按需引入。减少项目体积。
6. 代码分割 lazy ，异步组件 Suspense 及其原理。
7. diff 算法，合理应用 key 。
8. 渲染错误边界，componentDidCatch。
9. 状态管理工具和 immutable.js 使用。
10. useMemo 缓存逻辑。
11. memo 的缓存策略。
12. useCallback 缓存函数

## 设计理念和模式

1. React 几种设计模式总结。组合模式，render props模式，提供者模式， hoc 模式，自定义hooks 模式。
2. 新老版本 context 用法特点。
3. React context 特点。逐层传递，发布订阅。
4. 新版本 context 消费者几种方式。contextType ，useContext ，consumer
5. hoc 两种方式，优缺点？属性代理，反向继承。
6. hoc 如何解决静态属性继承问题。
7. hoc 如何解决 ref 获取问题。
8. hoc 注意事项。
9. 自定义 hooks 设计。
10. 自定义 hooks 实践。

## 生态发展

1. 两种路由模式 ｜ spa 单页面路由原理。
2. React router 使用，实现动态路由，自定义路由。
3. Route. Router Switch 分工。
4. 权限路由封装。
5. Mobx-react 使用。
6. Mobx 和 React Redux 区别？
7. Mobx 原理，收集依赖，触发更新。
8. React Redux 和 Redux 使用。
9. Redux 设计模式 ｜ 中间件原理。
10. React Redux  原理？
11. react redux 衍生： dva React-saga 等
12. React Redux 中 connect 原理 （这里推荐大家看一下源码，学习一下 hooks使用）

## 推荐阅读

- [React高频面试题梳理，看看面试怎么答？（上）](https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490164&idx=1&sn=2eb9b80862516d8f01f0ba7fac508ee8&source=41#wechat_redirect)

- [「2021」高频前端面试题汇总之React篇（上）](https://juejin.cn/post/6941546135827775525#heading-27)

- [「2021」高频前端面试题汇总之React篇（下）](https://juejin.cn/post/6940942549305524238#heading-1)
