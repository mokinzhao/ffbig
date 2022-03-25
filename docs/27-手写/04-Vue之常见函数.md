---
title: Vue之常见函数
---

## Vue 之常见函数

## Proxy 可以实现什么功能？

Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作

```js
let p = new Proxy(target, handler)
```

target 代表需要添加代理的对象，handler 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。

下面来通过 Proxy 来实现一个数据响应式：

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}
let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 监听到属性a改变
p.a // 'a' = 2

```

在上述代码中，通过自定义 set 和 get 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。
当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要在 get 中收集依赖，在 set 派发更新，之所以 Vue3.0 要使用 Proxy 替换原本的 API 原因在于 Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变，唯一缺陷就是浏览器的兼容性不好。

### 实现一个简单双向绑定

- [手写一个简易vue响应式带你了解响应式原理](https://juejin.cn/post/6989106100582744072#heading-2)
![mvvm](https://images2015.cnblogs.com/blog/938664/201705/938664-20170522225458132-1434604303.png)

- Object.defineProperty版本

```js
//定义数据
const data={
    text:'default'
}
//获取标签
const input = document.getElementById('input');
const span  = document.getElementById('span')
//数据劫持
Object.defineProperty(data,'text',{
    get:function(){
        return data.text
    },
    //数据变化  --> 修改视图
    set(newVal){
        input.value =newVal
        span.innerHTML =newVal
    } 
});
    //视图更改 -->数据变化
input.addEventLister('keyup',function(e){
    data.text=e.target.value
});
```

- proxy版本

```js
const data={
    text:'default'
}
const input= document.getElementById('input')
const span = document.getElementById('span')

const handler={
    set(target,key,value){
        target[key]=value
        //数据变化 --> 修改视图
        input.value =value;
        span.innerHTML =value;
        return value;
    }
}
const proxy = new Proxy(data,handler)
//视图更改 --> 数据变化
input.addEventListener('keyup',function(e){
    proxy.text =e.target.value
})
```

### reactive

```js
// Dep module
class Dep {
  static stack = []
  static target = null
  deps = null
  
  constructor() {
    this.deps = new Set()
  }

  depend() {
    if (Dep.target) {
      this.deps.add(Dep.target)
    }
  }

  notify() {
    this.deps.forEach(w => w.update())
  }

  static pushTarget(t) {
    if (this.target) {
      this.stack.push(this.target)
    }
    this.target = t
  }

  static popTarget() {
    this.target = this.stack.pop()
  }
}

// reactive
function reactive(o) {
  if (o && typeof o === 'object') {
    Object.keys(o).forEach(k => {
      defineReactive(o, k, o[k])
    })
  }
  return o
}

function defineReactive(obj, k, val) {
  let dep = new Dep()
  Object.defineProperty(obj, k, {
    get() {
      dep.depend()
      return val
    },
    set(newVal) {
      val = newVal
      dep.notify()
    }
  })
  if (val && typeof val === 'object') {
    reactive(val)
  }
}

// watcher
class Watcher {
  constructor(effect) {
    this.effect = effect
    this.update()
  }

  update() {
    Dep.pushTarget(this)
    this.value = this.effect()
    Dep.popTarget()
    return this.value
  }
}

// 测试代码
const data = reactive({
  msg: 'aaa'
})

new Watcher(() => {
  console.log('===> effect', data.msg);
})

setTimeout(() => {
  data.msg = 'hello'
}, 1000)


```
