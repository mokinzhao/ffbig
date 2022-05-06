---
title: JavaScript之数组
---

## 内置函数

### Array.isArray

```js
Array.myIsArray = function(o) {
  return Object.prototype.toString.call(Object(o)) === '[object Array]';
};
console.log(Array.myIsArray([])); // true
```

### forEach

原生的forEach方法中接收2个参数 callback 和 thisArg ，并且 callback 函数传入三个参数，数组当前项的值，索引，数组本身

```js
Array.prototype.myForEach = function (callback, thisArg) {
    // 判断调用该API的元素是否为null
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    // 判断是否为function
    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function')
    }
    // 通过this得到调用者arr
    const arr = this
    // 确定循环变量
    let index = 0
    // 循环遍历给每个数组元素调用callback
    while (index < arr.length) {
        // 判断是否存在这个项
        if (index in arr) {
            // 通过call将this指向thisArg，并且传入3个参数
            callback.call(thisArg, arr[index], index, arr)
        }
        index++
    }
}
```

### map

与 forEach 方法相比，map 方法有返回值而 forEach 方法没有返回值。
map也叫映射，也就是将原数组映射成一个新数组

1. 数组中的每一个元素都会调用一个提供的函数后返回结果。
2. 会新建一个数组，需要有承载对象，也就是会返回一个新的对象
3. 除非用原有数组去承载，否则原有数组不会改变

```js
Array.prototype.myMap = function(fn) {
    // 判断输入的第一个参数是不是函数
    if (typeof fn !== 'function') {
        throw new TypeError(fn + 'is not a function');
    }
    // 获取需要处理的数组内容
    const arr = this;
    const len = arr.length;
    // 新建一个空数组用于装载新的内容
    const temp = new Array(len);
    // 对数组中每个值进行处理
    for (let i = 0; i < len; i++) {
        // 获取第二个参数，改变this指向
        let result = fn.call(arguments[1], arr[i], i, arr);
        temp[i] = result;
    }
    // 返回新的结果
    return temp;
}
```

### filter

```js
Array.prototype.myFilter = function (fn) {
    if (typeof fn !== 'function') {
        throw new TypeError(`${fn} is not a function`);
    }
    // 获取该数组
    const arr = this;
    // 获取该数组长度
    const len = this.length >>> 0;
    // 新建一个新的数组用于放置该内容
    const temp = [];
    // 对数组中每个值进行处理
    for (let i = 0; i < len; i++) {
        // 处理时注意this指向
        const result = fn.call(arguments[1], arr[i], i, arr);
        result && temp.push(arr[i]);
    }
    return temp;
}
```

### some

- 只要数组有一项符合处理条件。返回true，都不满足返回false

```js
Array.prototype.mySome = function (callback, thisArg) {
    if (this == undefined) {
        throw new TypeError('this is null or not defined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    let arr = this
    let len = arr.length
    for (let i = 0; i < len; i++) {
        if (i in arr) {
            if (callback.call(thisArg, arr[i], i, arr)) {
                return true
            }
        }
    }
    return false
}

```

### every

```js
Array.prototype.myEvery = function (callback, thisArg) {
    if (this == undefined) {
        throw new TypeError('this is null or not defined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    const arr = this
    const len = arr.length
    for (let i = 0; i < len; i++) {
        if (i in arr) {
            if (!callback.call(thisArg, arr[i], i, arr)) {
                return false
            }
        }
    }
    return true
}
```

### find

```js
Array.prototype.myFind = function (callback, thisArg) {
    if (this == undefined) {
        throw new TypeError('this is null or not defined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    // 保存this，也就是调用者
    const arr = this
    const len = arr.length
    for (let i = 0; i < len; i++) {
        if (i in arr) {
            if (callback.call(thisArg, arr[i], i, arr)) {
                return arr[i]
            }
        }
    }
    return undefined
}
```

### findIndex

```js
Array.prototype.myFind = function (callback, thisArg) {
    if (this == undefined) {
        throw new TypeError('this is null or not defined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    // 保存this，也就是调用者
    const arr = this
    const len = arr.length
    for (let i = 0; i < len; i++) {
        if (i in arr) {
            if (callback.call(thisArg, arr[i], i, arr)) {
                //返回当前下标
                return i
            }
        }
    }
    return undefined
}
```

### reduce

不同于迭代方法，reduce是一种归并方法，归并并不是对每一项都执行目标函数，可以概括成以下几步：

1. 不断地对数组地前两项取出，对它执行目标函数，计算得到的返回值
2. 把返回值插到数组首部，也就是作为array[0]
3. 持续执行这个过程，直至数组中的每一项都访问一次
4. 返回最终结果

```js


Array.prototype.myReduce = function (callback, initialValue) {
    // 判断调用该API的元素是否为null
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    // 判断是否为function
    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function')
    }
    let ret=initialValue || 0
    const arr=this
    for(let i=0;i<arr.length;i++){
        ret=callback.call(null,ret,arr[i],i,arr)
     }
    return ret

}

```

