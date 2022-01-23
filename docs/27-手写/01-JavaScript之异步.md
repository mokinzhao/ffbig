---
title: JavaScript之异步
---

## Promise

![Promise流程图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/28/169c500344dfe50a~tplv-t2oaga2asx-watermark.awebp)

### 实现Promise/A+规范的Promise

- Promise/A+规范

    1. Promise存在三个状态(state) pending、fulfilled、rejected
        - pending（等待态）为初始态,并可以转化为fulfilled（成功态）和rejected(失败态)
        - 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
        - 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
        - new Promise ((resole,reject)=>{resolve(value)}) resolve 为成功，接收参数value,状态改变为 fulfilled,不可再次改变为fulfilled,不可再次改变
        - new Promise ((resolve,reject)=>{reject(reason)}) reject 为失败，接收reason，状态改变为rejected,不可再次改变
        - 若是executor 函数报错 直接执行reject();

    2. Promise 有个静态方法叫then,用以处理resolved或rejected状态下的值,支持链式调用
        - then方法接收两个参数onFulfilled和onRejected，这两个参数变量类型是函数，如果不是函数将会被忽略，并且这两个参数都是可选的。
        - then方法必须返回一个新的promise，记作promise2，这也就保证了then方法可以在同一个promise上多次调用。（ps：规范只要求返回promise，并没有明确要求返回一个新的promise，这里为了跟ES6实现保持一致，我们也返回一个新promise）
        - onResolved/onRejected有返回值则把返回值定义为x，并执行[[Resolve]](promise2, x);
        - onResolved/onRejected运行出错，则把promise2设置为rejected状态；
        - onResolved/onRejected不是函数，则需要把promise1的状态传递下去。

    3. 不同的promise可以实现交互
        - 规范中称这一步操作为promise解决过程，函数标示为[[Resolve]](promise, x)，promise为要返回的新promise对象，x为onResolved/onRejected的返回值。如果x有then方法且看上去像一个promise，我们就把x当成一个promise的对象，即thenable对象，这种情况下尝试让promise接收x的状态。如果x不是thenable对象，就用x的值来执行 promise。
        - [[Resolve]](promise, x)函数具体运行规则：
            - 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise;
            - 如果 x 为 Promise ，则使 promise 接受 x 的状态;
            - 如果 x 为对象或者函数，取x.then的值，如果取值时出现错误，则让promise进入rejected状态，如果then不是函数，说明x不是thenable对象，直接以x的值resolve，如果then存在并且为函数，则把x作为then函数的作用域this调用，then方法接收两个参数，resolvePromise和rejectPromise，如果resolvePromise被执行，则以resolvePromise的参数value作为x继续调用[[Resolve]](promise, value)，直到x不是对象或者函数，如果rejectPromise被执行则让promise进入rejected状态；
            - 如果 x 不是对象或者函数，直接就用x的值来执行promise。

- Promise（简单版）

```js
class Promise{
  // Promise构造函数，传入参数为一个可执行的函数
  constructor(executor){
    // 初始化state为等待态
    this.state = 'pending';
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;
    let resolve = value => {
      // state改变,resolve调用就会失败
      if (this.state === 'pending') {
        // resolve调用后，state转化为成功态
        this.state = 'fulfilled';
        // 储存成功的值
        this.value = value;
      }
    };
    let reject = reason => {
      // state改变,reject调用就会失败
      if (this.state === 'pending') {
        // reject调用后，state转化为失败态
        this.state = 'rejected';
        // 储存失败的原因
        this.reason = reason;
      }
    };
    // 如果executor执行报错，直接执行reject
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
    // then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled,onRejected) {
    // 状态为fulfilled，执行onFulfilled，传入成功的值
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    };
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason);
    };
  }
}
```

- Promise(完善版)

