---
title: React基础-组件复用
---
## React 组件复用指南

本文来源于 2 篇文章:

- 高阶组件: 来源于 franleplant 的文章[React Higher Order Components in depth](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e),我们对少部分内容做了删减和修改
- 渲染属性: 来源于 Michael Jackson(是的,franleplant 的文章中就提到了此人)的文章[Use a Render Prop!](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce),react 官网关于 Render Prop 的部分就是他的 pr,此文包含了大量作者的主观观点,我们会在后文进行相对客观的比较.

## 类组件继承

对于类组件的强化，首先想到的是继承方式，之前开发的开源项目 react-keepalive-router 就是通过继承 React-Router 中的 Switch 和 Router ，来达到缓存页面的功能的。因为 React 中类组件，有良好的继承属性，所以可以针对一些基础组件，首先实现一部分基础功能，再针对项目要求进行有方向的改造、强化、添加额外功能。

```js
/* 人类 */
class Person extends React.Component{
    constructor(props){
        super(props)
        console.log('hello , i am person')
    }
    componentDidMount(){ console.log(1111)  }
    eat(){    /* 吃饭 */ }
    sleep(){  /* 睡觉 */  }
    ddd(){   console.log('打豆豆')  /* 打豆豆 */ }
    render(){
        return <div>
            大家好，我是一个person
        </div>
    }
}
/* 程序员 */
class Programmer extends Person{
    constructor(props){
        super(props)
        console.log('hello , i am Programmer too')
    }
    componentDidMount(){  console.log(this)  }
    code(){ /* 敲代码 */ }
    render(){
        return <div style={ { marginTop:'50px' } } >
            { super.render() } { /* 让 Person 中的 render 执行 */ }
            我还是一个程序员！    { /* 添加自己的内容 */ }
        </div>
    }
}
export default Programmer
```

我们从上面不难发现这个继承增强效果很优秀。它的优势如下：

1. 可以控制父类 render，还可以添加一些其他的渲染内容；
2. 可以共享父类方法，还可以添加额外的方法和属性。
但是也有值得注意的地方，就是 state 和生命周期会被继承后的组件修改。像上述 demo 中，Person 组件中的 componentDidMount 生命周期将不会被执行。

## 高阶组件(HOC)

### **什么是高阶组件？**

> 高阶组件就是一个 React 组件包裹着另外一个 React 组件

这种模式通常使用函数来实现，基本上是一个类工厂（是的，一个类工厂！），它的函数签名可以用类似 haskell 的伪代码表示

```haskell
hocFactory:: W: React.Component => E: React.Component
```

其中 W (WrappedComponent) 指被包裹的 React.Component，E (EnhancedComponent) 指返回类型为 React.Component 的新的 HOC。

我们有意模糊了定义中“包裹”的概念，因为它可能会有以下两种不同的含义之一:

1. 属性代理(Props Proxy)： HOC 对传给 WrappedComponent W 的 porps 进行操作。
2. 反向继承(Inheritance Inversion)： HOC 继承 WrappedComponent W。

我们会深入地探究这两种模式。

### **HOC 工厂的实现方法**

这一节我们将会研究 React 中两种 HOC 的实现方法：Props Proxy (PP) and Inheritance Inversion (II)。两种方法都可以操作 WrappedComponent。

#### **属性代理(Props Proxy)**

Props Proxy (PP) 的最简实现：

