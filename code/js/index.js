//节流
const throttle=function(fun,delay){
    let timer=null
    return function(){
        if(!timer){
            timer=setTimeout(() => {
                fun.apply(this,arguments)
                timer=null;
            }, delay);
        } 
    }
}

//防抖
const debounce=function(fun,delay){
    let timer=null
    return function(){
        if(timer)clearTimeout(timer)
        timer=setTimeout(() => {
            fun.apply(this,arguments)
        }, delay);
    }
}

//发布订阅模式
class EventEmitter{
    constructor(){
        this.events={}
    }

    on(eventName,callback){
        if(!this.events[eventName]){
            this.events[eventName]=[callback]
        }else{
            this.events[eventName].push(callback)
        }
    }

    emit(eventName){
        this.events[eventName]&&this.events[eventName].forEach(cb=>cb())
    }

    once(eventName,callback){
        let fn=()=>{
            callback();
            this.off(eventName,fn)
        }
        this.on(eventName,fn)
    }

    off(eventName,callback){
        if(this.events[eventName]){
            this.events[eventName]=this.events[eventName].filter(cb=>cb !=callback)
        }
    }
}

// 函数柯理化 
//写法一
function curry(func){
    return function curried(...args){
        if(args.length>=func.length){
           return func.apply(this,args)
        }
        return function(...args2){
            return curried.apply(this,args.concat(args2))
        }
    }
}
//写法二
const currying=(fn,...args)=>fn.length>args.length?(...arguments)=>currying(fn,...args,...arguments):fn(...args)


function curry(func){
    return function curried(...args){
        if(args.length>=func.length){
            return func.apply(this,args)
        }
        return function (...args2){
            return curried.apply(this,args.concat(args2))
        }
    }
}
//LRUCache

//最近最少使用原则，使用就更新，不使用就排在队列后面
class LRU{
    constructor(max){
        this.cache =new Map();
        this.max=max
    }
    get(key){
        if(this.cache.has(key)){
            //存在即更新
            let temp =this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key);
            return temp
        }
        return -1
    }
    put(key,value){
        if(this.cache.has(key)){
            //存在即删除
            this.cache.delete(key);
        }else if(this.cache.size>=this.max){
            this.cache.delete(this.cache.keys().next().value)
        }
        //更新
        this.cache.set(key,value)
    }
}

//EventEmitter

class EventEmitter{
    constructor(){
        this.events={}
    }
    on(eventName,callback){
        if(!this.events[eventName]){
            this.events[eventName]=[callback]
        }else{
            this.events[eventName].push(callback)
        }
    }

    emit(eventName){
        this.events[eventName]&&this.events[eventName].forEach(cb=>cb())
    }

    once(eventName,callback){
        let fun=()=>{
            callback();
            this.remove(eventName,fun)
        }
        this.on(eventName,fun)
    }

    remove(eventName,callback){
        if(this.events[eventName]){
            this.events[eventName]=this.events[eventName].filter(cb=>cb!=callback)
        }
    }
    
    clear(){
    this.events={}
    }
}