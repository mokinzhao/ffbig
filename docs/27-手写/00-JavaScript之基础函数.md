---
title: JavaScript之基础函数
---

## Function

### Call

1. 第一个参数为null或者undefined时，this指向全局对象window，值为原始值的指向该原始值的自动包装对象，如 String、Number、Boolean
为了避免函数名与上下文(context)的属性发生冲突，使用Symbol类型作为唯一值
2. 将函数作为传入的上下文(context)属性执行
3. 函数执行完成后删除该属性
4. 返回执行结果

```js
Function.prototype.myCall = function(context, ...args) {
    //处理未传ctx上下文，或者传的是null和undefined等场景
    context =  (context ?? window) || new Object(context)
     // 用Symbol生成唯一的key
    const key = Symbol()
    // 这里的this，即要调用的函数
    context[key] = this
    // 将args展开，并且调用fnName函数，此时fnName函数内部的this也就是ctx了
    const result = context[key](...args)
    // 用完之后，将fnName从上下文ctx中删除
    delete context[key]
    return result
}

```

### Apply

1. 前部分与call一样
2. 第二个参数可以不传，但类型必须为数组或者类数组

```js
Function.prototype.myApply = function(context) {
    context =  (context ?? window) || new Object(context)
    const key = Symbol()
    const args = arguments[1]
    context[key] = this
    const result= args ? context[key](...args) : context[key]()
    delete context[key]
    return result
}
```

### Bind

- 使用 call / apply 指定 this
- 返回一个绑定函数
- 当返回的绑定函数作为构造函数被new调用，绑定的上下文指向实例对象
- 设置绑定函数的prototype 为原函数的prototype

```js

//简易版
Function.prototype.mybind = function (context, ...args) {
  return (...newArgs) => {
    return this.call(context, ...args, newArgs);
  };
};

//完善版
Function.prototype.mybind2 = function (context, ...args) {
  const fn = this;
  const bindFn = function (...newFnArgs) {
    return fn.call(
      this instanceof bindFn ? this : context,
      ...args,
      ...newFnArgs
    );
  };
  bindFn.prototype = Object.create(fn.prototype);
  return bindFn;
};
```

### New

1. 创建一个新对象
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）
3. 执行构造函数中的代码（为这个新对象添加属性）
4. 返回新对象。

```js
Function.prototype.myNew = function () {
  //创建一个实例对象
  var obj = new Object();
  //取得外部传入得构造器
  var Constructor = Array.prototype.shift.call(arguments);
  //实现继承，实例可以访问构造器得属性
  obj.__proto__ = Constructor.prototype;
  //调用构造器，并改变其this 指向到实例
  var ret = Constructor.apply(obj, arguments);
  // 如果构造函数返回值是对象原则返回这个对象，如果不是对象则返回新的实例对象
  return typeof ret === "object" ? ret : obj;
};
```

## Object

### Object.create

- Object.create() 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

```js
function create(obj) {
      // 排除传入的对象是 null 和 非object的情况
  if (obj === null || typeof obj !== 'object') {
    throw new TypeError(`Object prototype may only be an Object: ${obj}`);
  }
  function Fn() {}
  Fn.prototype = obj;
  Fn.prototype.constructor = Fn;
  return new Fn();
}

let demo = {
  c: "123",
};

let cc = Object.create(demo);
```

### Object.is

- Object.is不会转换被比较的两个值的类型，这点和===更为相似，他们之间也存在一些区别。

```js
+0 === -0; // true
NaN === NaN; // false
```

1. NaN在===中是不相等的，而在Object.is中是相等的
2. +0和-0在===中是相等的，而在Object.is中是不相等的

```js
Object.is = function (x, y) {
  if (x === y) {
    // 当前情况下，只有一种情况是特殊的，即 +0 -0
    // 如果 x !== 0，则返回true
    // 如果 x === 0，则需要判断+0和-0，则可以直接使用 1/+0 === Infinity 和 1/-0 === -Infinity来进行判断
    return x !== 0 || 1 / x === 1 / y;
  }

  // x !== y 的情况下，只需要判断是否为NaN，如果x!==x，则说明x是NaN，同理y也一样
  // x和y同时为NaN时，返回true
  return x !== x && y !== y;
};

```

