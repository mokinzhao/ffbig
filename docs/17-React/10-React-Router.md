---
title: React生态-Router
---

## 基本概念

### 前端路由的诞生

前端技术早期，一个 url 对应一个页面，如果要从 A 页面切换到 B 页面，那么必然伴随着页面的刷新。这个体验并不好，不过在最初也是无奈之举——用户只有在刷新页面的情况下，才可以重新去请求数据。

后来，改变发生了——Ajax 出现了，它允许人们在不刷新页面的情况下发起请求；与之共生的，还有“不刷新页面即可更新页面内容”这种需求。在这样的背景下，出现了 **SPA（单页面应用）**

SPA极大地提升了用户体验，它允许页面在不刷新的情况下更新页面内容，使内容的切换更加流畅。但是在 SPA 诞生之初，人们并没有考虑到“定位”这个问题——在内容切换前后，页面的 URL 都是一样的，这就带来了两个问题：

- SPA 其实并不知道当前的页面“进展到了哪一步”。可能在一个站点下经过了反复的“前进”才终于唤出了某一块内容，但是此时只要刷新一下页面，一切就会被清零，必须重复之前的操作、才可以重新对内容进行定位——SPA 并不会“记住”你的操作。

- 由于有且仅有一个 URL 给页面做映射，这对 SEO 也不够友好，搜索引擎无法收集全面的信息

前端路由可以帮助我们在仅有一个页面的情况下，“记住”用户当前走到了哪一步——为 SPA 中的各个视图匹配一个唯一标识。这意味着用户前进、后退触发的新内容，都会映射到不同的 URL 上去。此时即便他刷新页面，因为当前的 URL 可以标识出他所处的位置，因此内容也不会丢失

那么如何实现这个目的呢？首先要解决两个问题：

- 当用户刷新页面时，浏览器会默认根据当前 URL 对资源进行重新定位（发送请求）。这个动作对 SPA 是不必要的，因为我们的 SPA 作为单页面，无论如何也只会有一个资源与之对应。此时若走正常的请求-刷新流程，反而会使用户的前进后退操作无法被记录。

- 单页面应用对服务端来说，就是一个URL、一套资源，那么如何做到用“不同的URL”来映射不同的视图内容呢？

从这两个问题来看，服务端已经完全救不了这个场景了。所以要靠咱们前端自力更生，不然怎么叫“前端路由”呢？作为前端，可以提供这样的解决思路：

- 拦截用户的刷新操作，避免服务端盲目响应、返回不符合预期的资源内容。把刷新这个动作完全放到前端逻辑里消化掉。

- 感知 URL 的变化。这里不是说要改造 URL、凭空制造出 N 个 URL 来。而是说 URL 还是那个 URL，只不过我们可以给它做一些微小的处理——这些处理并不会影响 URL 本身的性质，不会影响服务器对它的识别，只有我们前端感知的到。一旦我们感知到了，我们就根据这些变化、用 JS 去给它生成不同的内容。

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