```jsx
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

这里主要是 HOC 在 render 方法中**  返回**  了一个  *WrappedComponent*  类型的 React Element。我们还传入了 HOC 接收到的 props，这就是名字  **Props Proxy**  的由来。

**使用 Props Proxy 可以做什么？**

- 操作 props
- 通过 Refs 访问到组件实例
- 提取 state
- 用其他元素包裹  *WrappedComponent*

**操作 props**

你可以读取、添加、编辑、删除传给  *WrappedComponent *的 props。

当删除或者编辑重要的 props 时要小心，你可能应该通过命名空间确保高阶组件的 props 不会破坏  *WrappedComponent*。

例子：添加新的 props。在这个应用中，当前登录的用户可以在  *WrappedComponent *中通过  *this.props.user*  访问到。

```jsx
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    render() {
      const newProps = {
        user: currentLoggedInUser,
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
```

**通过 Refs 访问到组件实例**

你可以通过*引用*（_ref_）访问到  *this* （*WrappedComponent*  的实例），但为了得到引用，*WrappedComponent*  还需要一个初始渲染，意味着你需要在 HOC 的 render 方法中返回  *WrappedComponent*  元素，让 React 开始它的一致化处理，你就可以得到  *WrappedComponent*的实例的引用。

例子：如何通过  [refs](https://link.zhihu.com/?target=https%3A//facebook.github.io/react/docs/more-about-refs.html)  访问到实例的方法和实例本身：

```jsx
function refsHOC(WrappedComponent) {
  return class RefsHOC extends React.Component {
    proc(wrappedComponentInstance) {
      wrappedComponentInstance.method();
    }
    render() {
      const props = Object.assign({}, this.props, {
        ref: this.proc.bind(this),
      });
      return <WrappedComponent {...props} />;
    }
  };
}
```

Ref 的回调函数会在 WrappedComponent 渲染时执行，你就可以得到  *WrappedComponent *的引用。这可以用来读取/添加实例的 props ，调用实例的方法。

**提取 state**

你可以通过传入 props 和回调函数把 state 提取出来，类似于 smart component 与 dumb component。

提取 state 的例子：提取了 input 的  *value*  和  *onChange*  方法。这个简单的例子不是很常规，但足够说明问题。

```jsx
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: "",
      };
      this.onNameChange = this.onNameChange.bind(this);
    }
    onNameChange(event) {
      this.setState({
        name: event.target.value,
      });
    }
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onNameChange,
        },
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
```

你可以这样用：

```jsx
@ppHOC
class Example extends React.Component {
  render() {
    return <input name="name" {...this.props.name} />;
  }
}
```

这个 input 会自动成为[受控 input](https://reactjs.org/docs/forms.html)。

> **更多关于常规的双向绑定 HOC 请点击  [链接](https://github.com/franleplant/react-hoc-examples/blob/master/pp_state.js)** > **用其他元素包裹 WrappedComponent**

为了封装样式、布局或别的目的，你可以用其它组件和元素包裹  *WrappedComponent*。基本方法是使用父组件（附录 B）实现，但通过 HOC 你可以得到更多灵活性。

例子：包裹样式

```jsx
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    render() {
      return (
        <div style={{ display: "block" }}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
}
```

### **反向继承(Inheritance Inversion)**

Inheritance Inversion (II) 的最简实现：

```jsx
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      return super.render();
    }
  };
}
```

你可以看到，返回的 HOC 类（Enhancer）**继承**了  *WrappedComponent*。之所以被称为 Inheritance Inversion 是因为  *WrappedComponent*  被  *Enhancer*  继承了，而不是  *WrappedComponent*  继承了  *Enhancer*。在这种方式中，它们的关系看上去被**反转（inverse）**了。

Inheritance Inversion 允许 HOC 通过  *this*  访问到  *WrappedComponent*，意味着**它可以访问到 state、props、组件生命周期方法和 render 方法**。

关于生命周期方法可以用来做什么，我不想细说，因为它是 React 的特性而不是 HOC 的特性。但请注意通过 II 你可以创建新的生命周期方法。为了不破坏  *WrappedComponent*，记得调用  *super.[lifecycleHook]*。

**一致化处理（Reconciliation process）**

开始之前我们先理清一些概念。

React 元素决定描述了在 React 执行[一致化](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)处理时它要渲染什么。

React 元素有两种类型：字符串和函数。字符串类型的 React 元素代表 DOM 节点，函数类型的 React 元素代表继承 React.Component 的组件。更多关于元素（Element）和组件（Component）请看[这篇文章](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)。函数类型的 React 元素会在[一致化](https://reactjs.org/docs/reconciliation.html)处理中被解析成一个完全由字符串类型 React 组件组成的树（而最后的结果永远是 DOM 元素）。

这很重要，意味着  **Inheritance Inversion 的高阶组件不一定会解析完整子树**

## _Inheritance Inversion 的高阶组件不一定会解析完整子树_

这在学习渲染劫持（Render Highjacking）时非常重要。

**你可以用 Inheritance Inversion 做什么？**

- 渲染劫持（Render Highjacking）
- 操作 state

**渲染劫持**

之所以被称为渲染劫持是因为 HOC 控制着  *WrappedComponent*  的渲染输出，可以用它做各种各样的事。

通过渲染劫持你可以：

- 在由  \*render**\*输出**的任何 React 元素中读取、添加、编辑、删除 props
- 读取和修改由  *render*  输出的 React 元素树
- 有条件地渲染元素树
- 把样式包裹进元素树（就像在 Props Proxy 中的那样）

*\*render*  指  *WrappedComponent*.*render*  方法

> _你**不能**编辑或添加 WrappedComponent 实例的 props，因为 React 组件不能编辑它接收到的 props，但你**可以**修改由  **render**  方法返回的组件的 props。_
> 就像我们刚才学到的，II 类型的 HOC 不一定会解析完整子树，意味着渲染劫持有一些限制。根据经验，使用渲染劫持你可以完全操作  *WrappedComponent*  的 render 方法返回的元素树。但是如果元素树包括一个函数类型的 React 组件，你就不能操作它的子组件了。（被 React 的一致化处理推迟到了真正渲染到屏幕时）

例 1：条件渲染。当  *this.props.loggedIn*  为 true 时，这个 HOC 会完全渲染  *WrappedComponent*的渲染结果。（假设 HOC 接收到了 loggedIn 这个 prop）

```jsx
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      if (this.props.loggedIn) {
        return super.render();
      } else {
        return null;
      }
    }
  };
}
```

例 2：修改由  *render*  方法输出的 React 组件树。

```jsx
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      const elementsTree = super.render();
      let newProps = {};
      if (elementsTree && elementsTree.type === "input") {
        newProps = { value: "may the force be with you" };
      }
      const props = Object.assign({}, elementsTree.props, newProps);
      const newElementsTree = React.cloneElement(
        elementsTree,
        props,
        elementsTree.props.children
      );
      return newElementsTree;
    }
  };
}
```

在这个例子中，如果  *WrappedComponent*  的输出在最顶层有一个 input，那么就把它的 value 设为  *“may the force be with you”*。

你可以在这里做各种各样的事，你可以遍历整个元素树，然后修改元素树中任何元素的 props。这也正是样式处理库  [Radium](http://stack.formidable.com/radium/)  所用的方法（案例分析一节中有更多关于 Radium 的信息）。

> _注：在 Props Proxy 中**不能**做到渲染劫持。_ > _虽然通过 WrappedComponent.prototype.render 你可以访问到 render 方法，不过还需要模拟 WrappedComponent 的实例和它的 props，还可能亲自处理组件的生命周期，而不是交给 React。根据我的实验，这么做不值，你要是想做到渲染劫持你应该用 Inheritance Inversion 而不是 Props Proxy。记住，React 在内部处理了组件实例，你处理实例的唯一方法是通过  **this**  或者 refs。_

**操作 state**

HOC 可以读取、编辑和删除  *WrappedComponent*  实例的 state，如果你需要，你也可以给它添加更多的 state。记住，这会搞乱  *WrappedComponent*  的 state，导致你可能会破坏某些东西。要限制 HOC 读取或添加 state，添加 state 时应该放在单独的命名空间里，而不是和  *WrappedComponent*  的 state 混在一起。

例子：通过访问  *WrappedComponent*  的 props 和 state 来做调试。

```jsx
export function IIHOCDEBUGGER(WrappedComponent) {
  return class II extends WrappedComponent {
    render() {
      return (
        <div>
          <h2>HOC Debugger Component</h2>
          <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
          <p>State</p>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
          {super.render()}
        </div>
      );
    }
  };
}
```

这里 HOC 用其他元素包裹着  *WrappedComponent*，还输出了  *WrappedComponent*  实例的 props 和 state。*JSON.stringify*  的小技巧是由  [Ryan Florence](https://twitter.com/ryanflorence)  和  [Michael Jackson](https://twitter.com/mjackson)  教我的。这个调试器完整的实现在[这里](https://github.com/franleplant/react-hoc-examples/blob/master/ii_debug.js)。

#### **命名**

用 HOC 包裹了一个组件会使它失去原本  *WrappedComponent*  的名字，可能会影响开发和调试。

通常会用  *WrappedComponent*  的名字加上一些 前缀作为 HOC 的名字。下面的代码来自 React-Redux：

```jsx
HOC.displayName = `HOC(${getDisplayName(WrappedComponent)})`
//或
class HOC extends ... {
  static displayName = `HOC(${getDisplayName(WrappedComponent)})`
  ...
}
```

*getDisplayName*  函数：

```jsx
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName ||
         WrappedComponent.name ||
         ‘Component’
}
```

实际上你不用自己写，[recompose](https://github.com/acdlite/recompose)  提供了这个函数。

#### 案例分析

[React-Redux](https://github.com/reduxjs/react-redux)

React-Redux 是  [Redux](https://redux.js.org/)  官方的 React 绑定实现。他提供的函数中有一个  *connect*，处理了监听 store 和后续的处理。是通过 Props Proxy 来实现的。

在纯的 Flux 架构中，React 组件会连接到一个或多个 store，需要大量添加和删除 store 监听器，挑出 state 中 需要的部分。React-Redux 的实现非常好，它把这些处理都抽象出来了。总的说来，你不用再自己写了。

[Radium](https://formidable.com/open-source/radium/)

Radium 通过在内联样式中使用[CSS 伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)增强了内联样式的能力。内联样式为什么好是另一个话题，很多人已经开始这样做，像 Radium 这样的库真的简化了这个过程。如果你想了解更多关于内联样式请参考  [Vjeux](https://medium.com/@vjeux)  的[这个](https://speakerdeck.com/vjeux/react-css-in-js) ppt。

话说回来，Radium 是怎样做到内联 CSS 伪类的，比如 hover？它用 Inheritance Inversion 模式做到了渲染劫持，插入对应的事件监听器来模拟 CSS 伪类，比如 hover。事件监听器插入到了 React 组件的 props 里。Radium 需要读取  *WrappedComponent*  的 render 方法输出的所有组件树，每当它发现一个新的带有 style 属性的组件时，在 props 上添加一个事件监听器。简单地说，Radium 修改了组件树的 props（实际上 Radium 的实现会更复杂些，你理解意思就行）。

Radium 暴露的 API 真的很简单。令人印象深刻的是，他在用户甚至没有察觉到的时候，完成了所有工作。由此可见 HOC 的威力。

### **附录 A: HOC 和参数**

> _你可以选择跳过下面的内容_

有时，在你的 HOC 上使用参数是很有用的。这对中级以上的 JS 开发者来说是很自然的事，但上面的例子都没有用到，为了做到详尽无遗我们快速地讲解一下。

例子：Props Proxy 模式 的 HOC 最简参数使用方法。关键在于 HOCFactoryFactory 函数。

```jsx
function HOCFactoryFactory(...params) {
  // do something with params
  return function HOCFactory(WrappedComponent) {
    return class HOC extends React.Component {
      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
}
```

你可以这样用：

```jsx
HOCFactoryFactory(params)(WrappedComponent);
//或
@HOCFatoryFactory(params)
class WrappedComponent extends React.Component {}
```

#### **附录 B: 与父组件的不同**

> _你可以选择跳过下面的内容_

父组件就是有一些子组件的 React 组件。React 有访问和操作子组件的 API。

例子：父组件访问子组件。

```jsx
class Parent extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
render(<Parent>{children}</Parent>, mountNode);
```

相对 HOC 来说，父组件可以做什么，不可以做什么？我们详细地总结一下：

- 渲染劫持 (在 Inheritance Inversion 一节讲到)
- 操作内部 props (在 Inheritance Inversion 一节讲到)
- 提取 state。但也有它的不足。只有在显式地为它创建钩子函数后，你才能从父组件外面访问到它的 props。这给它增添了一些不必要的限制。
- 用新的 React 组件包裹。这可能是唯一一种父组件比 HOC 好用的情况。HOC 也可以做到。
- 操作子组件会有一些陷阱。例如，当子组件没有单一的根节点时，你得添加一个额外的元素包裹所有的子组件，这让你的代码有些繁琐。在 HOC 中单一的根节点会由 React/JSX 语法来确保。
- 父组件可以自由应用到组件树中，不像 HOC 那样需要给每个组件创建一个类。

一般来讲，可以用父组件的时候就用父组件，它不像 HOC 那么 hacky，但也失去了 HOC 可以提供的灵活性。

## 渲染属性(Render Props)

### Mixins 存在的问题

我的演讲始于高阶组件主要解决的问题：**代码复用**。

让我们回到 2015 年使用 `React.createClass` 那会儿。假定你现在有一个简单的 React 应用需要跟踪并在页面上实时显示鼠标位置。你可能会构建一个下面这样的例子：

```jsx
import React from "react";
import ReactDOM from "react-dom";
const App = React.createClass({
  getInitialState() {
    return { x: 0, y: 0 };
  },
  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  },
  render() {
    const { x, y } = this.state;
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        <h1>
          The mouse position is ({x}, {y})
        </h1>
      </div>
    );
  },
});
ReactDOM.render(<App />, document.getElementById("app"));
```

现在，假定我们在另一个组件中也需要跟踪鼠标位置。我们可以重用 `<App>` 中的代码吗？

在 `createClass` 这个范式中，代码重用问题是通过被称为 “mixins” 的技术解决的。我们创建一个 `MouseMixin`，让任何人都能通过它来追踪鼠标位置。

```jsx
import React from "react";
import ReactDOM from "react-dom";
// mixin 中含有了你需要在任何应用中追踪鼠标位置的样板代码。
// 我们可以将样板代码放入到一个 mixin 中，这样其他组件就能共享这些代码
const MouseMixin = {
  getInitialState() {
    return { x: 0, y: 0 };
  },
  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  },
};
const App = React.createClass({
  // 使用 mixin！
  mixins: [MouseMixin],

  render() {
    const { x, y } = this.state;
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        <h1>
          The mouse position is ({x}, {y})
        </h1>
      </div>
    );
  },
});
ReactDOM.render(<App />, document.getElementById("app"));
```

问题解决了，对吧？现在，任何人都能轻松地将 `MouseMixin` 混入他们的组件中，并通过 `this.state` 属性获得鼠标的 `x` 和 `y` 坐标。

### HOC 是新的 Mixin

去年，随着 ES6 class 的到来，React 团队最终决定使用 ES6 class 来代替 `createClass`。这是一个明智的决定，没有人会在 JavaScript 都内置了 class 时还会维护自己的类模型。

就存在一个问题：**ES6 class 不支持 mixin**。除了不是 ES6 规范的一部分，Dan 已经在一篇 React 博客上发布的博文上详细讨论了 mixin 存在的其他问题。

minxins 的问题总结下来就是

- **ES6 class**。其不支持 mixins。
- **不够直接**。minxins 改变了 state，因此也就很难知道一些 state 是从哪里来的，尤其是当不止存在一个 mixins 时。
- **名字冲突**。两个要更新同一段 state 的 mixins 可能会相互覆盖。`createClass` API 会对两个 mixins 的 `getInitialState` 是否具有相同的 key 做检查，如果具有，则会发出警告，但该手段并不牢靠。

所以，为了替代 mixin，React 社区中的不少开发者最终决定用高阶组件（简称 HOC）来做代码复用。在这个范式下，代码通过一个类似于 **装饰器（decorator）** 的技术进行共享。首先，你的一个组件定义了大量需要被渲染的标记，之后用若干具有你想用共享的行为的组件包裹它。因此，你现在是在 **装饰** 你的组件，而不是**混入**你需要的行为！

```jsx
import React from "react";
import ReactDOM from "react-dom";
const withMouse = (Component) => {
  return class extends React.Component {
    state = { x: 0, y: 0 };
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };
    render() {
      return (
        <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
          <Component {...this.props} mouse={this.state} />
        </div>
      );
    }
  };
};
const App = React.createClass({
  render() {
    // 现在，我们得到了一个鼠标位置的 prop，而不再需要维护自己的 state
    const { x, y } = this.props.mouse;
    return (
      <div style={{ height: "100%" }}>
        <h1>
          The mouse position is ({x}, {y})
        </h1>
      </div>
    );
  },
});
// 主需要用 withMouse 包裹组件，它就能获得 mouse prop
const AppWithMouse = withMouse(App);
ReactDOM.render(<AppWithMouse />, document.getElementById("app"));
```

让我们和 mixin 说再见，去拥抱 HOC 吧。

在 ES6 class 的新时代下，HOC 的确是一个能够优雅地解决代码重用问题方案，社区也已经广泛采用它了。

此刻，我想问一句：是什么驱使我们迁移到 HOC ? 我们是否解决了在使用 mixin 时遇到的问题？

让我们看下：

- **ES6 class**。这里不再是问题了，ES6 class 创建的组件能够和 HOC 结合。
- **不够直接**。即便用了 HOC，这个问题仍然存在。在 mixin 中，我们不知道 state 从何而来，在 HOC 中，我们不知道 props 从何而来。
- **名字冲突**。我们仍然会面临该问题。两个使用了同名 prop 的 HOC 将遭遇冲突并且彼此覆盖，并且这次问题会更加隐晦，因为 React 不会在 prop 重名是发出警告。

另一个 HOC 和 mixin 都有的问题就是，二者使用的是 **静态组合** 而不是 **动态组合**。问问你自己：在 HOC 这个范式下，组合是在哪里发生的？当组件类（如上例中的的 `AppWithMouse`）被创建后，发生了一次静态组合。

你无法在 `render` 方法中使用 mixin 或者 HOC，而这恰是 React **动态** 组合模型的关键。当你在 `render` 中完成了组合，你就可以利用到所有 React 生命期的优势了。动态组合或许微不足道，但兴许某天也会出现一篇专门探讨它的博客，等等，我有点离题了。

总而言之：**使用 ES6 class 创建的 HOC 仍然会遇到和使用 `createClass` 时一样的问题，它只能算一次重构。**现在不要说拥抱 HOC 了，我们不过在拥抱新的 mixin！

除了上述缺陷，由于 HOC 的实质是**包裹**组件并创建了一个**混入**现有组件的 mixin 替代，因此，**HOC 将引入大量的繁文缛节**。从 HOC 中返回的组件需要表现得和它包裹的组件尽可能一样（它需要和包裹组件接收一样的 props 等等）。这一事实使得构建健壮的 HOC 需要大量的样板代码（boilerplate code）。

### Render Props

我会这么定义 render prop：

> 一个 render prop 是一个类型为函数的 prop，它让组件知道该渲染什么。

更通俗的说法是：不同于通过 “混入” 或者装饰来共享组件行为，**一个普通组件只需要一个函数 prop 就能够进行一些 state 共享**。

继续到上面的例子，我们将通过一个类型为函数的 `render` 的 prop 来简化 `withMouse` HOC 到一个普通的 `<Mouse>` 组件。然后，在 `<Mouse>` 的 `render` 方法中，我们可以使用一个 render prop 来让组件知道如何渲染：

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
// 与 HOC 不同，我们可以使用具有 render prop 的普通组件来共享代码
class Mouse extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
  };
  state = { x: 0, y: 0 };
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };
  render() {
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}
const App = React.createClass({
  render() {
    return (
      <div style={{ height: "100%" }}>
        <Mouse
          render={({ x, y }) => (
            // render prop 给了我们所需要的 state 来渲染我们想要的
            <h1>
              The mouse position is ({x}, {y})
            </h1>
          )}
        />
      </div>
    );
  },
});
ReactDOM.render(<App />, document.getElementById("app"));
```