### Object.assign

- assign接收多个对象，并将多个对象合成一个对象
- 这些对象如果有重名属性，以后来的对象属性值为准
- assign返回一个对象，这个对象 === 第一个对象

```js
Object.prototype.sx_assign = function (target, ...args) {
    if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object')
    }
    target = Object(target)

    for (let nextObj of args) {
        for (let key in nextObj) {
            nextObj.hasOwnProperty(key) && (target[key] = nextObj[key])
        }
    }
    return target
}

const testa = { name: 'testa' }
const testb = { name: 'testb', age: 12 }
const testc = { age: 28, gender: '男' }

const testd = Object.sx_assign(testa, testb, testc)
console.log(testd) // { name: 'testb', age: 28, gender: '男' }
console.log(testa === testd) // true

```

### Object.freeze

- Object.freeze冻结一个对象，让其不能再添加/删除属性，也不能修改该对象已有属性的可枚举性、可配置可写性

- 也不能修改已有属性的值和它的原型属性，最后返回一个和传入参数相同的对象

```js
function myFreeze(obj){
  // 判断参数是否为Object类型，如果是就封闭对象，循环遍历对象。去掉原型属性，将其writable特性设置为false
  if(obj instanceof Object){
    Object.seal(obj);  // 封闭对象
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        Object.defineProperty(obj,key,{
          writable:false   // 设置只读
        })
        // 如果属性值依然为对象，要通过递归来进行进一步的冻结
        myFreeze(obj[key]);  
      }
    }
  }
}
```

### Object.entries

- 用处：将对象转成键值对数组

```js
const obj = {
    name: 'test123',
    age: 22,
    gender: '男'
}
```

```js
Object.prototype.myEntries = function (obj) {
    const res = []
    for (let key in obj) {
        obj.hasOwnProperty(key) && res.push([key, obj[key]])
    }
    return res
}

console.log(Object.myEntries(obj))
// [ [ 'name', 'test123' ], [ 'age', 22 ], [ 'gender', '男' ] ]
```

### Object.fromEntries

- 跟entries相反，将键值对数组转成对象

```js
Object.prototype.MyFromEntries = function (arr) {
    const obj = {}
    for (let i = 0; i < arr.length; i++) {
        const [key, value] = arr[i]
        obj[key] = value
    }
    return obj
}

console.log(Object.MyFromEntries([['name', 'test123'], ['age', 22], ['gender', '男']]))
// { name: 'test123', age: 22, gender: '男' }
```

### Object.keys

- 将对象的key转成一个数组合集

```js
Object.prototype.keys = function (obj) {
    const keys = []
    for (let key in obj) {
        obj.hasOwnProperty(key) && res.push(key)
    }
    return keys
}

console.log(Object.keys(obj))
// [ 'name', 'age', 'gender' ]

```

### Object.getOwnPropertyNames

- Object.getOwnPropertyNames返回的是对象所有自己的属性，而Object.keys(obj)则返回的是所有可枚举属性，也就是属性下的enumerable: false，看例子：

```js
const obj = {};
Object.defineProperties(obj, {
    property1: {enumerable: true, value: 1},
    property2: {enumerable: false, value: 2},
});

console.log(Object.keys(obj));
console.log(Object.getOwnPropertyNames(obj));
```

- 实现

```js
if (typeofObject.getOwnPropertyNames !== 'function') {
  Object.getOwnPropertyNames = function(o) {
    if (o !== Object(o)) {
      throwTypeError('Object.getOwnPropertyNames called on non-object');
    }
    var props = [],
      p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        props.push(p);
      }
    }
    return props;
  };
}
```

### Object.values

- 将对象的所有值转成数组合集

```js
Object.prototype.values = function (obj) {
    const values = []
    for (let key in obj) {
        obj.hasOwnProperty(key) && values.push(obj[key])
    }
    return values
}

console.log(Object.values(obj))
// [ 'test123', 22, '男' ]

```

