---
title: Javascript-数组二
---

![2019-06-20-06-00-27](https://vp-blog-img.oss-cn-shanghai.aliyuncs.com/2021/js/02-JavaScript%E6%95%B0%E7%BB%84%E4%BA%8C.png)


## 内置函数

### Array.isArray

```js
Array.myIsArray = function(o) {
  returnObject.prototype.toString.call(Object(o)) === '[object Array]';
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
Array.prototype.myMap = function (callback, thisArg) {
    // 和forEach相同需要进行两个排除
    if (this == undefined) {
        throw new TypeError('this is null or not defined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    // 与forEach不同的是，map会返回一个新数组
    const ret = []
    // 获得函数调用者
    const arr = this
    // 数组长度
    let len = arr.length
    // 对每一个元素执行回调函数
    for (let i = 0; i < len; i++) {
        // 检查i是否在arr
        if(i in arr) {
            ret[i] = callback.call(thisArg, arr[i], i, arr)
        }
    }
    // 返回一个处理后的数组
    return ret
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

- 使用

```js
const arr = [1, 2, 3]
const res = arr.reduce((prev, cur) => prev + cur)
console.log(res); // 6
```

不同于迭代方法，reduce是一种归并方法，归并并不是对每一项都执行目标函数，可以概括成以下几步：

1. 不断地对数组地前两项取出，对它执行目标函数，计算得到的返回值
2. 把返回值插到数组首部，也就是作为array[0]
3. 持续执行这个过程，直至数组中的每一项都访问一次
4. 返回最终结果

```js
Array.prototype.myReduce = function(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError(`${fn} is not a function`);
    }

    const arr = this;
    const len = arr.length >>> 0;
    let value;// 最终返回的值
    let k = 0;// 当前索引

    if (arguments.length >= 2) {
        value = arguments[1];
    } else {
        // 当数组为稀疏数组时，判断数组当前是否有元素，如果没有索引加一
        while (k < len && !( k in arr)) {
            k++;
        }
        // 如果数组为空且初始值不存在则报错
        if (k >= len) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        value = arr[k++];
    }
    while (k < len) {
        if (k in arr) {
            value = fn(value, arr[k], k, arr);
        }
        k++;
    }

    return value;
}
```

### flat (扁平化)

```js
// 使用reduce和concat
Array.prototype.flat1 = function () {
    return this.reduce((acc, val) => acc.concat(val), []);
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
