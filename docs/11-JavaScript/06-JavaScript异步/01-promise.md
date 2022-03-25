---
title: Javascript异步-Promise
---


## 特性

- 对象的状态不受外界影响。promise对象代表一个异步操作，有三种状态，pending（进行中）、fulfilled（已成功）、rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态，这也是promise这个名字的由来——“承诺”；

- 一旦状态改变就不会再变，任何时候都可以得到这个结果。promise对象的状态改变，只有两种可能：从pending变为fulfilled，从pending变为rejected。这时就称为resolved（已定型）。如果改变已经发生了，你再对promise对象添加回调函数，也会立即得到这个结果。这与事件（event）完全不同，事件的特点是：如果你错过了它，再去监听是得不到结果的。

- Promise.then 会返回一个新的Promise 支持链式调用

## 缺点

- 无法取消Promise，一旦新建它就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
- 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

## 基本使用

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

```


## 实现Promise/A+规范的Promise

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
    // 为了统一用static创建静态属性，用来管理状态
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数
    constructor(func) { // 给类的构造方法constructor添加一个参数func
        this.PromiseState = myPromise.PENDING; // 指定Promise对象的状态属性 PromiseState，初始值为pending
        this.PromiseResult = null; // 指定Promise对象的结果 PromiseResult
        this.onFulfilledCallbacks = []; // 保存成功回调
        this.onRejectedCallbacks = []; // 保存失败回调
        try {
            /**
             * func()传入resolve和reject，
             * resolve()和reject()方法在外部调用，这里需要用bind修正一下this指向
             * new 对象实例时，自动执行func()
             */
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            // 生成实例时(执行resolve和reject)，如果报错，就把错误信息传入给reject()方法，并且直接执行reject()方法
            this.reject(error)
        }
    }

    resolve(result) { // result为成功态时接收的终值
        // 只能由pedning状态 => fulfilled状态 (避免调用多次resolve reject)
        if (this.PromiseState === myPromise.PENDING) {
            /**
             * 为什么resolve和reject要加setTimeout?
             * 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
             * 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
             * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。 
             */
            setTimeout(() => {
                this.PromiseState = myPromise.FULFILLED;
                this.PromiseResult = result;
                /**
                 * 在执行resolve或者reject的时候，遍历自身的callbacks数组，
                 * 看看数组里面有没有then那边 保留 过来的 待执行函数，
                 * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
                 */
                this.onFulfilledCallbacks.forEach(callback => {
                    callback(result)
                })
            });
        }
    }

    reject(reason) { // reason为拒绝态时接收的终值
        // 只能由pedning状态 => rejected状态 (避免调用多次resolve reject)
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

    /**
     * [注册fulfilled状态/rejected状态对应的回调函数] 
     * @param {function} onFulfilled  fulfilled状态时 执行的函数
     * @param {function} onRejected  rejected状态时 执行的函数 
     * @returns {function} newPromsie  返回一个新的promise对象
     */
    then(onFulfilled, onRejected) {
        /**
         * 参数校验：Promise规定then方法里面的两个参数如果不是函数的话就要被忽略
         * 所谓“忽略”并不是什么都不干，
         * 对于onFulfilled来说“忽略”就是将value原封不动的返回，
         * 对于onRejected来说就是返回reason，
         *     onRejected因为是错误分支，我们返回reason应该throw一个Error
         */
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };

        // 2.2.7规范 then 方法必须返回一个 promise 对象
        let promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                /**
                 * 为什么这里要加定时器setTimeout？
                 * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
                 * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
                 * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
                 * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
                 */
                setTimeout(() => {
                    try {
                        // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
                        let x = onFulfilled(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        // 2.2.7.2 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                        reject(e); // 捕获前面onFulfilled中抛出的异常
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
                // pending 状态保存的 resolve() 和 reject() 回调也要符合 2.2.7.1 和 2.2.7.2 规范
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

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 2.3.1规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
    if (x === promise2) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // 2.3.2规范 如果 x 为 Promise ，则使 promise2 接受 x 的状态
    if (x instanceof myPromise) {
        if (x.PromiseState === myPromise.PENDING) {
            /**
             * 2.3.2.1 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
             *         注意"直至 x 被执行或拒绝"这句话，
             *         这句话的意思是：x 被执行x，如果执行的时候拿到一个y，还要继续解析y
             */
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject)
            }, reject);
        } else if (x.PromiseState === myPromise.FULFILLED) {
            // 2.3.2.2 如果 x 处于执行态，用相同的值执行 promise
            resolve(x.PromiseResult);
        } else if (x.PromiseState === myPromise.REJECTED) {
            // 2.3.2.3 如果 x 处于拒绝态，用相同的据因拒绝 promise
            reject(x.PromiseResult);
        }
    } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        // 2.3.3 如果 x 为对象或函数
        try {
            // 2.3.3.1 把 x.then 赋值给 then
            var then = x.then;
        } catch (e) {
            // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
            return reject(e);
        }

        /**
         * 2.3.3.3 
         * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
         * 传递两个回调函数作为参数，
         * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
         */
        if (typeof then === 'function') {
            // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            let called = false; // 避免多次调用
            try {
                then.call(
                    x,
                    // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } catch (e) {
                /**
                 * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
                 * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                 */
                if (called) return;
                called = true;

                /**
                 * 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
                 */
                reject(e);
            }
        } else {
            // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
            resolve(x);
        }
    } else {
        // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
        return resolve(x);
    }
}
```

