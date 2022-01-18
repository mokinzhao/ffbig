---
title: Javascript异步-Generator
---

## 基本用法

generator函数跟普通函数在写法上的区别就是，多了一个星号*，并且只有在generator函数中才能使用yield，什么是yield呢，他相当于generator函数执行的中途暂停点，比如下方有3个暂停点。而怎么才能暂停后继续走呢？那就得使用到next方法，next方法执行后会返回一个对象，对象中有value 和 done两个属性

- value：暂停点后面接的值，也就是yield后面接的值
- done：是否generator函数已走完，没走完为false，走完为true

```js
function* gen() {
  yield 1
  yield 2
  yield 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: undefined, done: true }

```

- 可以看到最后一个是undefined，这取决于你generator函数有无返回值

```js
function* gen() {
  yield 1
  yield 2
  yield 3
  return 4
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: 4, done: true }

```

- yield后面接函数

yield后面接函数的话，到了对应暂停点yield，会马上执行此函数，并且该函数的执行返回值，会被当做此暂停点对象的value

```js
function fn(num) {
  console.log(num)
  return num
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) 
// 1
// { value: 1, done: false }
console.log(g.next())
// 2
//  { value: 2, done: false }
console.log(g.next()) 
// { value: 3, done: true }

```

- yield后面接Promise

前面说了,函数执行返回值会当做暂停点对象的value值，那么下面例子就可以理解了，前两个的value都是pending状态的Promise对象

```js
function fn(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num)
    }, 1000)
  })
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: 3, done: true }

```

- 我们想要的结果是，两个Promise的结果1 和 2，那怎么做呢？很简单，使用Promise的then方法就行了

```js
const g = gen()
const next1 = g.next()
next1.value.then(res1 => {
  console.log(next1) // 1秒后输出 { value: Promise { 1 }, done: false }
  console.log(res1) // 1秒后输出 1

  const next2 = g.next()
  next2.value.then(res2 => {
    console.log(next2) // 2秒后输出 { value: Promise { 2 }, done: false }
    console.log(res2) // 2秒后输出 2
    console.log(g.next()) // 2秒后输出 { value: 3, done: true }
  })
})

```

- next函数传参

generator函数可以用next方法来传参，并且可以通过yield来接收这个参数，注意两点

  - 第一次next传参是没用的，只有从第二次开始next传参才有用

  - next传值时，要记住顺序是，先右边yield，后左边接收参数

```js
function* gen() {
  const num1 = yield 1
  console.log(num1)
  const num2 = yield 2
  console.log(num2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next(11111))
// 11111
//  { value: 2, done: false }
console.log(g.next(22222)) 
// 22222
// { value: 3, done: true }
```

- Promise+next传参

```js
function fn(nums){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(nums * 2)
        },1000)
    })
}

function * gen(){
    const num1 = yield fn(1)
    const num2 = yield fn(num1)
    const num3 = yield fn(num2)
    return num3
}

const g =gen()
const next1=g.next()
next1.value.then(res1=>{
    console.log(next1) //1秒后同时输出{ value:Promise{ 2 }, done: false }
    console.log(res1)  //1秒后同时输出2

    const next2 =g.next(res1) //传入上次的res2
    next3.
})
```

## 手写实现

```js
function createIterator(items) {
    let i = 0
    return {
        next: function () {
            let done = (i >= items.length)
            let value = !done ? items[i++] : undefined
            return {
                done: done,
                value: value
            }
        }
        [Symbol.iterator]: function () {
        	return this
    	}
    }
}
//测试
let iterator = createIterator([1, 2, 3])
...iterator // 1, 2, 3

//1.for...of...接收可迭代对象,能强制转换或包装可迭代对象的值;
//2.遍历时，for...of会获取可迭代对象的'Symbol.iterator'，对该迭代器逐次调用next()，直到迭代器返回对象的done属性为true时，遍历结束，不对该value处理;
//3.所以可以利用 for...of...封装到原型链上.


Object.prototype[Symbol.iterator] = function* () {
    for (const key in this) {
        if (this.hasOwnProperty(key)) {
            yield [key, this[key]]
        }
    }
}
```
