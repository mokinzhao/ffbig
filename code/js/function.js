/*
 * @Author: mokinzhao
 * @Date: 2021-04-07 17:26:08
 * @Description: 常用工具函数
 */

//防抖
const debounce = (fn, dealy) => {
  let timer = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, dealy);
  };
};
const debounce = (fn, dealy) => {
  let timer = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, dealy);
  };
};

const debounce=function(fun,dealy){
    let timer=null
    return function () {
        if(timer) clearTimeout(timer)
        timer=setTimeout(() => {
            fun.apply(this,arguments)
        }, dealy);
    }
} 


const debounce= function (fun,dealy) {
    let timer=null;
    return function(){
        if(timer)clearTimeout(timer)
        timer =setTimeout(() => {
            fun.apply(this,arguments)
        }, dealy);
    }
    
}

//节流
const throttle = (fn, dealy) => {
  let timer = null;
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, dealy);
    }
  };
};

const throttle = (fn, dealy) => {
  let timer = null;
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, dealy);
    }
  };
};


//节流

const throttle=(fun,dealy)=>{
    let timer=null
    return ()=>{
        if(!timer){
            timer=setTimeout(() => {
                fun.apply(this,arguments)
                timer=null
            }, dealy);
        }
    }
}

//防抖

const debounce=(fun,dealy)=>{
    let timer=null
    return function(){
        if(timer) clearTimeout(timer)
        timer=setTimeout(() => {
            fun.apply(this,arguments)
        }, dealy);
    }
}


//函数克里化
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