这里需要明确的概念是，`<Mouse>` 组件实际上是调用了它的 `render` 方法来将它的 state 暴露给 `<App>` 组件。因此，`<App>` 可以随便按自己的想法使用这个 state，这太美妙了。

在此，我想说明，“children as a function” 是一个 **完全相同的概念**，只是用 `children` prop 替代了 `render` prop。我挂在嘴边的 `render prop` 并不是在强调一个 **名叫** `prop` 的 prop，而是在强调你使用一个 prop 去进行渲染的概念。

该技术规避了所有 mixin 和 HOC 会面对的问题：

- **ES6 class**。不成问题，我们可以在 ES6 class 创建的组件中使用 render prop。
- **不够直接**。我们不必再担心 state 或者 props 来自哪里。我们可以看到通过 render prop 的参数列表看到有哪些 state 或者 props 可供使用。
- **名字冲突**。现在不会有任何的自动属性名称合并，因此，名字冲突将全无可乘之机。

并且，render prop 也不会引入 **任何繁文缛节**，因为你不会 **包裹** 和 **装饰** 其他的组件。它仅仅是一个函数！如果你使用了 TypeScript 或者 Flow，你会发现相较于 HOC，现在很容易为你具有 render prop 的组件写一个类型定义。当然，这是另外一个话题了。

