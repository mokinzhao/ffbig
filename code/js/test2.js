// 查找一个树里面的某个对象，模拟document.byId

const object={id:'1',children:[{id:'2',children:[{id:'3',children:[]}]}]}
const search = function(obj,targetId) {
    let result=null
    function dfs(obj){
        if(obj.id==targetId){
            result =obj
        }else if (obj.children){
            obj.children.forEach((val)=>{
                if(val.id==targetId){
                    result= val
                }else{
                    dfs(val,targetId)
                }   
            })
        }
    }
    dfs(obj)
    return result
};

console.log('res',search(object,'3'))