## instanceOf

1. 步骤1：先取得当前类的原型，当前实例对象的原型链
2. 步骤2：一直循环（执行原型链的查找机制）

- 取得当前实例对象原型链的原型链（proto = proto.____proto____，沿着原型链一直向上查找）
- 如果 当前实例的原型链____proto__上找到了当前类的原型prototype，则返回 true
- 如果 一直找到Object.prototype.____proto____ ==  null，Object的基类(null)上面都没找到，则返回 false

```js
function _instanceof (instanceObject, classFunc) {
  let classFunc = classFunc.prototype; // 取得当前类的原型
  let proto = instanceObject.__proto__; // 取得当前实例对象的原型链
  
  while (true) {
    if (proto === null) { // 找到了 Object的基类 Object.prototype.__proto__
      return false;
    };
    if (proto === classFunc) { // 在当前实例对象的原型链上，找到了当前类
      return true;
    }
    proto = proto.__proto__; // 沿着原型链__ptoto__一层一层向上查找
  }
}
```

- 优化版 (处理兼容问题)

Object.getPrototypeOf ()：用来获取某个实例对象的原型（内部[[prototype]]属性的值，包含proto属性）

```js
function _instanceof (instanceObject, classFunc) {
  let classFunc = classFunc.prototype; // 取得当前类的原型
  let proto = Object.getPrototypeOf(instanceObject); // 取得当前实例对象的原型链上的属性
  
  while (true) {
    if (proto === null) { // 找到了 Object的基类 Object.prototype.__proto__
      return false;
    };
    if (proto === classFunc) { // 在当前实例对象的原型链上，找到了当前类
      return true;
    }
    proto = Object.getPrototypeOf(proto); // 沿着原型链__ptoto__一层一层向上查找
  }
}
```

## 自定义typeOf

typeof 可以正确识别：Undefined、Boolean、Number、String、Symbol、Function 等类型的数据，但是对于其他的都会认为是 object，比如 Null、Date 等，所以通过 typeof 来判断数据类型会不准确。但是可以使用 Object.prototype.toString 实现。

```js
function typeOf(obj) {
    let res = Object.prototype.toString.call(obj).split(' ')[1]
    res = res.substring(0, res.length - 1).toLowerCase()
    return res
}

typeOf([])        // 'array'
typeOf({})        // 'object'
typeOf(new Date)  // 'date'
```

## JSON.stringify

