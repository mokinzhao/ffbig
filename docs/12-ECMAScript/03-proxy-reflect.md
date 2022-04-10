---
title: Proxy/Reflect
---

## 概念

Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与  Proxy 的方法相同。Reflect不是一个函数对象，因此它是不可构造的。

## 基本用法

Proxy跟Reflect是非常完美的配合，例子如下：

```js
const observe = (data, callback) => {
      return new Proxy(data, {
            get(target, key) {
                return Reflect.get(target, key)
            },
            set(target, key, value, proxy) {
                  callback(key, value);
                  target[key] = value;
                    return Reflect.set(target, key, value, proxy)
            }
      })
}

const FooBar = { open: false };
const FooBarObserver = observe(FooBar, (property, value) => {
  property === 'open' && value 
          ? console.log('FooBar is open!!!') 
          : console.log('keep waiting');
});
console.log(FooBarObserver.open) // false
FooBarObserver.open = true // FooBar is open!!!
```

当然也不是什么都可以被代理的，如果对象带有configurable: false 跟writable: false 属性，则代理失效。

## 推荐阅读

[为什么Proxy一定要配合Reflect使用？](https://juejin.cn/post/7080916820353351688)
