---
title: JavaScript之工具函数
---

## JavaScript JavaScript 之工具函数

- 防抖(debounce)

```js
const debounce = (fn, delay = 1000) => {
  let timer;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};
```

- 节流(throttle)

```js
const throttle = (fn, dealy) => {
  let timer = null;
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, arguments);
      }, dealy);
    }
  };
};
```

- 函数克里化

```js
const curry = (func,...args)=>{
    //获取函数的参数个数
    const fnLen=func.length
    return function(...innerArgs){
        innerArgs=args.concat(innerArgs)
        //参数未搜集足的话，继续递归收集
        if(innerArgs.length<fn.length){
            return curry.call(this,func,...innerArgs)
        }else{
            //否则拿着搜集的参数调用func
            func.apply(this,innerArgs)
        }
    }
}
// 测试
const add=curry((num1,num2,num3)=>{
console.log(num1+ num2+num3)
})

add(1)(2)(3）//6  
add(1,2,3)  //6
add(1)(2,3) //6

```
