---
title: React生态-Router
---

## 基本概念

### 客户端路由实现的思想

- 基于 hash 的路由：通过监听hashchange事件，感知 hash 的变化
    - 改变 hash 可以直接通过 location.hash=xxx

- 基于 H5 history 路由：
    - 改变 url 可以通过 history.pushState 和 resplaceState 等，会将URL压入堆栈，同时能够应用 history.go() 等 API
    - 监听 url 的变化可以通过自定义事件触发实现

### react-router 实现的思想

- 基于 history 库来实现上述不同的客户端路由实现思想，并且能够保存历史记录等，磨平浏览器差异，上层无感知

- 通过维护的列表，在每次 URL 发生变化的回收，通过配置的 路由路径，匹配到对应的 Component，并且 render

## React-Router的路由有几种模式？

React-Router 支持使用 hash（对应 HashRouter）和 browser（对应 BrowserRouter） 两种路由规则， react-router-dom 提供了 BrowserRouter 和 HashRouter 两个组件来实现应用的 UI 和 URL 同步：

- BrowserRouter 创建的 URL 格式：xxx.com/path
- HashRouter 创建的 URL 格式：xxx.com/#/path

### BrowserRouter

它使用 HTML5 提供的 history API（pushState、replaceState 和 popstate 事件）来保持 UI 和 URL 的同步。由此可以看出，BrowserRouter 是使用 HTML 5 的 history API 来控制路由跳转的：

```js
<BrowserRouter
    basename={string}
    forceRefresh={bool}
    getUserConfirmation={func}
    keyLength={number}
/>
```

其中的属性如下：

basename 所有路由的基准 URL。basename 的正确格式是前面有一个前导斜杠，但不能有尾部斜杠；

```js
<BrowserRouter basename="/calendar">
    <Link to="/today" />
</BrowserRouter>

```

等同于

```js
<a href="/calendar/today" />
```

- forceRefresh 如果为 true，在导航的过程中整个页面将会刷新。一般情况下，只有在不支持 HTML5 history API 的浏览器中使用此功能；

- getUserConfirmation 用于确认导航的函数，默认使用 window.confirm。例如，当从 /a 导航至 /b 时，会使用默认的 confirm 函数弹出一个提示，用户点击确定后才进行导航，否则不做任何处理；

```js
// 这是默认的确认函数
const getConfirmation = (message, callback) => {
  const allowTransition = window.confirm(message);
  callback(allowTransition);
}
<BrowserRouter getUserConfirmation={getConfirmation} />

```

> 需要配合<"Prompt> 一起使用。
KeyLength 用来设置 Location.Key 的长度。

### HashRouter

使用 URL 的 hash 部分（即 window.location.hash）来保持 UI 和 URL 的同步。由此可以看出，HashRouter 是通过 URL 的 hash 属性来控制路由跳转的：

```js
<HashRouter
    basename={string}
    getUserConfirmation={func}
    hashType={string}  
/>
```

其参数如下：

- basename, getUserConfirmation 和 BrowserRouter 功能一样；
- hashType window.location.hash 使用的 hash 类型，有如下几种：
    - slash - 后面跟一个斜杠，例如 #/ 和 #/sunshine/lollipops；
    - noslash - 后面没有斜杠，例如 # 和 #sunshine/lollipops；
    - hashbang - Google 风格的 ajax crawlable，例如 #!/ 和 #!/sunshine/lollipops。

## React Router V6

对于这次的改动，笔者的建议是：如果是新项目，可以尝试新版本的 Rouer，对于老项目，建议还是不要尝试升级 v6 ，升级的代价是会造成大量的功能改动，而且如果用到了依赖于 router 的第三方库，可能会让这些库失效。 所以一些依赖于 react-router 的第三方库，也需要升级去迎合 v6 版本了，比如笔者之前的缓存页面功能的 react-keepalive-router，也会有大版本的更新。

### V5和V6的区别

- 组件层面上
    - 老版本路由采用了 Router Switch Route 结构，Router -> 传递状态，负责派发更新；Switch -> 匹配唯一路由 ；Route -> 真实渲染路由组件。
    - 新版本路由采用了 Router Routes Route 结构，Router 为了抽离一 context；Routes -> 形成路由渲染分支，渲染路由；Route 并非渲染真实路由，而是形成路由分支结构。

- 使用层面上
    - 老版本路由，对于嵌套路由，配置二级路由，需要写在具体的业务组件中。
    - 新版本路由，在外层统一配置路由结构，让路由结构更清晰，通过 Outlet 来实现子代路由的渲染，一定程度上有点类似于 vue 中的 view-router。
    - 新版本做了 API 的大调整，比如 useHistory 变成了 useNavigate，减少了一些 API ，增加了一些新的 api 。


- 原理层面上
    - 老版本的路由本质在于 Route 组件，当路由上下文 context 改变的时候，Route 组件重新渲染，然后通过匹配来确定业务组件是否渲染。
    - 新版本的路由本质在于 Routes 组件，当 location 上下文改变的时候，Routes 重新渲染，重新形成渲染分支，然后通过 provider 方式逐层传递 Outlet，进行匹配渲染。


## 推荐阅读

- [「React进阶」react-router v6 通关指南](https://mp.weixin.qq.com/s/2JKbUHVeEMTFegtLYslfyQ)

- [现代化 React 路由 Hook router 的使用](https://mp.weixin.qq.com/s/AWHvebp19QfwyBGOim6Tjw)

- [一文搞定 React 路由](https://juejin.cn/post/6919638401641611271)

- [图解 React-router 带你深入理解路由本质](https://mp.weixin.qq.com/s/H4j_93na_TlIWJ_7tW_moA)
