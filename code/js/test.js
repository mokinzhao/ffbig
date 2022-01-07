/*
 * @Author: mokinzhao
 * @Date: 2021-05-26 10:10:49
 * @Description:
 */

//防抖
function debounce(fn, dealy) {
  let timer = null;
  return function (params) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, dealy);
  };
}

//防抖
const debounce = function (fn, dealy) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, dealy);
  };
};

// 节流
function thottle(fn, dealy) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, dealy);
    }
  };
}

//节流
const thottle = function (fn, dealy) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout()
    }
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, dealy);
  };
};

const debounce =function (dealy,fn) {
    let timer=null
    return function () {
        if(timer){
            clearTimeout(timer)
        }
        setTimeout(() => {
            fn.apply(this,arguments)
        }, dealy);
    }
}

const debounce =function (dealy,fun){
    let timer =null
    return function () {
        if(timer)clearTimeout(timer)
        timer=setTimeout(() => {    
            fun.apply(this,arguments)
        }, dealy);
    }
}


const throttle =function (timeout,fun){
    let timer =null
    return function () {
        if(!timer){
            timer=setTimeout(() => {
                fun.apply(this,arguments)
                timer=null
            }, timeout);
        }
    }
}

// 函数柯理化
function curry(func) {
    return function curried(...args){
        if(args.length>=func.length){
            return func.apply(this,args)
        }
        return function(...args2){
            return curried.apply(this,args.concat(args2))
        }
    }
}

function sum(a,b,c){
    return a+b+c
}

const curriedSum =curry(sum)
console.log(curriedSum(1,2,3))
console.log(curriedSum(1)(2)(3))
console.log(curriedSum(1)(2,3))



