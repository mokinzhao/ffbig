---
title: Map/WeakMap/Set/WeakSet
---

## Map VS Object

### Map与Object的区别

- Map可以使用任何数据类型作为键，而Object只能使用数值、字符串或symbol
- Map元素的顺序遵循插入的顺序，而Object则没有这一特性
- Map自身支持迭代，而Object不支持
- Map自身有size属性，而Object则需要借助Object.keys()来计算

### 何时选用Map何时选用Object

- 「内存占用」 ：固定大小的内存，Map 约比 Object 多存储 50%的键值对
- 「插入性能」 ：涉及大量插入操作，Map 性能更佳
- 「查找性能」 ：涉及大量查找操作，Object 更适合
- 「删除性能」 ：涉及大量删除操作，毫无疑问选择 Map

## Map/WeakMap

### Map

map本质上就是键值对的集合，但是普通的Object中的键值对中的键只能是字符串。而ES6提供的Map数据结构类似于对象，但是它的键不限制范围，可以是任意类型，是一种更加完善的Hash结构。如果Map的键是一个原始数据类型，只要两个键严格相同，就视为是同一个键。

实际上Map是一个数组，它的每一个数据也都是一个数组，其形式如下：

```js
const map = [
     ["name","张三"],
     ["age",18],
]
```

- Map主要API
  - size： map.size 返回Map结构的成员总数。
  - set(key,value)：设置键名key对应的键值value，然后返回整个Map结构，如果key已经有值，则键值会被更新，否则就新生成该键。（因为返回的是当前Map对象，所以可以链式调用）
  - get(key)：该方法读取key对应的键值，如果找不到key，返回undefined。
  - has(key)：该方法返回一个布尔值，表示某个键是否在当前Map对象中。
  - delete(key)：该方法删除某个键，返回true，如果删除失败，返回false。
  - clear()：map.clear()清除所有成员，没有返回值。

- Map结构原生提供是三个遍历器生成函数和一个遍历方法
  - keys()：返回键名的遍历器。
  - values()：返回键值的遍历器。
  - entries()：返回所有成员的遍历器。
  - forEach()：遍历Map的所有成员。

```js
const map = new Map([
     ["foo",1],
     ["bar",2],
])
for(let key of map.keys()){
    console.log(key);  // foo bar
}
for(let value of map.values()){
     console.log(value); // 1 2
}
for(let items of map.entries()){
    console.log(items);  // ["foo",1]  ["bar",2]
}
map.forEach( (value,key,map) => {
     console.log(key,value); // foo 1    bar 2
})
```

### WeakMap

WeakMap 对象也是一组键值对的集合，其中的键是弱引用的。**其键必须是对象**，原始数据类型不能作为key值，而值可以是任意的

#### 常用API

  - set(key,value)：设置键名key对应的键值value，然后返回整个Map结构，如果key已经有值，则键值会被更新，否则就新生成该键。（因为返回的是当前Map对象，所以可以链式调用）
  - get(key)：该方法读取key对应的键值，如果找不到key，返回undefined。
  - has(key)：该方法返回一个布尔值，表示某个键是否在当前Map对象中。
  - delete(key)：该方法删除某个键，返回true，如果删除失败，返回false。

其clear()方法已经被弃用，所以可以通过创建一个空的WeakMap并替换原对象来实现清除。

WeakMap的设计目的在于，有时想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。一旦不再需要这两个对象，就必须手动删除这个引用，否则垃圾回收机制就不会释放对象占用的内存。

而WeakMap的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。


#### 应用场景

- 在 DOM 对象上保存相关数据

传统使用 jQuery 的时候，我们会通过 $.data() 方法在 DOM 对象上储存相关信息(就比如在删除按钮元素上储存帖子的 ID 信息)，jQuery 内部会使用一个对象管理 DOM 和对应的数据，当你将 DOM 元素删除，DOM 对象置为空的时候，相关联的数据并不会被删除，你必须手动执行 $.removeData() 方法才能删除掉相关联的数据，WeakMap 就可以简化这一操作

```js
let wm = new WeakMap(), element = document.querySelector(".element")
wm.set(element, "data")

let value = wm.get(elemet)
console.log(value) // data

element.parentNode.removeChild(element)
element = null
```

- 私有属性

通过WeakMap也可以实现私有属性

```js
const privateData = new WeakMap()

export default class Student {
  constructor(name, age) {
    privateData.set(this, {name, age})
  }

  getName() {
    return privateData.get(this).name
  }

  getAge() {
    return privateData.get(this).age
  }
}
```

#### 总结

- Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

- WeakMap只接受对象作为键名，而Map的键名可以是任何数据类型
- WeakMap的键名所指的对象不计入垃圾回收机制
- WeakMap没有size属性且不可遍历，Map有size属性且可遍历

## Set/WeakSet

### Set

ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值

Set本身是一个构造函数，用来生成Set数据结构，「它可以接收一个数组（或具有iterable接口的数据结构）作为参数来初始化」。Set允许存储任何类型的数据。

#### 常用API

- 「Set.prototype.add(value)」 :  添加元素，返回添加后的Set
- 「Set.prototype.delete(value)」 :  删除元素，返回一个布尔值，表示是否删除成功
- 「Set.prototype.has(value)」 : 返回一个布尔值，表示该元素是否是Set的成员
- 「Set.prototype.clear()」 :清空Set集合，无返回值
- 「Set.prototype.size)」 :  返回集合包含元素的数量，类似于数组的length属性

