---
title: JavaScript之工具函数
---

## 常用工具函数

### 防抖(debounce)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/4/16f6eba8e2d1fc04~tplv-t2oaga2asx-watermark.awebp)

函数防抖指的是一定时间内没有再次触发函数，就执行该函数，否则重新计时。

```js
const debounce = (fn, delay = 1000) => {
  let timer= null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};
```

### 节流(throttle)

函数节流指的是规定某个时间内只能执行一次函数。

```js
//- 定时器
const throttle = (fn, delay) => {
  let timer = null;
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, arguments);
      }, delay);
    }
  };
};

//时间戳
const throttle = (fn, wait = 300) => {
    let prev = 0
    let result
    return function(...args) {
        let now = +new Date()
        if(now - prev > wait) {
            prev = now
            return result = fn.apply(this, ...args)
        }
    }
}
/*
方法	使用时间戳	使用定时器
开始触发时	立刻执行	n秒后执行
停止触发后	不再执行事件	继续执行一次事件
*/
```

### 函数克里化

柯里化就是把接受「多个参数」的函数变换成接受一个「单一参数」的函数，并且返回接受「余下参数」返回结果的一种应用。
原理是利用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数

- 延迟计算 （用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，开始执行函数）
- 动态创建函数 （参数不够时会返回接受剩下参数的函数)
- 参数复用（每个参数可以多次复用）

```js

//写法一
let currying = (fn, ...args) =>
            fn.length > args.length ?
            (...arguments) => currying(fn, ...args, ...arguments) :
            fn(...args)

//写法二
function curry(func){
    return function curried(...args){
        //关键知识点：function.length 用来获取函数到形参个数
        //补充：arguments.length 获取到是实参个数
        if(args.length>=func.length){
            return func.apply(this,args)
        }
        return function (...args2){
            return curried.apply(this,args.concat(args2))
        }
    }
}

//-测试-
function sum (a, b, c) {
  return a + b + c
}
const curriedSum = curry(sum)
console.log(curriedSum(1, 2, 3))
console.log(curriedSum(1)(2,3))
console.log(curriedSum(1)(2)(3))

//写法三
const curry = (func, ...args) => {
  // 获取函数的参数个数
  const fnLen = func.length
  return function (...innerArgs) {
    innerArgs = args.concat(innerArgs)
    // 参数未搜集足的话，继续递归搜集
    if (innerArgs.length < fnLen) {
      return curry.call(this, func, ...innerArgs)
    } else {
      // 否则拿着搜集的参数调用func
      func.apply(this, innerArgs)
    }
  }
}

// -测试-
const add=curry((num1,num2,num3)=>{
console.log(num1+ num2+num3)
})

add(1)(2)(3）//6  
add(1,2,3)  //6
add(1)(2,3) //6

```

### 浅拷贝

- Object.assign()

Object.assign() 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。

```js
let obj1 = { person: {name: "kobe", age: 41},sports:'basketball' };
let obj2 = Object.assign({}, obj1);
obj2.person.name = "wade";
obj2.sports = 'football'
console.log(obj1); // { person: { name: 'wade', age: 41 }, sports: 'basketball' }

```

- 展开运算符...

展开运算符是一个 es6 / es2015特性，它提供了一种非常方便的方式来执行浅拷贝，这与 Object.assign ()的功能相同。

```js
let obj1 = { name: 'Kobe', address:{x:100,y:100}}
let obj2= {... obj1}
obj1.address.x = 200;
obj1.name = 'wade'
console.log('obj2',obj2) // obj2 { name: 'Kobe', address: { x: 200, y: 100 } }

```

- 数组方法concat()和slice()

```js
//4.Array.prototype.concat()
let arr = [1, 3, {
    username: 'kobe'
    }];
let arr2 = arr.concat();    
arr2[2].username = 'wade';
console.log(arr); //[ 1, 3, { username: 'wade' } ]

//5.Array.prototype.slice()
let arr = [1, 3, {
    username: ' kobe'
    }];
let arr3 = arr.slice();
arr3[2].username = 'wade'
console.log(arr); // [ 1, 3, { username: 'wade' } ]
```

- 函数库lodash的_.clone方法

该函数库也有提供_.clone用来做 Shallow Copy,后面我们会再介绍利用这个库实现深拷贝。

```js
var _ = require('lodash');
var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
var obj2 = _.clone(obj1);
console.log(obj1.b.f === obj2.b.f);// true

```

### 深拷贝

- JSON.parse(JSON.stringify())

利用JSON.stringify将对象转成JSON字符串，再用JSON.parse把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。
这种方法虽然可以实现数组或对象深拷贝,但不能处理函数和正则，因为这两者基于JSON.stringify和JSON.parse处理后，得到的正则就不再是正则（变为空对象），得到的函数就不再是函数（变为null）了。

- 缺点：

 1. 他无法实现函数、RegExp等特殊对象的克隆

 2. 会抛弃对象的constructor，所有的构造函数会指向Object

 3. 对象有循环引用，会报错

```js
let arr = [1, 3, {
    username: ' kobe'
}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan'; 
console.log(arr, arr4)

```

- 函数库lodash的_.cloneDeep方法

该函数库也有提供_.cloneDeep用来做 Deep Copy

```js
var _ = require('lodash');
var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);// false
```

- 深拷贝(面试可用版)




- 深拷贝(尤雨溪)




- 深拷贝(完美版)


