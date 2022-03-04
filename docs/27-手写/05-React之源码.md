---
title: React之源码
---

## mini-React

```js

```

- react的diff算法优化方式 怎么从o(n)3 优化到o(n) 怎么优化的element diff

- react的fiber为什么要用链表



## Render



## 其他API

### 实现memo()

```js
/**
 * @param {Function} func
 * @param {(args:[]) => string }  [resolver] - cache key generator
 */
function memo(func, resolver) {
  const map = new Map();
  return function (...params) {
    let key
    if (typeof resolver === 'function') {
      key = resolver(...params)
    } else {
      key = [...params].join('-')
    }
    if (map.has(key)) {
      return map.get(key)
    } else {
      const val = func.apply(this, [...params])
      map.set(key, val)
      return val
    }
  }
}

```

## 其他

### 如何使用React.createElement?

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
)
```

- 实现

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);

```



## 参考

![手把手带你实现一个铂金段位的 React](https://juejin.cn/post/6978654109893132318)