- JSON.stringify([, replacer [, space]) 方法是将一个 JavaScript 值(对象或者数组)转换为一个 JSON 字符串。此处模拟实现，不考虑可选的第二个参数 replacer 和第三个参数 space，如果对这两个参数的作用还不了解，建议阅读 MDN 文档。
    1. 基本数据类型：
        - undefined 转换之后仍是 undefined(类型也是 undefined)
        - boolean 值转换之后是字符串 "false"/"true"
        - number 类型(除了 NaN 和 Infinity)转换之后是字符串类型的数值
        - symbol 转换之后是 undefined
        - null 转换之后是字符串 "null"
        - string 转换之后仍是string
        - NaN 和 Infinity 转换之后是字符串 "null"

2. 函数类型：转换之后是 undefined

3. 如果是对象类型(非函数)
    - 如果是一个数组：如果属性值中出现了 undefined、任意的函数以及 symbol，转换成字符串 "null" ；
    - 如果是 RegExp 对象：返回 {} (类型是 string)；
    - 如果是 Date 对象，返回 Date 的 toJSON 字符串值；
    - 如果是普通对象；
        - 如果有 toJSON() 方法，那么序列化 toJSON() 的返回值。
        - 如果属性值中出现了 undefined、任意的函数以及 symbol 值，忽略。
        - 所有以 symbol 为属性键的属性都会被完全忽略掉。

4. 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

```js
function jsonStringify(data) {
    let dataType = typeof data;
    
    if (dataType !== 'object') {
        let result = data;
        //data 可能是 string/number/null/undefined/boolean
        if (Number.isNaN(data) || data === Infinity) {
            //NaN 和 Infinity 序列化返回 "null"
            result = "null";
        } else if (dataType === 'function' || dataType === 'undefined' || dataType === 'symbol') {
            //function 、undefined 、symbol 序列化返回 undefined
            return undefined;
        } else if (dataType === 'string') {
            result = '"' + data + '"';
        }
        //boolean 返回 String()
        return String(result);
    } else if (dataType === 'object') {
        if (data === null) {
            return "null"
        } else if (data.toJSON && typeof data.toJSON === 'function') {
            return jsonStringify(data.toJSON());
        } else if (data instanceof Array) {
            let result = [];
            //如果是数组
            //toJSON 方法可以存在于原型链中
            data.forEach((item, index) => {
                if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'symbol') {
                    result[index] = "null";
                } else {
                    result[index] = jsonStringify(item);
                }
            });
            result = "[" + result + "]";
            return result.replace(/'/g, '"');
            
        } else {
            //普通对象
            /**
             * 循环引用抛错(暂未检测，循环引用时，堆栈溢出)
             * symbol key 忽略
             * undefined、函数、symbol 为属性值，被忽略
             */
            let result = [];
            Object.keys(data).forEach((item, index) => {
                if (typeof item !== 'symbol') {
                    //key 如果是symbol对象，忽略
                    if (data[item] !== undefined && typeof data[item] !== 'function'
                        && typeof data[item] !== 'symbol') {
                        //键值如果是 undefined、函数、symbol 为属性值，忽略
                        result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
                    }
                }
            });
            return ("{" + result + "}").replace(/'/g, '"');
        }
    }
}

```

## JSON.parse

- eval

```js
var json = '{"a":"1", "b":2}';
var obj = eval("(" + json + ")");  // obj 就是 json 反序列化之后得到的对象

```

- 但是直接调用 eval 会存在安全问题，如果数据中可能不是 json 数据，而是可执行的 JavaScript 代码，那很可能会造成 XSS 攻击。因此，在调用 eval 之前，需要对数据进行校验。

```js
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

if (
    rx_one.test(
        json.replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
    )
) {
    var obj = eval("(" +json + ")");
}

```

- new Function

```js
var json = '{"name":"小姐姐", "age":20}';
var obj = (new Function('return ' + json))();

```

- 参考

[JSON.parse 三种实现方式](https://github.com/youngwind/blog/issues/115)



## String

### slice

- start：开始截取的字符索引(包含此字符)
- end：结束截取的字符索引(不包含此字符)

- 注意点：
    - start > end：返回空字符串
    - start < 0：start = 数组长度 + start

```js
String.prototype.sx_slice = function (start = 0, end) {
    start = start < 0 ? this.length + start : start
    end = !end && end !== 0 ? this.length : end

    if (start >= end) return ''
    let str = ''
    for (let i = start; i < end; i++) {
        str += this[i]
    }

    return str
}

console.log(str.sx_slice(2)) // nshine_lin
console.log(str.sx_slice(-2)) // in
console.log(str.sx_slice(-9, 10)) // shine_l
console.log(str.sx_slice(5, 1)) // ''

```

### substr

- start：开始截取的字符索引(包含此字符)
- length：截取的长度

- 注意点
    - start < 0：start = 数组长度 + start
    - length超出所能截取范围，需要做处理
    - length < 0：返回空字符串


```js
String.prototype.sx_substr = function (start = 0, length) {
    if (length < 0) return ''

    start = start < 0 ? this.length + start : start
    length = (!length && length !== 0) || length > this.length - start ? this.length : start + length

    let str = ''
    for (let i = start; i < length; i++) {
        str += this[i]
    }
    return str
}

console.log(str.sx_substr(3)) // shine_lin
console.log(str.sx_substr(3, 3)) // shi
console.log(str.sx_substr(5, 300)) // ine_lin

```

### substring

- 功能与slice大致相同,start > end：互换值

```js
String.prototype.sx_sunstring = function (start = 0, end) {
    start = start < 0 ? this.length + start : start
    end = !end && end !== 0 ? this.length : end

    if (start >= end) [start, end] = [end, start]
    let str = ''
    for (let i = start; i < end; i++) {
        str += this[i]
    }

    return str
}

console.log(str.sx_sunstring(2)) // nshine_lin
console.log(str.sx_sunstring(-2)) // in
console.log(str.sx_sunstring(-9, 10)) // shine_l
console.log(str.sx_sunstring(5, 1)) // unsh
```

## ES6函数

### Set

```js
class Set {
  constructor() {
    this.items = {};
    this.size = 0;
  }

  has(element) {
    return element in this.items;
  }

  add(element) {
    if(! this.has(element)) {
      this.items[element] = element;
      this.size++;
    }
    return this;
  }

  delete(element) {
    if (this.has(element)) {
      delete this.items[element];
      this.size--;
    }
    return this;
  }

  clear() {
    this.items = {}
    this.size = 0;
  }

  values() {
    let values = [];
    for(let key in this.items) {
      if(this.items.hasOwnProperty(key)) {
        values.push(key);
      }
    }
    return values;
  }
}

```

### Map

```js
function defaultToString(key) {
  if(key === null) {
    return 'NULL';
  } else if (key === undefined) {
    return 'UNDEFINED'
  } else if (Object.prototype.toString.call(key) === '[object Object]' || Object.prototype.toString.call(key) === '[object Array]') {
    return JSON.stringify(key);
  }
  return key.toString();
}

class Map {
  constructor() {
    this.items = {};
    this.size = 0;
  }

  set(key, value) {
    if(!this.has(key)) {
      this.items[defaultToString(key)] = value;
      this.size++;
    }
    return this;
  }

  get(key) {
    return this.items[defaultToString(key)];
  }

  has(key) {
    return this.items[defaultToString(key)] !== undefined;
  }

  delete(key) {
    if (this.has(key)) {
      delete this.items[key];
      this.size--;
    }
    return this;
  }

  clear() {
    this.items = {}
    this.size = 0;
  }

  keys() {
    let keys = [];
    for(let key in this.items) {
      if(this.has(key)) {
        keys.push(key)
      }
    }
    return keys;
  }

  values() {
    let values = [];
    for(let key in this.items) {
      if(this.has(key)) {
        values.push(this.items[key]);
      }
    }
    return values;
  }
}

```

### Class


- ES6

```js
class Person {
  	constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    eat() {
        return  'eat'
    }
    static say() {
    	return 'say'
    }
}

```

- ES5

```js
// 判断某对象是否为某构造器的实例
function _instanceof(left, right) { 
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left); } else { return left instanceof right; }
}

// 检查声明的class类是否通过new的方式调用，否则会报错
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { 
    throw new TypeError("Cannot call a class as a function"); } 
}
/**
 *将方法添加到原型上，如果是静态方法添加到构造函数上，
 **/ 

function _defineProperties(target, props) { 
    // 遍历函数数组，分别声明其描述符 并添加到对应的对象上
    for (var i = 0; i < props.length; i++) { 
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false; // 设置该属性是否能够出现在对象的枚举属性中。默认为 false
        descriptor.configurable = true; // 设置该属性描述符能够被改变，同时该属性也能从对应的对象上被删除。
        if ("value" in descriptor) descriptor.writable = true; // 如果属性中存在value, value设置为可以改变。
        Object.defineProperty(target, descriptor.key, descriptor); // 写入对应的对象上
    }
}

// 收集公有函数和静态方法，将方法添加到构造函数或构造函数的原型中，并返回构造函数。
function _createClass(Constructor, protoProps, staticProps) { 
    if (protoProps) _defineProperties(Constructor.prototype, protoProps); // 共有方法写在property原型上
    if (staticProps) _defineProperties(Constructor, staticProps); // 静态方法写到构造函数上 
    return Constructor; 
}

var Person = function () {
    function Person(name, age) {
        _classCallCheck(this, Person);

        this.name = name;
        this.age = age;
    }

    _createClass(Person, [{
        key: "eat",
        value: function eat() {
            return 'eat';
        }
    }], [{
        key: "say",
        value: function say() {
            return 'say';
        }
    }]);

    return Person;
}();



```