```js
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            setTimeout(() => {
                this.PromiseState = myPromise.FULFILLED;
                this.PromiseResult = result;
                this.onFulfilledCallbacks.forEach(callback => {
                    callback(result)
                })
            });
        }
    }
    
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            setTimeout(() => {
                this.PromiseState = myPromise.REJECTED;
                this.PromiseResult = reason;
                this.onRejectedCallbacks.forEach(callback => {
                    callback(reason)
                })
            });
        }
    }
    
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };

        let promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        })

        return promise2
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }

    if (x instanceof myPromise) {
        if (x.PromiseState === myPromise.PENDING) {
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject)
            }, reject);
        } else if (x.PromiseState === myPromise.FULFILLED) {
            resolve(x.PromiseResult);
        } else if (x.PromiseState === myPromise.REJECTED) {
            reject(x.PromiseResult);
        }
    } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        try {
            var then = x.then;
        } catch (e) {
            return reject(e);
        }

        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(
                    x,
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } catch (e) {
                if (called) return;
                called = true;

                reject(e);
            }
        } else {
            resolve(x);
        }
    } else {
        return resolve(x);
    }
}

```

### Resolve

```js
Promise.resolve =function (value){
    // 如果是Promise实例，直接返回
    if(value instanceof Promise){
        return value
    }
    // 如果不是Promise实例，返回一个新的Promise对象，状态为FULFILLED
    return new Promise(resolve=>resolve(value))
}
```

### Reject

```js
Promise.reject =function(reason){
    return new Promise((resolve,reject)=> reject(reason))
}
```

### all

- 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
- 如果所有Promise都成功，则返回成功结果数组
- 如果有一个Promise失败，则返回这个失败结果

```js
function all (promises){
    const result = []
    let count = 0 
    return new Promise((resolve,reject)=>{
        if(!Array.isArray(promises)){
            throw new TypeError("promises must be an array")
        }
        const addData =(index,value)=>{
            result[index]=value
            count++
            if(count === promises.length) resolve(result)
        }
        promises.forEach((promise,index)=>{
            if(promise instanceof Promise){
                promise.then(res=>{
                    addData(index,res)
                },err=>reject(err))
            }else{
                addData(index,promise)
            }
        })
    })
}

```

### race

- 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
- 哪个Promise 最快得到结果，就返回那个结果，无论成功失败

```js
function race(promises){
    return new Promise((resolve,reject)=>{
        promises.forEach(promise=>{
            if(promise instanceof Promise){
                promise.then(res=>{
                    resolve(res)
                },err=>{
                    reject(err)
                })
            }else{
                resolve(promise)
            }
        })
    })
}
```

### allSettled

- 接收一个Promise 数组，数组中如有非Promise项，则此项当做成功
- 把每一个Promise的结果，集合成数组，返回

```js
function allSettled(promises){
    return new Promise((resolve,reject)=>{
        const res=[]
        let count = 0;
        const addData =(status,value,i)=>{
            res[i]={
                status,
                value
            }
            count ++
            if(count === promise.length){
                resolve(res)
            }
        }
        promises.forEach((promise,i)=>{
            if(promise instanceof Promise){
                promise.then(res=>{
                    addData('fulfilled',res,i)
                },err=>{
                    addData('rejected',res,i)
                })
            }else{
                addData('fulfilled',promise,i)
            }
        })
    })
}

```

### any

- 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
- 如果有一个Promise成功，则返回这个成功结果
- 如果所有Promise都失败，则报错

```js
function any (promises){
    return new Promise((resolve,reject)=>{
        let count = 0
        promises.forEach(promise=>{
            promise.then(val=>{
                resolve(val)
            },err=>{
                count ++
                if(count ===promises.length){
                    reject(new AggregateError('All promise were rejected'))
                }
            })
        })
    })
}
```

### finally

- 接收一个回调函数，但无参数接收
- 无论成功失败状态，都会执行finally

```js
Promise.prototype.finally=function(callback){
    return this.then(function (value){
        return Promise.resolve(callback()).then(function(){
            return value
        })
    }),function (err){
        return Promise.resolve(callback()).then(function(){
            throw err
        })
    }
}
```