```js
const obj = {name: 'nanjiu'}
const set = new Set([1,2,3,obj])

console.log(set.size)  //4

console.log('delete', set.delete(3), set) // true {1,2,{name:'nanjiu'}}
console.log('delete', set.delete({name: 'nanjiu'}), set) // false {1,2,{name:'nanjiu'}}
console.log('delete', set.delete(obj), set) // true {1,2}

console.log('add', set.add(6), set.size) //  {1, 2, 6}, 3
console.log('add', set.add({name: 'FE'})) // {1, 2, 6, {name: 'FE'}}
console.log('add', set.add(obj)) // {1, 2, 6, {name: 'FE'}, {name: 'nanjiu'}}

console.log('has', set.has(1)) // true
console.log('has', set.has(obj)) // true
console.log('has', set.has({name: 'FE'})) // false
```

这里就是需要注意一下引用数据类型，set中存储以及判断是否存在都是用的引用数据类型的指针，这一点可以从上面set.delete({name: 'nanjiu'})和set.has({name: 'FE'})可以看出。

#### 遍历方法

- 「Set.prototype.keys()」 : 返回Set的键名的遍历器
- 「Set.prototype.values()」 : 返回Set的键值的遍历器
- 「Set.prototype.entries()」 : 返回Set的键值对的遍历器
- 「Set.prototype.forEach()」 : 使用回调函数遍历每个成员

「Set会维护值插入时的顺序，因此支持按顺序迭代。由于Set没有键名，只有键值，所以keys与values方法行为完全一致。」

```js
const mySet = new Set([1, 2, 'nanjiu', [3], {age: 18}])
console.log('keys', mySet.keys()) // SetIterator {1, 2, 'nanjiu', [3], {age: 18}}
console.log('values', mySet.values()) // SetIterator {1, 2, 'nanjiu', [3], {age: 18}}
console.log('entries', mySet.entries()) // SetIterator SetIterator {1 => 1, 2 => 2, 'nanjiu' => 'nanjiu', Array(1) => Array(1), {…} => {…}}
```

首先前三个方法都是返回遍历器，用于遍历Set，当然Set结构默认是可遍历的，它的默认遍历器生成函数就是它的values方法，这个从上面第一张图可以看出来

#### Set与Array的区别

- Set中的元素不可重复，而Array中的元素是可重复的
- 构建方式不同，Array支持多种构建方式（构造函数、字面量），而Set只支持使用构造函数来构建
- Set不支持像Array一样通过索引随机访问元素
- Set只提供了一些基本的操作数据的方法，Array提供了更多实用的原生方法（reduce(),map(),sort()等）

### WeakSet

ES6中新增的弱集合是一种新的集合类型，WeakSet是Set的兄弟类型。其API也是Set的子集。WeakSet中的Weak（弱），描述的是JavaScript垃圾回收程序对待弱集合中值的方式。

#### 常用API

  - 「WeakSet.prototype.add(value)」 :  添加元素，返回添加后的WeakSet
  - 「WeakSet.prototype.delete(value)」 :  删除元素，返回一个布尔值，表示是否删除成功
  - 「WeakSet.prototype.has(value)」 : 返回一个布尔值，表示该元素是否是WeakSet的成员

```js
const per = {name: 'nanjiu'}
const per2 = {name: 'WeakSet'}
const ws = new WeakSet([{}, per])

console.log('add', ws.add(per2))
console.log('delete', ws.delete({})) // false
console.log('delete', ws.delete(per2)) // true
console.log('has', ws.has(per)) // true
console.log(ws) // {{…}, {…}}
```

WeakSet没有了size属性，并且只有add, delete, has方法，还有就是它没有了默认遍历器生成函数（Symbol.iterator），这也就说明它是不可遍历的。」

#### 弱值

WeakSet中 ‘weak’ 表示弱集合的值是 ‘弱弱的拿着’。意思就是这些值不属于正式的引用，不会阻止垃圾回收，也就是说如果其它对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象在存在于WeakSet中。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于WeakSet内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后可能成员个数是不一样的，而「垃圾回收机制什么时候运行是不可预测的」，所以WeakSet没有size属性以及不可遍历。

#### WeakSet的应用场景

可以用于存储DOM节点，而不用担心节点从文档移除时引发内存泄漏」

```js
const disabledElements = new WeakSet(); 
const loginButton = document.querySelector('.login');  // 通过加入对应集合，给这个节点打上“禁用”标签 
disabledElements.add(loginButton);
```

#### WeakSet总结

- WeakSet的成员只能是对象，而Set的成员可以是任何类型
- WeakSet没有size属性且不可遍历，而Set有size属性且可遍历
- WeakSet中的成员都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，其它对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存

## 总结

- Set
    - 成员唯一、无序且不重复
    - [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
    - 可以遍历，方法有：add、delete、has、clear、keys、values、entries、forEach
- WeakSet
    - 成员都是对象
    - 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
    - 不能遍历，方法有add、delete、has
- Map
    - 本质上是键值对的集合，类似集合，键名可以是任何数据类型
    - 可以遍历，方法有get、set、has、delete、clear、keys、values、entries、forEach
    - 可以跟各种数据格式转换
- WeakMap
    - 只接受对象最为键名（null除外），不接受其他类型的值作为键名
    - 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
    - 不能遍历，方法有get、set、has、delete

## 参考

- [ES6中的Set、WeakSet、Map、WeakMap](https://mp.weixin.qq.com/s/-9YJZxYMmsHeWKktnDDmFw)
