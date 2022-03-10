/*
 * @Author: mokinzhao
 * @Date: 2021-06-07 15:01:42
 * @Description: 数组手写原生API
 */

Array.prototype._isArray=function(object){
    return Object.prototype.toString.call(object) ==='[object Array]'
}

Array.prototype._forEach=function(callback,thisArg){
    if(!this){
        throw new TypeError('this is a not null or defined')
    }
    if(typeof callback !='function'){
        throw new TypeError(callback+'is a not a function')
    }
    const arr=this
    for(let i =0;i<arr.length;i++){
        if(i in arr){
            callback.call(thisArg,arr[i],i,arr)
        }
    }
}

Array.prototype._map=function(callback,thisArg){
    if(!this){
        throw new TypeError('this is a not null or defined')
    }
    if(typeof callback !='function'){
        throw new TypeError(callback+'is a not a function')
    }
    const arr=this
    const res=[]
    for(let i =0;i<arr.length;i++){
        if(i in arr){
           res[i]= callback.call(thisArg,arr[i],i,arr)
        }
    }
    return res
}

Array.prototype._filter=function(callback,thisArg){
    if(!this){
        throw new TypeError('this is a not null or defined')
    }
    if(typeof callback !='function'){
        throw new TypeError(callback+'is a not a function')
    }
    const arr=this
    const res=[]
    for(let i =0;i<arr.length;i++){
        if(i in arr){
            if(callback.call(thisArg,arr[i],i,arr)){
                res.push(arr[i])
            }
        }
    }
    return res
}

Array.prototype._some=function(callback,thisArg){
    if(!this){
        throw new TypeError('this is a not null or defined')
    }
    if(typeof callback !='function'){
        throw new TypeError(callback+'is a not a function')
    }
    const arr=this
    for(let i =0;i<arr.length;i++){
        if(i in arr){
            if(callback.call(thisArg,arr[i],i,arr)){
             return true
            }
        }
    }
    return false
}

Array.prototype._every=function(callback,thisArg){
    if(!this){
        throw new TypeError('this is a not null or defined')
    }
    if(typeof callback !='function'){
        throw new TypeError(callback+'is a not a function')
    }
    const arr=this
    for(let i =0;i<arr.length;i++){
        if(i in arr){
            if(!callback.call(thisArg,arr[i],i,arr)){
               return false
            }
        }
    }
    return true
}

Array.prototype._find=function(callback,thisArg){
    if(!this){
        throw new TypeError('this is a not null or defined')
    }
    if(typeof callback !='function'){
        throw new TypeError(callback+'is a not a function')
    }
    const arr=this
    for(let i =0;i<arr.length;i++){
        if(i in arr){
            if(callback.call(thisArg,arr[i],i,arr)){
               return arr[i]
            }
        }
    }
    return undefined
}


Array.prototype._findIndex=function(callback,thisArg){
    if(!this){
        throw new TypeError('this is a not null or defined')
    }
    if(typeof callback !='function'){
        throw new TypeError(callback+'is a not a function')
    }
    const arr=this
    for(let i =0;i<arr.length;i++){
        if(i in arr){
            if(callback.call(thisArg,arr[i],i,arr)){
               return i
            }
        }
    }
    return -1
}

Array.prototype._flat1=function(){
    return this.reduce((acc,val)=>acc.concat(val),[])
}

Array.prototype._flat2=function(){
    const stack=[...this]
    const result=[]
    while(stack.length>0){
        const next=stack.pop();
        if(Array.isArray(next)){
            stack.push(...next)
        }else{
            result.push(next)
        }
    }
    return result.reverse()
}