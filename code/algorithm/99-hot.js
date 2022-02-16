//三数之和
const twoSum=function(nums,target){
    if(nums.length<3) return [] 
    nums.sort((a,b)=>a-b)
    const result=[]
    for(let i =0;i<nums.length;i++){
        if(i&&nums[i]===nums[i-1])continue
        let left =i+1
        let right = nums.length-1
        while (left<right) {
            const sum=nums[i]+nums[left]+nums[right]
            if(sum>0){
                right--
            }else if(sum){
                left++
            }else{
                result.push([nums[i],nums[left++],nums[right--]]);
                while(nums[left]===nums[left-1]){
                    left++
                }
                while (nums[right]===nums[right+1]) {
                    right--
                }
            }
        }
    }
    return result
}

//判断有效括号

const isValid =function(s){
    if(typeof s !='string'){
        return false
    }
    const map={
        '{':'}',
        '(':')',
        '[':']'
    }
    let stack=[]
    for(let i =0;i<s.length;i++){
        if(map[s[i]]){
            stack.push(s[i])
        }else if(s[i]!==map[stack.pop()]){
            return false
        }
    }
    return stack.length === 0
}