另外，这里的组合模型是 **动态的**！每次组合都发生在 render 内部，因此，我们就能利用到 React 生命周期以及自然流动的 props 和 state 带来的优势。

使用这个模式，你可以将 **任何** HOC 替换一个具有 render prop 的一般组件。这点我们可以证明！😅

### Render Props > HOC

一个更将强有力的，能够证明 render prop 比 HOC 要强大的证据是，任何 HOC 都能使用 render prop 替代，反之则不然。下面的代码展示了使用一个一般的、具有 render prop 的 `<Mouse>` 组件来实现的 `withMouse` HOC：

```jsx
const withMouse = (Component) => {
  return class extends React.Component {
    render() {
      return (
        <Mouse
          render={(mouse) => <Component {...this.props} mouse={mouse} />}
        />
      );
    }
  };
};
```

### mixin、hoc、render props、react-hooks 的优劣如何？

- Mixin 的缺陷：

组件与 Mixin 之间存在隐式依赖（Mixin 经常依赖组件的特定方法，但在定义组件时并不知道这种依赖关系）

多个 Mixin 之间可能产生冲突（比如定义了相同的 state 字段）

Mixin 倾向于增加更多状态，这降低了应用的可预测性（The more state in your application, the harder it is to reason about it.），导致复杂度剧增