### 基于Promise实现Sleep

```js
/**
 *
 * @param {*} fn 要执行的函数
 * @param {*} wait 等待的时间
 */
function sleep(fn,wait) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    }, wait);
  });
}

let sayHello = (name) => console.log(`hello ${name}`);

async function autoRun() {
  await sleep(sayHello('全栈大前端'),3000);
}

autoRun();
```

### 基于Promise封装Ajax

- 返回一个新的Promise实例
- 创建HMLHttpRequest异步对象
- 调用open方法，打开url，与服务器建立链接（发送前的一些处理）
- 监听Ajax状态信息
- 如果xhr.readyState == 4（表示服务器响应完成，可以获取使用服务器的响应了）
    - xhr.status == 200 || xhr.status === 304，返回resolve状态
    - xhr.status == 404，返回reject状态
- xhr.readyState !== 4，把请求主体的信息基于send发送给服务器

```js
function ajax(url, method) {
  return new Promise((resolve, reject) => {
    const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Mscrosoft.XMLHttp');
    xhr.open(url, method, true)
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200|| xhr.status === 304) {
          resolve(xhr.responseText)
        } else if (xhr.status === 404) {
          reject(new Error('404'))
        }
      } else {
        reject('请求数据失败')
      }
    }
    xhr.send()
  })
}
```

### 异步并发数限制

```js
/**
 * 关键点
 * 1. new promise 一经创建，立即执行
 * 2. 使用 Promise.resolve().then 可以把任务加到微任务队列，防止立即执行迭代方法
 * 3. 微任务处理过程中，产生的新的微任务，会在同一事件循环内，追加到微任务队列里
 * 4. 使用 race 在某个任务完成时，继续添加任务，保持任务按照最大并发数进行执行
 * 5. 任务完成后，需要从 doingTasks 中移出
 */
function limit(count, array, iterateFunc) {
  const tasks = []
  const doingTasks = []
  let i = 0
  const enqueue = () => {
    if (i === array.length) {
      return Promise.resolve()
    }
    const task = Promise.resolve().then(() => iterateFunc(array[i++]))
    tasks.push(task)
    const doing = task.then(() => doingTasks.splice(doingTasks.indexOf(doing), 1))
    doingTasks.push(doing)
    const res = doingTasks.length >= count ? Promise.race(doingTasks) : Promise.resolve()
    return res.then(enqueue)
  };
  return enqueue().then(() => Promise.all(tasks))
}

// test
const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i))
limit(2, [1000, 1000, 1000, 1000], timeout).then((res) => {
  console.log(res)
})
```

### 异步串行 | 异步并行

```js
// 字节面试题，实现一个异步加法
function asyncAdd(a, b, callback) {
  setTimeout(function () {
    callback(null, a + b);
  }, 500);
}

// 解决方案
// 1. promisify
const promiseAdd = (a, b) => new Promise((resolve, reject) => {
  asyncAdd(a, b, (err, res) => {
    if (err) {
      reject(err)
    } else {
      resolve(res)
    }
  })
})

// 2. 串行处理
async function serialSum(...args) {
  return args.reduce((task, now) => task.then(res => promiseAdd(res, now)), Promise.resolve(0))
}

// 3. 并行处理
async function parallelSum(...args) {
  if (args.length === 1) return args[0]
  const tasks = []
  for (let i = 0; i < args.length; i += 2) {
    tasks.push(promiseAdd(args[i], args[i + 1] || 0))
  }
  const results = await Promise.all(tasks)
  return parallelSum(...results)
}

// 测试
(async () => {
  console.log('Running...');
  const res1 = await serialSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12)
  console.log(res1)
  const res2 = await parallelSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12)
  console.log(res2)
  console.log('Done');
})()
```

### 串行执行多个Promise

- reduce

```js
arr.reduce((s,v)=>{
    return s.then(()=>delay(v))
},Promise.resolve())

```

- async + 循环 + await

```js
(async function(){
    for(const v of arr){
        await delay(v)
    }
})()
```

