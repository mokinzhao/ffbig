---
title: JavaScript之继承
---

## 原型链继承(new)

- 利用原型特性，让一个引用类型继承另一个引用类型的属性及方法

```js
//父类
function Parent(){
    this.name='父亲'
}
Parent.prototype.getParentName=function(){
    return this.name
}

//子类
function Children(){
    this.age = '18'  
}

//核心步骤：将Parent的实例赋值给Children的原型上
// 1，新创建的对象复制了父类构造函数内的所有属性及方法
// 2，并将原型 __proto__ 指向了父类的原型对象
Children.prototype = new Parent();

Children.prototype.getChildrenAge=function(){
    return this.age
}

//测试 
const instance =new Children()

console.log('instance name',instance.getParentName()) // 父亲
console.log('instance age',instance.getChildrenAge()) // 18
```

- 优点： 继承了父类的模板，又继承了父类的原型对象

- 缺点：
    1. 多个实例对引用类型的操作会被篡改
    2. 创建子类实例时，无法向父类构造函数传参，不够灵活
    3. 无法实现多继承(因为已经指定类原型对象)
    4. 如果要给子类的原型上新增属性和方法，就必须放在Child.prototype = new Parent()这样的语句后面

## 借用构造函数继承(call)

- 在子类型的构造函数内部调用父类型构造函数。

```js
//父类
function Parent(){
    this.name='父亲'
}
Parent.prototype.getParentName=function(){
    return this.name
}

//子类
function Children(){
    //核心步骤：将Parent的this指向 Children this对象上,在子类构造函数中,向父类构造函数传参
    Parent.call(this,'Parent')
    this.age = '18'  
}
Children.prototype.getChildrenAge=function(){
    return this.age
}

//测试 
const instance = new Children()

console.log('instance name',instance.name) // 父亲
console.log('instance age',instance.getChildrenAge()) // 18
console.log('instance name',instance.getParentName()) // Uncaught TypeError: instance.getParentName is not a function

```

- 优点：
    1. 解决了原型链共享父类引用对象的问题
    2. 可以实现多继承
    3. 创建子类实例时,可以向父类传递参数

- 缺点：
    1. 实例并不是父类的实例，只是子类的实例
    2. 只能继承父类的属性和方法，不能继承原型属性/方法
    3. 无法实现函数复用,每个子类都有父类实例函数的副本,影响性能

## 组合继承(call+new)

- 组合继承就是将原型链继承与构造函数继承组合在一起，从而发挥两者之长的一种继承模式。

- 思路:
    1. 使用原型链继承来保证子类能继承到父类原型中的属性和方法
    2. 使用构造继承来保证子类能继承到父类的实例属性和方法

- 步骤:
    1. 通过call/apply在子类构造函数内部调用父类构造函数
    2. 将子类构造函数的原型对象指向父类构造函数创建的一个匿名实例
    3. 修正子类构造函数原型对象的constructor属性，将它指向子类构造函数

```js
//父类
function Parent(){
    this.name='父亲'
}
Parent.prototype.getParentName=function(){
    return this.name
}

//子类
function Children(){
    //核心步骤一：借用构造函数继承:将Parent的this指向 Children this对象上,在子类构造函数中,向父类构造函数传参
    Parent.call(this,'Parent')
    this.age = '18'  
}
//核心步骤二： 原型链继承: 将`this`和`prototype`声明的属性/方法继承至子类的`prototype`上
Children.prototype=new Parent()

Children.prototype.getChildrenAge=function(){
    return this.age
}

//测试 
const instance = new Children()

console.log('instance name',instance.name) // 父亲
console.log('instance age',instance.getChildrenAge()) // 18
console.log('instance name',instance.getParentName()) // 父亲

```

- 优点
    1. 可以继承父类实例属性和方法，也能够继承父类原型属性和方法
    2. 弥补了原型链继承中引用属性共享的问题
    3. 可传参,可复用

- 缺点
    1. 使用组合继承时,父类构造函数会被调用两次
    2. 并且生成了两个实例,子类实例中的属性和方法会覆盖子类原型(父类实例)上的属性和方法,所以增加了不必要的内存

## 原型式继承(Object.create)

- 该方法的原理是创建一个构造函数，构造函数的原型指向对象，然后调用 new 操作符创建实例，并返回这个实例，本质是一个浅拷贝