### flat (扁平化)

```js
// 使用reduce和concat
Array.prototype.flat1 = function () {
    return this.reduce((acc, val) => acc.concat(val), []);
}

// 使用堆栈stack
Array.prototype.flat5 = function(deep = 1) {
    const stack = [...this];
    const result = [];
    while (stack.length > 0) {
        const next = stack.pop();
        if (Array.isArray(next)) {
            stack.push(...next);
        } else {
            result.push(next);
        }
    }
    
    // 反转恢复原来顺序
    return result.reverse();
}

// 使用reduce + concat + isArray +recursivity
Array.prototype.flat2 = function (deep = 1) {
    const flatDeep = (arr, deep = 1) => {
        // return arr.reduce((acc, val) => Array.isArray(val) && deep > 0 ? [...acc, ...flatDeep(val, deep - 1)] : [...acc, val], []);
        return deep > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, deep - 1) : val), []) : arr.slice();
    }

    return flatDeep(this, deep);
}
// 使用forEach + concat + isArray +recursivity
// forEach 遍历数组会自动跳过空元素
Array.prototype.flat3 = function (deep = 1) {
    const result = [];
    (function flat(arr, deep) {
        arr.forEach((item) => {
            if (Array.isArray(item) && deep > 0) {
                flat(item, deep - 1);
            } else {
                result.push(item);
            }
        })
    })(this, deep);

    return result;
}
// 使用for of + concat + isArray +recursivity
// for of 遍历数组会自动跳过空元素
Array.prototype.flat4 = function (deep = 1) {
    const result = [];
    (function flat(arr, deep) {
        for(let item of arr) {
            if (Array.isArray(item) && deep > 0) {
                flat(item, deep - 1);
            } else {
                // 去除空元素，因为void 表达式返回的都是undefined，不适用undefined是因为undefined在局部变量会被重写
                item !== void 0 && result.push(item);
            }
        }
    })(this, deep);

    return result;
}

```

### Sort(排序)

```js
Array.prototype.sort = function (arr) {
  //空数组或数组长度小雨2，直接返回
  if (!arr || arr.length < 2) {
    return arr;
  }
  let runs = [],
    sortedRuns = [],
    newRun = [arr[0]],
    length = arr.length;
  //划分 run 区，并存储到runs 中，这里简单的按照升序划分，没有考虑降序的run
  for (let i = 1; i < length; i++) {
    if (arr[i] < arr[i - 1]) {
      runs.push(newRun);
      newRun = [arr[i]];
    } else {
      newRun.push(arr[i]);
    }
    if (length - 1 === i) {
      runs.push(newRun);
      break;
    }
  }
  //由于仅仅是升序的run，没有涉及到run的扩充和降序的run，因此其实这里没有必要使用insertionSort来进行run自身的排序
  for (let run of runs) {
    insertionSort(run);
  }
  //合并 runs
  sortedRuns = [];
  for (let run of runs) {
    sortedRuns = merge(sortedRuns, run);
  }
  return sortedRuns;
};

//合并两个小数组left,right 到result
function merge(left, right) {
  let result = [],
    indexLeft = 0,
    indexRight = 0;
  while (indexLeft < left.length && indexRight < right.length) {
    if (left[indexLeft] < right[indexRight]) {
      result.push(left[indexLeft++]);
    } else {
      result.push(right[indexRight++]);
    }
    return result;
  }
  while (indexLeft < left.length) {
    result.push(left[indexLeft++]);
  }

  while (indexRight < right.length) {
    result.push(right[indexRight++]);
  }
}
```

## 常用函数

### 数组去重

- 方法一：Set（ES6）

```js
function unique(arr) {
    return Array.from(new Set(arr))
}
// 或者
var unique = arr => [...new Set(arr)]

// 测试
var arr = [1, 2, 2, 3]
unique(arr); // [1, 2, 3]

```

- 方式二：reduce

```js
function unique (arr) {
    return arr.sort().reduce((acc, cur) => {
    	if (acc.length === 0 || acc[acc.length - 1] !== cur) {
        	acc.push(cur);
    	}
    	return acc
	}, [])
}

// 测试
var arr = [1, 2, 2, 3]
unique(arr); // [1, 2, 3]

```

- 方法三：filter

```js
function unique(arr) { 
    return arr.filter( (element, index, array) => {
    	return array.indexOf(element) === index
	})
}

// 测试
var arr = [1, 2, 2, 3]
unique(arr); // [1, 2, 3]

```

- 方法四：include

```js
const unique3 = arr => {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!res.includes(arr[i])) res.push(arr[i]);
  }
  return res;
}

```

- 方法五：map

```js
const unique5 = arr => {
  const map = new Map();
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!map.has(arr[i])) {
      map.set(arr[i], true)
      res.push(arr[i]);
    }
  }
  return res;
}

```

