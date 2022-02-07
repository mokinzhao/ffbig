---
title: JavaScript之设计模式
---

## 单例模式(支持饿汉模式)

```js
class SingleInstance {
  static instance: SingleInstance;
  constructor(isLazy?) {
    if (isLazy) {
      SingleInstance.instance = new SingleInstance();
    }
  }
  static getInstance() {
    if (!SingleInstance.instance) {
      SingleInstance.instance = new SingleInstance();
    }
    return SingleInstance.instance;
  }
}

export default SingleInstance.getInstance();
```

## 发布订阅模式

```js
// 发布订阅模式
class EventEmitter {
    constructor() {
        // 事件对象，存放订阅的名字和事件
        this.events = {};
    }
    // 订阅事件的方法
    on(eventName,callback) {
       if (!this.events[eventName]) {
           // 注意时数据，一个名字可以订阅多个事件函数
           this.events[eventName] = [callback]
       } else  {
          // 存在则push到指定数组的尾部保存
           this.events[eventName].push(callback)
       }
    }
    // 触发事件的方法
    emit(eventName) {
        // 遍历执行所有订阅的事件
       this.events[eventName] && this.events[eventName].forEach(cb => cb());
    }
    // 移除订阅事件
    removeListener(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb != callback)
        }
    }
    // 只执行一次订阅的事件，然后移除
    once(eventName,callback) {
        // 绑定的时fn, 执行的时候会触发fn函数
        let fn = () => {
           callback(); // fn函数中调用原有的callback
           this.removeListener(eventName,fn); // 删除fn, 再次执行的时候之后执行一次
        }
        this.on(eventName,fn)
    }
}
```

- 测试用例

```js
let em = new EventEmitter();
let workday = 0;
em.on("work", function() {
    workday++;
    console.log("work everyday");
});

em.once("love", function() {
    console.log("just love you");
});

function makeMoney() {
    console.log("make one million money");
}
em.on("money",makeMoney)；

let time = setInterval(() => {
    em.emit("work");
    em.removeListener("money",makeMoney);
    em.emit("money");
    em.emit("love");
    if (workday === 5) {
        console.log("have a rest")
        clearInterval(time);
    }
}, 1);
```

## 观察者模式

```js
//被观察者
class Subject {
  constructor(name) {
    this.state = "良好";
    this.observers = []; //储存所有观察者
  }
  //收集所有观察者
  attach(o) {
    this.observers.push(o);
  }
  //更新被观察者 状态到方法
  setState(newState) {
    this.state = newState; //更新状态
    //this 指被观察者 学生
    this.observers.forEach((o) => o.update(this));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  update(student) {
    console.log("姓名" + this.name, "当前学生状态是" + student.state);
  }
}

let student = new Subject("学生");
let parent = new Observer("父母");
let teacher = new Observer("老师");
//被观察者存储观察者的前端,需要先接纳观察者
student.attach(parent);
student.attach(teacher);
student.setState("被欺负了");
```
