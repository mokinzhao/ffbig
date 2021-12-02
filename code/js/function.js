/*
 * @Author: mokinzhao
 * @Date: 2021-04-07 17:26:08
 * @Description: 常用工具函数
 */

//节流
const throttle = (fn, dealy) => {
	let timer = null
	return () => {
		if (!timer) {
			timer = setTimeout(() => {
				fn.apply(this, arguments)
				timer = null
			}, dealy)
		}
	}
}

//防抖
const debounce = (fun, dealy) => {
	let timer = null
	return () => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fun.apply(this, arguments)
		}, dealy)
	}
}

//函数克里化
const curry = (func, ...args) => {
	// 获取函数的参数个数
	const fnLen = func.length
	return function(...innerArgs) {
		innerArgs = args.concat(innerArgs)
		// 参数未搜集足的话，继续递归搜集
		if (innerArgs.length < fnLen) {
			return curry.call(this, func, ...innerArgs)
		} else {
			// 否则拿着搜集的参数调用func
			func.apply(this, innerArgs)
		}
	}
}

const curry = (fun, ...args) => {
	// 获取函数的参数个数
	const funLen = fun.length
	return (...innerArgs) => {
		innerArgs = args.concat(innerArgs)
		//参数未收集足的话，继续递归收集
		if (innerArgs.length < funLen) {
			return curry.call(this, fun, ...innerArgs)
		} else {
			fun.apply(this, innerArgs)
		}
	}
}

const curry = function(func) {
	return function curried(...args) {
		if (args.length >= func.length) {
			return func.apply(this, args)
		}
		return function(...args2) {
			return curried.apply(this, args.concat(args2))
		}
	}
}

const currying = (fn, ...args) =>
	fn.length >= args.length
		? (...arguments) => currying(this, ...args, ...arguments)
		: fn(...args)

function curry(func) {
	return function curried(...args) {
		//关键知识点：function.length 用来获取函数到形参个数
		//补充：arguments.length 获取到是实参个数
		if (args.length >= func.length) {
			return func.apply(this, args)
		}
		return function(...args2) {
			return curried.apply(this, args.concat(args2))
		}
	}
}


const debounce= function(func,dealy){
    let timer=null
    return function(){
        if(timer)clearTimeout(timer)
        timer=setTimeout(() => {
            func.apply(this,arguments)
        }, dealy);
    }
}

const throttle=function(func,dealy){
    let timer =null
    return function(){
        if(!timer){
            timer= setTimeout(() => {
                func.apply(this,arguments)
            }, dealy);
        }
    }
}


const curry=function(func){
    return function curried(...args){
        if(args.length>func.length){
          return func.apply(this,args)
        }
        return function(...args2){
           return curried.apply(this,args.concat(args2))
        }
    }
} 

const add=function(a,b,c){
   return a+b+c
}

const curryNums =curry(add)
console.log(curryNums(1,2,3))
console.log(curryNums(1)(2,3))
console.log(curryNums(1)(2)(3))


const curry=function (fun){
    return function curried(...args){
        if(args.length>=fun.length){
            return  fun.apply(this,args)
        }
    return function(...args2){
            return curried.apply(this,args.concat(args2))
    }
  }
}

const add =function(a,b,c){
    return a+b+c
}

const curryNums=curry(add)

console.log(curryNums(1,2,3))