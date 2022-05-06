/*
 * @Author: mokinzhao
 * @Date: 2021-03-30 20:34:44
 * @Description: 手写基础函数
 */

Function.prototype._new=function(){
    const obj={}
    const Constructor=Array.prototype.shift.call(arguments)
    obj.__proto__=Constructor.prototype
    const ret=Constructor.apply(obj,arguments)
    return typeof ret =='object'?ret:obj
}

Function.prototype._instanceof=function(target,fn){
    if(typeof target !=='object' || target==null) return false
    let proto=target.__proto__
    while(proto){
        if(proto==fn.prototype) return true
        proto=proto.__proto__
    }
    return false
} 

Function.prototype._apply=function(context){
    const context=context||window
    context.fn=this
    const arg=arguments[1]
    if(!(arg instanceof Array)){
        throw new TypeError( 'args is not a Array')
    }
    const res=context.fn(...arg)
    delete context.fn
    return res
}

Function.prototype._call=function(context,...arg){
    var context = context || window // 获取需要改变的this
    context.fn = this // 获取需要改变this的函数
    const res = context.fn(...arg) // 将参数传给函数并执行
    delete context.fn // 删除该方法
    return res // 返回函数返回值
  }

  Function.prototype._bind=function(context,...arg){
    var context = context || window //获取需要改变的this
    context.fn = this  // 获取需要改变this的函数
        // 与apply，call不同的是这里需要返回一个函数
    return () => {
        return context.fn.apply(context,[...arg])
    }
 }