隐式依赖导致依赖关系不透明，维护成本和理解成本迅速攀升：

难以快速理解组件行为，需要全盘了解所有依赖 Mixin 的扩展行为，及其之间的相互影响

组价自身的方法和 state 字段不敢轻易删改，因为难以确定有没有 Mixin 依赖它

Mixin 也难以维护，因为 Mixin 逻辑最后会被打平合并到一起，很难搞清楚一个 Mixin 的输入输出

- HOC 相比 Mixin 的优势:

HOC 通过外层组件通过 Props 影响内层组件的状态，而不是直接改变其 State 不存在冲突和互相干扰,这就降低了耦合度
不同于 Mixin 的打平+合并，HOC 具有天然的层级结构（组件树结构），这又降低了复杂度

- HOC 的缺陷:

扩展性限制: HOC 无法从外部访问子组件的 State 因此无法通过 shouldComponentUpdate 滤掉不必要的更新,React 在支持 ES6 Class 之后提供了 React.PureComponent 来解决这个问题
Ref 传递问题: Ref 被隔断,后来的 React.forwardRef 来解决这个问题
Wrapper Hell: HOC 可能出现多层包裹组件的情况,多层抽象同样增加了复杂度和理解成本
命名冲突: 如果高阶组件多次嵌套,没有使用命名空间的话会产生冲突,然后覆盖老属性
不可见性: HOC 相当于在原有组件外层再包装一个组件,你压根不知道外层的包装是啥,对于你是黑盒

