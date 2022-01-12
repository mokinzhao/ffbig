---
title: Vue之常见函数
---

## Vue 之常见函数

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