- 普通循环

```js
let p = Promise.resolve()
for (const i of arr) {
  p = p.then(() => delay(i))
}
```

- 递归

```js
function dispatch(i,p =Promise.resolve()){
    if(!arr[i]) return Promise.resolve()
    return p.then(()=>dispatch(i+1,delay(arr[i])))
}
dispatch(0)
```

- generator

```js
function *gen(){
    for(const v of arr){
        yield delay(v)
    }
}

function run(gen){
    const g =gen()
    function next(data){
        const result = g.next(data)
        if(result.done)return result.value
        result.value.then(function(data){
            next(data)
        })
    }
    next()
}
run (gen)
```

### 实现一个同时允许任务数量最大为n的函数

- 使用Promise封装，给你一个数组，数组的每一项是一个Promise对象

```js
function limitRunTask(tasks, n) {
  return new Promise((resolve, reject) => {
    let index = 0, finish = 0, start = 0, res = [];
    function run() {
      if (finish == tasks.length) {
        resolve(res);
        return;
      }
      while (start < n && index < tasks.length) {
        // 每一阶段的任务数量++
        start++;
        let cur = index;
        tasks[index++]().then(v => {
          start--;
          finish++;
          res[cur] = v;
          run();
        });
      }
    }
    run();
  })
  // 大概解释一下：首先如何限制最大数量n
  // while 循环start < n，然后就是then的回调
}

```

### 实现有并行限制的 Promise 调度器

- 题目描述:JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个

```js
 addTask(1000,"1");
 addTask(500,"2");
 addTask(300,"3");
 addTask(400,"4");
 的输出顺序是：2 3 1 4

 整个的完整执行流程：

一开始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4

```

- 代码实现：

```js
class Scheduler {
  constructor(limit) {
    this.queue = [];
    this.maxCount = limit;
    this.runCounts = 0;
  }
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, time);
      });
    };
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    this.queue
      .shift()()
      .then(() => {
        this.runCounts--;
        this.request();
      });
  }
}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
  scheduler.add(time, order);
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
scheduler.taskStart();
```

### 参考链接

[Promise知识汇总和面试情况](https://segmentfault.com/a/1190000039699000)

[手把手一行一行代码教你“手写Promise“](https://juejin.cn/post/7043758954496655397#heading-1)

[来45道Promise面试题一次爽到底(1.1w字用心整理)](https://mp.weixin.qq.com/s?__biz=MzkzNTIwNTAwOA==&mid=2247487580&idx=1&sn=373b4c4a33e6597cfd77381de4444acc&source=41#wechat_redirect)

## Generator

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
let iterator = createIterator([1, 2, 3])
...iterator		// 1, 2, 3

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

[JS 高级之手写一个Promise,Generator,async和 await](https://juejin.cn/post/6844904022223110151#heading-17)

## Async/Await

- [7张图，20分钟就能搞定的async/await原理！为什么要拖那么久？](https://juejin.cn/post/7007031572238958629)

- [手写async await的 20 行最简实现，阿里面试热门题](https://mp.weixin.qq.com/s/YMqOblAS8DMh3bbArPNOyA)

- 原理就是利用 generator（生成器）分割代码片段。然后我们使用一个函数让其自迭代，每一个yield 用 promise 包裹起来。执行下一步的时机由 promise 来控制

```js
function asyncToGenerator(generatorFunc) {
    return function() {
      const gen = generatorFunc.apply(this, arguments)
      return new Promise((resolve, reject) => {
        function step(key, arg) {
          let generatorResult
          try {
            generatorResult = gen[key](arg "key") // 这里有可能会执行返回reject状态的Promise
          } catch (error) {
            return reject(error) // 报错的话会走catch，直接reject
          }
          const { value, done } = generatorResult
          if (done) {
            return resolve(value)
          } else {
            return Promise.resolve(value).then(val => step('next', val), err => step('throw', err))
          }
        }
        step("next")
      })
    }
}
```
