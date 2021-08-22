---
title: React 推荐写法
---
## React 推荐写法

### **基本规范**

- 每个文件只包含的一个 React 组件：
  - 联系紧密的组件可以使用「命名空间」的形式；
  - 每个文件中可包含多个纯函数组件。
- 始终使用 JSX 语法，不要使用`React.createElement`创建 ReactElement，以提高编写速度、可读性、可维护性（没有 JSX 转换的特殊场景例外，如在`console`中测试组件）。

#### 文件规范

- 组件文件使用一致的`.js`或`.jsx`后缀。所有组件文件的后缀名从`.js`或`.jsx`中任选其一。不应在项目中出现部分组件为`.js`文件，部分为`.jsx`的情况。
- 每个存放组件的目录使用一个`index.js/index.jsx`以命名导出的形式暴露所有组件。同目录内的组件相互引用使用`import Foo from './Foo';`进行。引用其它目录的组件使用`import {Foo} from '../component';`进行。

#### 命名规范

- 文件名：使用**大驼峰命名法（PascalCase）**，如 MyComponent.jsx；
- 组件命名：组件名称和文件名一致，如 MyComponent.jsx 里的组件名应该是 MyComponent；一个目录的根组件使用 index.jsx 命名，以目录名称作为组件名称；
- 引用命名：React 组件使用大驼峰命名法（PascalCase）；
- 高阶组件使用 camelCase 命名。高阶组件事实上并非一个组件，而是一个“生成组件类型”的函数，因此遵守 JavaScript 函数命名的规范，使用 camelCase 命名。
- 使用`onXxx`形式作为`props`中用于回调的属性名称。使用统一的命名规则用以区分`props`中回调和非回调部分的属性，在 JSX 上可以清晰地看到一个组件向上和向下的逻辑交互。
- 使用 withXxx 或 xxxable 形式的词作为高阶组件的名称。高阶组件是为组件添加行为和功能的函数，因此使用如上形式的词有助于对其功能进行理解。

#### 带命名空间的组件

- 如果一个组件有许多关联子组件，可以以该组件作为命名空间编写、调用子组件。

```js
class Form extends React.Component {
  // ...
}
class Row extends React.Component {}
class Label extends React.Component {}
class Input extends React.Component {}
Form.Row = Row;
Form.Label = Label;
Form.Input = Input;
export default Form;
// refence Form component
import Form from "./Form";
const App = (
  <Form>
    <Form.Row>
      <Form.Label />
      <Form.Input />
    </Form.Row>
  </Form>
);
```

### 属性

#### 属性设置

- 在组件行内设置属性（以便 propTypes 校验），不要在外部改变属性的值；
- 属性较多使用`{…this.props}`语法；

```js
// good
const props = {};
props.foo = x;
props.bar = y;
const component = <Component {...props} />;
```

- 属性值明确为`true`时，省略值。

#### 属性对齐方式

- 属性较少时可以行内排列；
- 属性较多时每行一个属性，闭合标签单独成行。

```j s
// bad - too long
<input type="text" value={this.state.newDinosaurName} onChange={this.inputHandler.bind(this, 'newDinosaurName')} />
// bad - aligning attributes after the tag
<input type="text"
       value={this.state.newDinosaurName}
       onChange={this.inputHandler.bind(this, 'newDinosaurName')} />
// good
<input
  type="text"
  value={this.state.newDinosaurName}
  onChange={this.inputHandler.bind(this, 'newDinosaurName')}
 />
```

#### 属性空格

- 属性`=`前后不要添加空格
- JSX 中的花括号前后不要添加空格。

```js
// bad
<Foo bar={ baz } foo = "bar" />
// good
<Foo bar={baz} foo="bar" />
// good { left: '20px' } 为一个对象
<Foo style={{ left: '20px' }} />
```

#### `propTypes`及默认值

- 组件属性都应该在`propTypes`中声明类型；
- 始终明确指定非必选属性的默认值。

```js
// bad
function SFC({ foo, bar, children }) {
  return (
    <div>
      {foo}
      {bar}
      {children}
    </div>
  );
}

// good
function SFC({ foo, bar, children }) {
  return (
    <div>
      {foo}
      {bar}
      {children}
    </div>
  );
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};
SFC.defaultProps = {
  bar: "",
  children: null,
};
```

### 引号

- JSX 属性使用**双引号**`"`；
- JS 使用**单引号**`'`；

#### `()`使用

- 多行的 JSX 使用 () 包裹，有组件嵌套时使用多行模式；

```js
// bad
return (
  <div>
    <ComponentOne />
    <ComponentTwo />
  </div>
);
// good
var multilineJsx = (
  <header>
    <Logo />
    <Nav />
  </header>
);
// good
return (
  <div>
    <ComponentOne />
    <ComponentTwo />
  </div>
);
```

- 单行 JSX 省略 ()

#### 自闭合标签

- 自闭合所有没有子组件的标签；
- 自闭合标签`/`前留一个空格。

```js
// bad
<Logo></Logo>
// very bad
<Foo                 />
// bad
<Foo
 />
// good
<Logo />
```

#### 方法

- 事件函数用`public class fields`型

```js
// good
class Foo extends React.Component {
  handleClick = () => {
    this.setState({ xxx: aaa });
  };
  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
// bad
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click me</button>;
  }
}
```

- 事件处理方法以 handle 开头，如 handleClick() {}，用 on 的作为回调做区分

#### 组件代码组织

- 按照生命周期顺序组织组件的属性、方法；
- 方法（属性）之间空一行；
- `render()`方法始终放在最后；
- 自定义方法 React API 方法之后、`render()`之前；
- `class extends React.Component`顺序：
  - `static`属性
  - `static`方法
  - `constructor`
  - `getChildContext`
  - `componentWillMount`
  - `componentDidMount`
  - `componentWillReceiveProps`
  - `shouldComponentUpdate`
  - `componentWillUpdate`
  - `componentDidUpdate`
  - `componentWillUnmount`
  - _点击处理函数或者其他事件处理函数_，如`onClickSubmit()`或`onChangeDescription()`
  - `render`的 getter 方法，如`getSelectReason()`或`getFooterContent()`
  - _可选的 render 方法_，如`renderNavigation()`或`renderProfilePicture()`
  - `render`
- 定义 propTypes, defaultProps, contextTypes

### 六、团队其它规范

- 6.1、尽量不手动操作 DOM

```
因为团队现在使用 vue 框架，所以在项目开发中尽量使用 vue 的特性去满足我们的需求，尽量（不到万不得已）不要手动操作 DOM，包括：增删改 dom 元素、以及更改样式、添加事件等。
```

- 6.2、删除弃用代码

```
很多时候有些代码已经没有用了，但是没有及时去删除，这样导致代码里面包括很多注释的代码块，好的习惯是提交代码前记得删除已经确认弃用的代码，例如：一些调试的 console 语句、无用的弃用代码。
```

- 6.3、保持必要的注释

```
代码注释不是越多越好，保持必要的业务逻辑注释，至于函数的用途、代码逻辑等，要通过语义化的命令、简单明了的代码逻辑，来让阅读代码的人快速看懂。
```

::: tip
React + TypeScript最佳实践 ⭐️
<https://juejin.cn/post/6952696734078369828/>
:::
