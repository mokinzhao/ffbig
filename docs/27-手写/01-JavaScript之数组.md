---
title: JavaScript之数组
---

### 手写数组内置函数

- Array.isArray

```js
Array.myIsArray = function(o) {
  returnObject.prototype.toString.call(Object(o)) === '[object Array]';
};
console.log(Array.myIsArray([])); // true
```

- map

![](https://mmbiz.qpic.cn/mmbiz_jpg/q4qrl2ddrUvdZuoS9kmZeQVkcFCAVOOHXMnvbWnF9Y9ugoTjiauUsC2yKMuhyBdYYBSHUWjZnBFiaLUYibnEBbMxg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

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

- filter

  ![](https://mmbiz.qpic.cn/mmbiz_jpg/q4qrl2ddrUvdZuoS9kmZeQVkcFCAVOOHlyhxVnaQViaeeOGs0xMxVyMyh1ccuYh4ohZDMpjZKgco7uTCTiaGiaeQw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

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

- reduce

  ![](https://mmbiz.qpic.cn/mmbiz_jpg/q4qrl2ddrUvdZuoS9kmZeQVkcFCAVOOH2ic4xjMZSoX7dWwCAgz3d2cy7AGMmdRsKeTPLBP7PIib6ibhRcTyiaDgPA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

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

- flat

  ![](https://mmbiz.qpic.cn/mmbiz_jpg/q4qrl2ddrUvdZuoS9kmZeQVkcFCAVOOH8j3uLTJyA7xtgiakXbRPAWJQUgR28V2ic6J92t3richuhTCqKnwOUmc7w/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

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


### 手写数组常用函数

- 数组去重


- 数组扁平化
