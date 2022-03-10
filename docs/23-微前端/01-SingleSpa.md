---
title: 微前端之SingleSpa
---

## single-spa 微前端四大特性

- 受路由控制渲染的子应用（applications）
- 不受路由控制的组件（parcels）
- 非渲染组件，应用间通信逻辑（utility modules）
- root config 作为子应用通信的路由配置,所有子应用的特殊处理情况都是需要在 root config 做处理的

## 优点

- 增量升级（影响范围小）

- 支持多框架（灵活框架无关性）

- 独立部署（项目隔离）

- 共享组件库（便捷）

- 团队自治 （沟通成本小）

## 缺点

1. 对微应用的侵入性太强

single-spa 采用 JS Entry 的方式接入微应用。微应用改造一般分为三步：

- 微应用路由改造，添加一个特定的前缀
- 微应用入口改造，挂载点变更和生命周期函数导出
- 打包工具配置更改

侵入型强其实说的就是第三点，更改打包工具的配置，使用 single-spa 接入微应用需要将微应用整个打包成一个 JS 文件，发布到静态资源服务器，然后在主应用中配置该 JS 文件的地址告诉 single-spa 去这个地址加载微应用。

不说其它的，就现在这个改动就存在很大的问题，将整个微应用打包成一个 JS 文件，常见的打包优化基本上都没了，比如：按需加载、首屏资源加载优化、css 独立打包等优化措施。

项目发布以后出现了 bug ，修复之后需要更新上线，为了清除浏览器缓存带来的影响，一般文件名会带上 chunkcontent，微应用发布之后文件名都会发生变化，这时候还需要更新主应用中微应用配置，然后重新编译主应用然后发布，这套操作简直是不能忍受的，这也是 微前端框架 之 single-spa 从入门到精通 这篇文章中示例项目中微应用发布时的环境配置选择 development 的原因。

2. 样式隔离问题

single-spa 没有做这部分的工作。一个大型的系统会有很的微应用组成，怎么保证这些微应用之间的样式互不影响？微应用和主应用之间的样式互不影响？这时只能通过约定命名规范来实现，比如应用样式以自己的应用名称开头，以应用名构造一个独立的命名空间，这个方式新系统还好说，如果是一个已有的系统，这个改造工作量可不小。

3. JS 隔离

这部分工作 single-spa 也没有做。 JS 全局对象污染是一个很常见的现象，比如：微应用 A 在全局对象上添加了一个自己特有的属性，window.A，这时候切换到微应用 B，这时候如何保证 window 对象是干净的呢？

4. 资源预加载

这部分的工作 single-spa 更没做了，毕竟将微应用整个打包成一个 js 文件。现在有个需求，比如为了提高系统的用户体验，在第一个微应用挂载完成后，需要让浏览器在后台悄悄的加载其它微应用的静态资源，这个怎么实现呢？

5. 应用间通信

这部分工作 single-spa 没做，它只在注册微应用时给微应用注入一些状态信息，后续就不管了，没有任何通信的手段，只能用户自己去实现


## 手写single-spa框架