- 在ES5之后可以直接使用Object.create()方法来实现，而在这之前就只能手动实现一个了(如题目6.2)

```js
//核心步骤
function object(obj) {
    function F () {};
    F.prototype = obj;
    F.prototype.constructor = F;
    return new F();
}
var Parent = {
  name: "父亲",
  friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = object(Parent);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(Parent);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

console.log(Parent.friends)  //"Shelby,Court,Van,Rob,Barbie"
console.log(Parent.name)  //父亲

```

- 优点：再不用创建构造函数的情况下,实现了原型链继承,代码量减少一部分

- 缺点：
    1. 一些引用数据操作的时候会出现问题，两个实例会公用继承实例的引用数据类
    2. 谨慎定义方法，以免定义方法也继承对象原型的方法重名
    3. 无法直接给父级构造函数使用参数

## 寄生式继承（增强型Object.create）

- 核心：在原型式继承的基础上再封装一层，来增强对象，之后将这个对象返回。

```js
function createAnother(original){
  var clone = object(original); // 通过调用 object() 函数创建一个新对象
  clone.sayHi = function(){  // 以某种方式来增强对象
    alert("hi");
  };
  return clone; // 返回这个对象
}

```

- 案例使用

```js
var cat = {
  heart: '❤️',
  colors: ['white', 'black']
}
//核心步骤
function createAnother (original) {
    var clone = Object.create(original);
    clone.actingCute = function () {
      console.log('我是一只会卖萌的猫咪')
    }
    return clone;
}
var guaiguai = createAnother(cat)
var huaihuai = Object.create(cat)

guaiguai.actingCute()
console.log(guaiguai.heart)
console.log(huaihuai.colors)
console.log(guaiguai)
console.log(huaihuai)
```

- 优点: 再不用创建构造函数的情况下，实现了原型链继承，代码量减少一部分。

- 缺点:
    1. 一些引用数据操作的时候会出问题,两个实例会公用继承实例的引用数据类
    2. 谨慎定义方法，以免定义方法也继承对象原型的方法重名
    3. 无法直接给父级构造函数使用参数

## 寄生组合继承（call+Object.create）

- 寄生组合继承算是ES6之前一种比较完美的继承方式吧

```js
function Parent(name){
    this.name =name;
    this.say=()=>{
        console.log('say')
    };
}

Parent.prototype.play=function(){
    console.log('play')
}

function Children(name){
    //核心步骤一:借用构造函数继承,继承父类的属性
    Parent.call(this);
    this.name =name
}
//核心步骤二:
 var prototype = Object.create(Parent.prototype);     //创建对象，创建父类原型的一个副本
 prototype.constructor= Children                      //增强对象，弥补因重写原型而失去的默认的 constructor 属性
 Children.prototype = prototype;                      //指定对象，将新创建的对象赋值给子类的原型

Children.prototype.open=function(){
 console.log('open')
}

//测试
let child = new Children("小孩");
console.log(child.name);
child.say();
child.play();
child.open();
```

- 它避免了组合继承中调用两次父类构造函数，初始化两次实例属性的缺点

- 所以它拥有了上述所有继承方式的优点:
    1. 只调用了一次父类构造函数，只创建了一份父类属性
    2. 子类可以用到父类原型链上的属性和方法
    3. 能够正常的使用instanceOf和isPrototypeOf方法

## 混入式继承(Object.assign)

```js
function MyClass() {
     SuperClass.call(this);
     OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);

// 核心步骤：混合其它
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
     // do something
};

```

## Class的继承

- 在class 中继承主要是依靠两个东西：

    1. extends
    2. super

```js
class Parent{
    constructor(name){
        this.name=name
    }
    say(){
        console.log('say hello')
    }
}

class Children extends Parent{
    constructor(name){
        super(name)
    }
    play(){
        console.log('play')
    }
}

// 测试
const children =new Children('mokin') 
children.say()
children.play()
```

- ES5继承和ES6继承的区别:

    - 在 ES5 中的继承（例如构造继承、寄生组合继承），实质上是先创造子类的实例对象this,然后再将父类的属性和方法添加到this上（使用Parent.call(this)）
    - 在 ES6 中却不是这样的，它实质是先创造父类的实例对象this（也就是使用super()）,然后再用子类的构造函数去修改this.