- 方法六：indexOf

```js
const unique2 = arr => {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) res.push(arr[i]);
  }
  return res;
}

```

### 数组扁平化

- 方法一：使用 reduce 方法

```js
function flattenDeep(arr) { 
    return Array.isArray(arr)
      ? arr.reduce( (acc, cur) => [...acc, ...flattenDeep(cur)] , [])
      : [arr]
}

// 测试
var animals = ["🐷", ["🐶", "🐂"], ["🐎", ["🐑", ["🐲"]], "🐛"]]
flattenDeep(animals)
// ["🐷", "🐶", "🐂", "🐎", "🐑", "🐲", "🐛"]

```

- 方法二：使用flat()

```js
const res1 = arr.flat(Infinity);

```

- 实现 flat 函数

```js
function flat(arr, depth = 1) {
    return depth > 0
        ? arr.reduce((acc, cur) => {
        if(Array.isArray(cur)) {
            return [...acc, ...flat(cur, depth-1)]
        }
        return [...acc, cur]
    } , [])
      : arr
}

// 测试
var animals = ["🐷", ["🐶", "🐂"], ["🐎", ["🐑", ["🐲"]], "🐛"]]
// 不传参数时，默认扁平化一层
flat(animals)
// ["🐷", "🐶", "🐂", "🐎", ["🐑", ["🐲"]], "🐛"]

// 传入一个整数参数，整数即扁平化的层数
flat(animals, 2)
// ["🐷", "🐶", "🐂", "🐎", "🐑", ["🐲"], "🐛"]

// Infinity 关键字作为参数时，无论多少层嵌套，都会转为一维数组
flat(animals, Infinity)
// ["🐷", "🐶", "🐂", "🐎", "🐑", "🐲", "🐛"]

// 传入 <=0 的整数将返回原数组，不扁平化
flat(animals, 0)
flat(animals, -10)
// ["🐷", ["🐶", "🐂"], ["🐎", ["🐑", ["🐲"]], "🐛"]];

// 如果原数组有空位，flat()方法会跳过空位。
var arr = ["🐷", "🐶", "🐂", "🐎",,]
flat(arr)
// ["🐷", "🐶", "🐂", "🐎"]
```

- 方法三：使用栈

```js
unction flattenDeep(arr) {
  const result = [] 
  // 将数组元素拷贝至栈，直接赋值会改变原数组
  const stack = [...arr]
  // 如果栈不为空，则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop() 
    if (Array.isArray(val)) {
      // 如果是数组再次入栈，并且展开了一层
      stack.push(...val) 
    } else {
      // 如果不是数组，就用头插法插入到结果数组中
      result.unshift(val)
    }
  }
  return result
}

// 测试
var animals = ["🐷", ["🐶", "🐂"], ["🐎", ["🐑", ["🐲"]], "🐛"]]
flattenDeep(animals)
// ["🐷", "🐶", "🐂", "🐎", "🐑", "🐲", "🐛"]

```

- 方法四：正则

```js

//但数据类型都会变为字符串
const res2 = JSON.stringify(arr).replace(/\[|\]/g, '').split(',');

//改良版本
const res3 = JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']');

```

- 方法五： 函数递归

```js
const res5 = [];
const fn = arr => {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      fn(arr[i]);
    } else {
      res5.push(arr[i]);
    }
  }
}
fn(arr);

```


### 类数组转化为数组

类数组是具有length属性，但不具有数组原型上的方法。常见的类数组有arguments、DOM操作方法返回的结果。

- 方法一：Array.from

```js
Array.from(document.querySelectorAll('div'))

```

- 方法二：Array.prototype.slice.call()

```js
Array.prototype.slice.call(document.querySelectorAll('div'))

```

- 方法三：扩展运算符

```js
[...document.querySelectorAll('div')]

```

- 方法四：利用concat

```js
Array.prototype.concat.apply([], document.querySelectorAll('div'));

```

### 数组考题

- 给定两个数组，编写一个函数来计算它们的交集

解题思路：

1. filter 过滤
2. Set 去重

```js
//示例 1:
输入: nums1 = [1,2,2,1], nums2 = [2,2]
输出: [2]

const intersection = function(nums1, nums2) {
    return [...new Set(nums1.filter((item)=>nums2.includes(item)))]
};

```

- 编写一个函数计算多个数组的交集

```js
const intersection = function(...args) {
    if (args.length === 0) {
    return []
  }
  if (args.length === 1) {
    return args[0]
  }
  return [...new Set(args.reduce((result, arg) => {
    return result.filter(item => arg.includes(item))
  }))]
};

```

## 参考

[JavaScript数组去重（12种方法，史上最全）](https://segmentfault.com/a/1190000016418021)

[js 数组详细操作方法及解析合集](https://juejin.cn/post/6844903614918459406#heading-4)

[【神来之笔】原生 JavaScript 手写数组 API](https://juejin.cn/post/6993479920705880095#heading-14)
