---
title: React扩展-问答汇总
---

## Component

### 组件的生命周期有哪些？16 版本后生命周期有哪些变化？

react 16：

- 引入了 Fiber 架构，新增了 Scheduler 调度器；
- 废弃了三个生命周期函数：componentWillMount、componentWillReceiveProps、componentWillUpdate；

  react 16.8：

- 稳定版的 Hooks；

  react 17：

- 渐进式升级，允许 React 多版本共存；
- 事件委托的变更：不再将事件处理挂载到 document 上，通过 rootNode 来代替；
- jsx 新的编译方式，无需显式引入 React 了；

  react 18：

- 并发模式和并发更新
- Render API
- setState 自动批处理
- 新的 API

### React 废弃了哪些生命周期？为什么？

1. componentWillMount
2. componentWillReceiveProps
3. componentWillUpdate

- 被废弃的三个函数都是在 render 之前，因为 fiber 的出现，很可能因为高优先级任务的出现而打断现有任务导致它们会被执行多次。
- 另外的一个原因则是，React 想约束使用者，好的框架能够让人不得已写出容易维护和扩展的代码，这一点又是从何谈起，可以从新增加以及即将废弃的生命周期分析入手

### 组件之间的通讯方式有哪些？

- props：父对子；
- 函数的回调：子对父；
- 兄弟组件之间通信可以使用父组件作中间层；
- context 上下文；
- 状态管理：redux、dva、mbox 等；

### 为什么 React 并不推荐优先考虑使用 Context？

1. Context 目前还处于实验阶段，可能会在后面的发行版本中有很大的变化，事实上这种情况已经发生了，所以为了避免给今后升级带来大的影响和麻烦，不建议在 app 中使用 context。
2. 尽管不建议在 app 中使用 context，但是独有组件而言，由于影响范围小于 app，如果可以做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用 context
3. 对于组件之间的数据通信或者状态管理，有效使用 props 或者 state 解决，然后再考虑使用第三方的成熟库进行解决，以上的方法都不是最佳的方案的时候，在考虑 context。
4. context 的更新需要通过 setState()触发，但是这并不是很可靠的，Context 支持跨组件的访问，但是如果中间的子组件通过一些方法不影响更新，比如 shouldComponentUpdate() 返回 false 那么不能保证 Context 的更新一定可以使用 Context 的子组件，因此，Context 的可靠性需要关注

### HOC、RenderProps、Mixin、Hooks 优劣如何？

- HOC

是接受一个组件并返回一个新组件的函数。基本上，这是一个模式，是从 React 的组合特性中衍生出来的，称其为纯组件

1. 代码重用、逻辑和引导抽象
2. 渲染劫持
3. state 抽象和操作
4. props 处理

- 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。具体而言，高阶组件是参数为组件，返回值为新组件的函数。
- render props 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术，更具体的说，render prop 是一个用于告知组件需要渲染什么内容的函数 prop。
- 通常，render props 和高阶组件只渲染一个子节点。让 Hook 来服务这个使用场景更加简单。这两种模式仍有用武之地，（例如，一个虚拟滚动条组件或许会有一个 renderltem 属性，或是一个可见的容器组件或许会有它自己的 DOM 结构）。但在大部分场景下，Hook 足够了，并且能够帮助减少嵌套。

- hook

1. 使用直观；
2. 解决 hoc 的 prop 重名问题；
3. 解决 render props 因共享数据 而出现嵌套地狱的问题；
4. 能在 return 之外使用数据的问题

### 受控组件和非受控组件的区别？

- 受控组件是 React 控制中的组件，并且是表单数据真实的唯一来源。
- 非受控组件是由 DOM 处理表单数据的地方，而不是在 React 组件中。

尽管非受控组件通常更易于实现，因为只需使用 refs 即可从 DOM 中获取值，但通常建议优先选择受控制的组件，而不是非受控制的组件

这样做的主要原因是受控组件支持即时字段验证，允许有条件地禁用/启用按钮，强制输入格式。

### 类组件与函数组件有什么异同？

