---
title: React之常见函数
---

## miniReact

```js
sadsda

```

## Render

## Hooks

- useState

```js

```

- 实现memo()

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

## miniRedux

- useState

```js
```


