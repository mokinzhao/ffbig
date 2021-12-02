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
class EventEmitter {
  constructor() {
    // 事件对象，存放订阅的名字和事件
    this.events = {};
  }
  // 订阅事件的方法
  on(eventName, callback) {
    if (!this.events[eventName]) {
      // 注意数据，一个名字可以订阅多个事件函数
      this.events[eventName] = [callback];
    } else {
      // 存在则push到指定数组的尾部保存
      this.events[eventName].push(callback);
    }
  }
  // 触发事件的方法
  emit(eventName) {
    // 遍历执行所有订阅的事件
    this.events[eventName] && this.events[eventName].forEach((cb) => cb());
  }
}
//测试用例
let em = new EventEmitter();

function workDay() {
  console.log("每天工作");
}
function makeMoney() {
  console.log("赚100万");
}
function sayLove() {
  console.log("向喜欢的人示爱");
}
em.on("money", makeMoney);
em.on("love", sayLove);
em.on("work", workDay);

em.emit("money");
em.emit("love");
em.emit("work");
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