![vs](https://s0.lgstatic.com/i/image/M00/7E/CE/CgqCHl_PXDiAO20DAABdvYlGsmA577.png)

- 相同点

组件是 React 可复用的最小代码片段，它们会返回要在页面中渲染的 React 元素。也正因为组件是 React 的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。

我们甚至可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件（虽然并不推荐这种重构行为）。从使用者的角度而言，很难从使用体验上区分两者，而且在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。所以，基本可认为两者作为组件是完全一致的。

- 不同点

- 它们在开发时的心智模型上却存在巨大的差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。
- 之前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。
- 性能优化上，类组件主要依靠 shouldComponentUpdate  阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能。
- 从上手程度而言，类组件更容易上手，从未来趋势上看，由于 React Hooks 的推出，函数组件成了社区未来主推的方案。
- 类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展。

## State&Props

## state 和 props 区别是啥？

props 和 state 是普通的 JS 对象。虽然它们都包含影响渲染输出的信息，但是它们在组件方面的功能是不同的。即

- state 是组件自己管理数据，控制自己的状态，可变；
- props 是外部传入的数据参数，不可变；
- 没有 state 的叫做无状态组件，有 state 的叫做有状态组件；
- 多用 props，少用 state，也就是多写无状态组件。

### setState 是异步还是同步？

1. 合成事件中是异步
2. 钩子函数中的是异步
3. 原生事件中是同步
4. setTimeout 中是同步

setState 并非真异步，只是看上去像异步。在源码中，通过 isBatchingUpdates 来判断
setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。
那么什么情况下 isBatchingUpdates 会为 true 呢？在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。

但在 React 无法控制的地方，比如原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新。
一般认为，做异步设计是为了性能优化、减少渲染次数，React 团队还补充了两点。
保持内部一致性。如果将 state 改为同步更新，那尽管 state 的更新是同步的，但是 props 不是。
启用并发更新，完成异步渲染。

- setState 是同步还是异步的核心关键点：更新队列。

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

### 什么是 fiber？fiber 架构解决了什么问题？

Fiber，又叫时间切片，React 新架构中的任务调度，特点是异步可中断的执行；
Fiber 架构主要解决了处理庞大的渲染工作时，能明显感知到的掉帧卡顿现象，优化了用户体验；

### Fiber root 和 root fiber 有什么区别？

- 首次执行 ReactDoM.render 会创建 fiberRoot 和 rootFiber；
- fiberRoot 是整个应用的根节点，绑定在真实 DOM 节点的\_reactRootContainer 属性上，当对一个元素重复调用 ReactDOM.render 时，fiberRoot 不会改变；
- rootFiber 是<APP />所在组件树的根节点，rootFiber 在每次重新渲染的时候会重新创建；diff 算法的作用对象也是 rooFiber 树和当前虚拟 dom 树；
- fiberRoot 的 current 会指向当前页面上已渲染内容的 Fiber 树，即：fiberRoot.current = rootFiber;

### 不同 fiber 之间如何建立区别和联系？

每个 element 都会对应一个 fiber，通过 key 和 tag 做区分，通过 return、child、sibling 三个属性建立联系：

- return：指向父级 fiber 节点；
- child：指向子级 fiber 节点；
- sibling：指向兄弟 fiber 节点；

### React 的调和流程是什么？

React 的渲染过程大致一致，但协调并不相同，以 React 16 为分界线，分为 Stack Reconciler 和 Fiber Reconciler。这里的协调从狭义上来讲，特指 React 的 diff 算法，广义上来讲，有时候也指 React 的 reconciler 模块，它通常包含了 diff 算法和一些公共逻辑。

回到 Stack Reconciler 中，Stack Reconciler 的核心调度方式是递归。调度的基本处理单位是事务，它的事务基类是 Transaction，这里的事务是 React 团队从后端开发中加入的概念。在 React 16 以前，挂载主要通过 ReactMount 模块完成，更新通过 ReactUpdate 模块完成，模块之间相互分离，落脚执行点也是事务。

在 React 16 及以后，协调改为了 Fiber Reconciler。它的调度方式主要有两个特点，第一个是协作式多任务模式，在这个模式下，线程会定时放弃自己的运行权利，交还给主线程，通过 requestIdleCallback 实现。第二个特点是策略优先级，调度任务通过标记 tag 的方式分优先级执行，比如动画，或者标记为 high 的任务可以优先执行。Fiber Reconciler 的基本单位是 Fiber，Fiber 基于过去的 React Element 提供了二次封装，提供了指向父、子、兄弟节点的引用，为 diff 工作的双链表实现提供了基础。

在新的架构下，整个生命周期被划分为 Render 和 Commit 两个阶段。Render 阶段的执行特点是可中断、可停止、无副作用，主要是通过构造 workInProgress 树计算出 diff。以 current 树为基础，将每个 Fiber 作为一个基本单位，自下而上逐个节点检查并构造 workInProgress 树。这个过程不再是递归，而是基于循环来完成。

在执行上通过 requestIdleCallback 来调度执行每组任务，每组中的每个计算任务被称为 work，每个 work 完成后确认是否有优先级更高的 work 需要插入，如果有就让位，没有就继续。优先级通常是标记为动画或者 high 的会先处理。每完成一组后，将调度权交回主线程，直到下一次 requestIdleCallback 调用，再继续构建 workInProgress 树。

在 commit 阶段需要处理 effect 列表，这里的 effect 列表包含了根据 diff 更新 DOM 树、回调生命周期、响应 ref 等。

但一定要注意，这个阶段是同步执行的，不可中断暂停，所以不要在 componentDidMount、componentDidUpdate、componentWiilUnmount 中去执行重度消耗算力的任务。

### 两大阶段 commit 和 render 都做了哪些事情？

### 什么是双缓冲树有什么作用？

### Fiber 深度优先遍历流程？

### Fiber 的调和能中断吗？如何中断？

## Scheduler&TimeSlice

### 异步调度原理？

### React 为什么不用 setTimeout？

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

### React 事件和原生事件的区别

- 对于事件名称命名方式，原生事件为全小写，react 事件采用小驼峰；
- 对于事件函数处理语法，原生事件为字符串，react 事件为函数；
- react 事件不能采用 return false 的方式来阻止浏览器的默认行为，而必须要地明确地调用 preventDefault()来阻止默认行为

### 如何实现批量更新

### 事件系统如何模拟冒泡和捕获阶段

### 如何通过 dom 元素找到与之匹配答 fiber？

### 为什么不能用 return false 来阻止事件的默认行为？

### 事件是绑定在真实的 dom 上吗？为何不绑定在那里？

### V17 对事件系统做了哪些改变？

## 其他

### 懒加载（lazy）实现原理

- [深入理解 React：懒加载（lazy）实现原理](https://juejin.cn/post/6844904191853494280)

### React 的异常捕获原理是什么？

### React 的设计理念？

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

1. React 几种设计模式总结。组合模式，render props 模式，提供者模式， hoc 模式，自定义 hooks 模式。
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
10. React Redux 原理？
11. react redux 衍生： dva React-saga 等
12. React Redux 中 connect 原理 （这里推荐大家看一下源码，学习一下 hooks 使用）

## 推荐阅读

- [React 高频面试题梳理，看看面试怎么答？（上）](https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490164&idx=1&sn=2eb9b80862516d8f01f0ba7fac508ee8&source=41#wechat_redirect)

- [「2021」高频前端面试题汇总之 React 篇（上）](https://juejin.cn/post/6941546135827775525#heading-27)

- [「2021」高频前端面试题汇总之 React 篇（下）](https://juejin.cn/post/6940942549305524238#heading-1)

- [React 开发必须知道的 34 个技巧【近 1W 字】](https://juejin.cn/post/6844903993278201870)

- [React 知识点梳理](https://mp.weixin.qq.com/s/GTTm260AvNdEib671RDufg)

- [86 张脑图，一口气看完 React](https://juejin.cn/post/7085145274200358949)

- [React 500 题](https://github.com/sudheerj/reactjs-interview-questions)