- Render Props 优点:

上述 HOC 的缺点 Render Props 都可以解决

- Render Props 缺陷:

使用繁琐: HOC 使用只需要借助装饰器语法通常一行代码就可以进行复用,Render Props 无法做到如此简单
嵌套过深: Render Props 虽然摆脱了组件多层嵌套的问题,但是转化为了函数回调的嵌套

- React Hooks 优点:

简洁: React Hooks 解决了 HOC 和 Render Props 的嵌套问题,更加简洁
解耦: React Hooks 可以更方便地把 UI 和状态分离,做到更彻底的解耦
组合: Hooks 中可以引用另外的 Hooks 形成新的 Hooks,组合变化万千
函数友好: React Hooks 为函数组件而生,从而解决了类组件的几大问题

this 指向容易错误
分割在不同声明周期中的逻辑使得代码难以理解和维护
代码复用成本高（高阶组件容易使代码量剧增）

- React Hooks 缺陷:

额外的学习成本（Functional Component 与 Class Component 之间的困惑）

写法上有限制（不能出现在条件、循环中），并且写法限制增加了重构成本

破坏了 PureComponent、React.memo 浅比较的性能优化效果（为了取最新的 props 和 state，每次 render()都要重新创建事件处函数）

在闭包场景可能会引用到旧的 state、props 值

内部实现上不直观（依赖一份可变的全局状态，不再那么“纯”）

React.memo 并不能完全替代 shouldComponentUpdate（因为拿不到 state change，只针对 props change）

## 问答环节

::: warning 问
React 如何进行组件/逻辑复用?
:::

::: tip 答
抛开已经被官方弃用的 Mixin,组件抽象的技术目前有三种比较主流:

- 高阶组件:
  - 属性代理
  - 反向继承
- 渲染属性
- react-hooks

:::