### Resolve

```js
Promise.resolve =function (value){
    if(value instanceof Promise){
        return value
    }
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

- 应用

```js
const promise1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise1");
      //   reject("error promise1 ");
    }, 3000);
  });
};
const promise2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise2");
      //   reject("error promise2 ");
    }, 1000);
  });
};
const promise3 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //   resolve("promise3");
      reject("error promise3 ");
    }, 2000);
  });
};

//  Promise.all 会走到catch里面
Promise.all([promise1(), promise2(), promise3()])
  .then((res) => {
    console.log(res); 
  })
  .catch((error) => {
    console.log("error", error); // error promise3 
  });
  
// Promise.allSettled 不管有没有错误，三个的状态都会返回
Promise.allSettled([promise1(), promise2(), promise3()])
  .then((res) => {
    console.log(res);  
    // 打印结果 
    // [
    //    {status: 'fulfilled', value: 'promise1'}, 
    //    {status: 'fulfilled',value: 'promise2'},
    //    {status: 'rejected', reason: 'error promise3 '}
    // ]
  })
  .catch((error) => {
    console.log("error", error); 
  });

```

- 实现

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


- 应用

```js
const promise1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise1");
      //  reject("error promise1 ");
    }, 3000);
  });
};
const promise2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise2");
      // reject("error promise2 ");
    }, 1000);
  });
};
const promise3 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise3");
      // reject("error promise3 ");
    }, 2000);
  });
};
Promise.any([promise1(), promise2(), promise3()])
  .then((first) => {
    // 只要有一个请求成功 就会返回第一个请求成功的
    console.log(first); // 会返回promise2
  })
  .catch((error) => {
    // 所有三个全部请求失败 才会来到这里
    console.log("error", error);
  });

```

- 实现

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

- 概念

    - 接收一个回调函数，但无参数接收
    - 无论成功失败状态，都会执行finally

前面的promise不管成功还是失败，都会走到finally中，并且finally之后，还可以继续then（说明它还是一个then方法是关键），并且会将初始的promise值原封不动的传递给后面的then.


- 作用

    - finally里的函数，无论如何都会执行，并会把前面的值原封不动传递给下一个then方法中（相当于起了一个中间过渡的作用）——对应情况1，2，3
    - 如果finally函数中有promise等异步任务，会等它们全部执行完毕，再结合之前的成功与否状态，返回值


- 六大情况用法

```js
// 情况1
Promise.resolve(123).finally((data) => { // 这里传入的函数，无论如何都会执行
  console.log(data); // undefined
})

// 情况2 (这里，finally方法相当于做了中间处理，起一个过渡的作用)
Promise.resolve(123).finally((data) => {
  console.log(data); // undefined
}).then(data => {
  console.log(data); // 123
})

// 情况3 (这里只要reject，都会走到下一个then的err中)
Promise.reject(123).finally((data) => {
  console.log(data); // undefined
}).then(data => {
  console.log(data);
}, err => {
  console.log(err, 'err'); // 123 err
})

// 情况4 (一开始就成功之后，会等待finally里的promise执行完毕后，再把前面的data传递到下一个then中)
Promise.resolve(123).finally((data) => {
  console.log(data); // undefined
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
    }, 3000)
  })
}).then(data => {
  console.log(data, 'success'); // 123 success
}, err => {
  console.log(err, 'err');
})

// 情况5 (虽然一开始成功，但是只要finally函数中的promise失败了，就会把其失败的值传递到下一个then的err中)
Promise.resolve(123).finally((data) => {
  console.log(data); // undefined
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('rejected');
    }, 3000)
  })
}).then(data => {
  console.log(data, 'success');
}, err => {
  console.log(err, 'err'); // rejected err
})

// 情况6 (虽然一开始失败，但是也要等finally中的promise执行完，才能把一开始的err传递到err的回调中)
Promise.reject(123).finally((data) => {
  console.log(data); // undefined
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('resolve');
    }, 3000)
  })
}).then(data => {
  console.log(data, 'success');
}, err => {
  console.log(err, 'err'); // 123 err
})

```

- 代码实现

```js
Promise.prototype.finally = function (callback) {
  return this.then((data) => {
    // 让函数执行 内部会调用方法，如果方法是promise，需要等待它完成
    // 如果当前promise执行时失败了，会把err传递到，err的回调函数中
    return Promise.resolve(callback()).then(() => data); // data 上一个promise的成功态
  }, err => {
    return Promise.resolve(callback()).then(() => {
      throw err; // 把之前的失败的err，抛出去
    });
  })
}

```


## 参考链接

- [Promise知识汇总和面试情况](https://segmentfault.com/a/1190000039699000)

- [手把手一行一行代码教你“手写Promise“](https://juejin.cn/post/7043758954496655397#heading-1)

- [来45道Promise面试题一次爽到底(1.1w字用心整理)](https://mp.weixin.qq.com/s?__biz=MzkzNTIwNTAwOA==&mid=2247487580&idx=1&sn=373b4c4a33e6597cfd77381de4444acc&source=41#wechat_redirect)
