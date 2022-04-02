


//10个人， 围成一个环， 报3，从1 开始报


//params 人数,报的编号, 

//return 剩下人的 编号

function search(nums,targetNum){
    if(nums.length<2) return nums
    let map=new Map()
    function dfs(){
        for(let i=0;i<nums.length;i++){
            if(i==targetNum){
                nums.splice(0,i)
                dfs()
                map.set(nums[i],i)
            }
        }
    }
    dfs()
    return [...nums]
}