```js
// 实现子应用的注册、挂载、切换、卸载功能

/**
 * 子应用状态
 */
// 子应用注册以后的初始状态
const NOT_LOADED = 'NOT_LOADED'
// 表示正在加载子应用源代码
const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'
// 执行完 app.loadApp，即子应用加载完以后的状态
const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'
// 正在初始化
const BOOTSTRAPPING = 'BOOTSTRAPPING'
// 执行 app.bootstrap 之后的状态，表是初始化完成，处于未挂载的状态
const NOT_MOUNTED = 'NOT_MOUNTED'
// 正在挂载
const MOUNTING = 'MOUNTING'
// 挂载完成，app.mount 执行完毕
const MOUNTED = 'MOUNTED'
const UPDATING = 'UPDATING'
// 正在卸载
const UNMOUNTING = 'UNMOUNTING'
// 以下三种状态这里没有涉及
const UNLOADING = 'UNLOADING'
const LOAD_ERROR = 'LOAD_ERROR'
const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'

// 存放所有的子应用
const apps = []

/**
 * 注册子应用
 * @param {*} appConfig = {
 *    name: '',
 *    app: promise function,
 *    activeWhen: location => location.pathname.startsWith(path),
 *    customProps: {}
 * }
 */
export function registerApplication (appConfig) {
  apps.push(Object.assign({}, appConfig, { status: NOT_LOADED }))
  reroute()
}

// 启动
let isStarted = false
export function start () {
  isStarted = true
}

function reroute () {
  // 三类 app
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges()
  if (isStarted) {
    performAppChanges()
  } else {
    loadApps()
  }

  function loadApps () {
    appsToLoad.map(toLoad)
  }

  function performAppChanges () {
    // 卸载
    appsToUnmount.map(toUnmount)
    // 初始化 + 挂载
    appsToMount.map(tryToBoostrapAndMount)
  }
}

/**
 * 挂载应用
 * @param {*} app 
 */
async function tryToBoostrapAndMount(app) {
  if (shouldBeActive(app)) {
    // 正在初始化
    app.status = BOOTSTRAPPING
    // 初始化
    await app.bootstrap(app.customProps)
    // 初始化完成
    app.status = NOT_MOUNTED
    // 第二次判断是为了防止中途用户切换路由
    if (shouldBeActive(app)) {
      // 正在挂载
      app.status = MOUNTING
      // 挂载
      await app.mount(app.customProps)
      // 挂载完成
      app.status = MOUNTED
    }
  }
}

/**
 * 卸载应用
 * @param {*} app 
 */
async function toUnmount (app) {
  if (app.status !== 'MOUNTED') return app
  // 更新状态为正在卸载
  app.status = MOUNTING
  // 执行卸载
  await app.unmount(app.customProps)
  // 卸载完成
  app.status = NOT_MOUNTED
  return app
}

/**
 * 加载子应用
 * @param {*} app 
 */
async function toLoad (app) {
  if (app.status !== NOT_LOADED) return app
  // 更改状态为正在加载
  app.status = LOADING_SOURCE_CODE
  // 加载 app
  const res = await app.app()
  // 加载完成
  app.status = NOT_BOOTSTRAPPED
  // 将子应用导出的生命周期函数挂载到 app 对象上
  app.bootstrap = res.bootstrap
  app.mount = res.mount
  app.unmount = res.unmount
  app.unload = res.unload
  // 加载完以后执行 reroute 尝试挂载
  reroute()
  return app
}

/**
 * 将所有的子应用分为三大类，待加载、待挂载、待卸载
 */
function getAppChanges () {
  const appsToLoad = [],
    appsToMount = [],
    appsToUnmount = []
  
  apps.forEach(app => {
    switch (app.status) {
      // 待加载
      case NOT_LOADED:
        appsToLoad.push(app)
        break
      // 初始化 + 挂载
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        if (shouldBeActive(app)) {
          appsToMount.push(app)
        } 
        break
      // 待卸载
      case MOUNTED:
        if (!shouldBeActive(app)) {
          appsToUnmount.push(app)
        }
        break
    }
  })
  return { appsToLoad, appsToMount, appsToUnmount }
}

/**
 * 应用需要激活吗 ？
 * @param {*} app 
 * return true or false
 */
function shouldBeActive (app) {
  try {
    return app.activeWhen(window.location)
  } catch (err) {
    console.error('shouldBeActive function error', err);
    return false
  }
}

// 让子应用判断自己是否运行在基座应用中
window.singleSpaNavigate = true
// 监听路由
window.addEventListener('hashchange', reroute)
window.history.pushState = patchedUpdateState(window.history.pushState)
window.history.replaceState = patchedUpdateState(window.history.replaceState)
/**
 * 装饰器，增强 pushState 和 replaceState 方法
 * @param {*} updateState 
 */
function patchedUpdateState (updateState) {
  return function (...args) {
    // 当前url
    const urlBefore = window.location.href;
    // pushState or replaceState 的执行结果
    const result = Reflect.apply(updateState, this, args)
    // 执行updateState之后的url
    const urlAfter = window.location.href
    if (urlBefore !== urlAfter) {
      reroute()
    }
    return result
  }
}

```





## 参考

[微前端框架 之 single-spa 从入门到精通](https://juejin.cn/post/6862661545592111111#heading-72)


