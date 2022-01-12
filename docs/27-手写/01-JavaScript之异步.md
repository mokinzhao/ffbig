---
title: JavaScript之异步
---

## Promise

![Promise流程图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/28/169c500344dfe50a~tplv-t2oaga2asx-watermark.awebp)





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

## Generator





## Async/Await

- [7张图，20分钟就能搞定的async/await原理！为什么要拖那么久？](https://juejin.cn/post/7007031572238958629)