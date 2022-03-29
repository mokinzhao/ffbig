---
title: React进阶-组件设计
---

## 组件的分类

![component](https://s0.lgstatic.com/i/image/M00/84/1C/Ciqc1F_TIY-ANgywAAB0DSyjFv4894.png)

### 基础组件

把只作展示、独立运行、不额外增加功能的组件，称为基础组件，或无状态组件，还有一种叫法是展示组件；

- 代理组件

代理组件常用于封装常用属性，减少重复代码。关于代理组件你应该不陌生，可能经常会写。

虽然进行封装感觉是多此一举，但切断了外部组件库的强依赖特性。在大厂中引入外部组件库需要考虑两点：

1. 如果当前组件库不能使用了，是否能实现业务上的无痛切换；

2. 如果需要批量修改基础组件的字段，如何解决？

- 样式组件

- 布局组件

```js
class Layout extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    <div>
      <div>{this.props.NavigationBar}</div>
      <div>{this.props.Article}</div>
      <div>{this.props.BottomBar}</div>
    </div>
  }
}
```

布局组件的基本设计与样式组件完全一样，但它基于自身特性做了一个小小的优化。

由于布局组件无需更新，所以对应到第 3 讲中提到的生命周期，就可以通过写死shouldComponentUpdate 的返回值直接阻断渲染过程。对于大型前端工程，类似的小心思可以带来性能上的提升。当然，这也是基于代理组件更易于维护而带来的好处。

### 业务组件

把处理业务逻辑与数据状态的组件称为有状态组件，或业务组件，业务组件一定包含至少一个灵巧组件或者展示组件。

- 容器组件

- 高阶组件
    - 抽取公共逻辑
    - 链式调用  
    - 渲染劫持
    - 缺陷：
        - 丢失静态函数
        - refs不能透传

常用的场景包括检查登录态，或者为埋点提供封装，减少样板代码量。高阶组件可以组合完成链式调用，如果基于装饰器使用，就更为方便了。高阶组件中还有一个经典用法就是反向劫持，通过重写渲染函数的方式实现某些功能，比如场景的页面加载圈等。但高阶组件也有两个缺陷，第一个是静态方法不能被外部直接调用，需要通过向上层组件复制的方式调用，社区有提供解决方案，使用 hoist-non-react-statics 可以解决；第二个是 refs 不能透传，使用 React.forwardRef API 可以解决

- 进阶

“如何在渲染劫持中为原本的渲染结果添加新的样式？” 这个问题也经常被追问，其实并不难，但是有可能考察手写代码，所以这里我会做一些提示。
首先回滚上面的案例，在调用 super.render 的时候就可以拿到原本的渲染结果。

```js
function withLoading(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            if(this.props.isLoading) {
                return <Loading />;
            } else {
                return super.render();
            }
        }
    };
}
```

## 合理工程实践

```js
src

├── components

│   ├── basic

│   ├── container

│   └── hoc

└── pages

```

- 首先将最基本的展示组件放入 basic 目录中；

- 然后将容器组件放入 container；

- 高阶组件放入 hoc 中；

- 将页面外层组件放在页面目录中；

- 通过目录级别完成切分。

在开发中，针对 basic 组件，建议使用类似 Storybook 的工具进行组件管理。因为Storybook 可以有组织地、高效地构建基础组件，有兴趣的话可以查阅下它的官网。

![](https://s0.lgstatic.com/i/image/M00/84/27/CgqCHl_TIbaAEiBdAAEujtJGnY8994.png)

## 实现组件按需加载

## 组件风格切换（换肤）

## 推荐阅读

[面试官(6): 写过『通用前端组件』吗?](https://juejin.cn/post/6844903847874265101#heading-14)
