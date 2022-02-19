// 快排
const quickSort=function (arr){
    if(!Array.isArray(arr)||arr.length<2){
        return arr
    }
    const target=arr[0]
    const left= []
    const right=[]
    for (let index = 0; index < array.length; index++) {
        const target=arr[i]
        if(arr[i]<target){
            left.push(arr[i])
        }else{
            right.push(arr[i])
        }
    }
    return [...quickSort(left),target,...quickSort(right)]
}

//两数之和（暴力法）
const twoSum4 =function(arr,target){
    if(arr.length<2)return arr
    for(let i =0 ;i<arr.length;i++){
        for(let j=i+1;j<arr.length-1;j++){
            if(arr[i]+arr[j]==target){
                return [i,j]
            }
        }
    }
}

const twoSum22 =function (arr,target){
    if(arr.length<2)return arr
    const map=Map()
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const diff=target-element
        if(map.has(diff)){
            return [map.get(diff),index]
        }
        map.set(element,index)
    }
}

//两数之和-求差
const twoSum =function(arr,target){
    if(arr.length<2){
        return arr
    }
    const map= new Map()
    for(let i=0;i<arr.length;i++){
        const diff=target-arr[i]
        if(map.has(diff)){
            return [map.get(diff),i]
        }
        map.set(nums[i],i)
    }
}

//三数之和
const threeSum=function(nums,target){
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

const twoSum2=function (target,arr){
    if(arr.length<2){return arr}
    const map=new Map()
    for(let i=0;i<arr.length;i++){
        const diff =target- arr[i]
        if(map.has(diff)){
            return [map.get(diff),i]
        }
        map.set(arr[i],i)
    }
}

const twoSum3=function(nums){
    if(arr.length<3)return[]
    const result=[]
    nums.sort((a,b)=>a-b)
    for(let i=0;i<nums.length;i++){
        //跳过重复数字
        if(i&&nums[i]===nums[i+1]) continue
        let left = i+1
        let right = nums.length-1
        while(left<right){
            const value=nums[i]+nums[left++]+nums[right--]
            if(value>0){
                right--
            }else if(value<0){
                left++
            }else{
                result.push([nums[i],nums[left++],nums[right--]])
                while (nums[left]===nums[left-1]) {
                    left++;
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

const isValid3 =function (s){
    if (typeof s !=='string') return false
    const map ={
        '{':'}',
        '(':')',
        '[':']'
    }
    let stack=[]
    for(let i=0;i<s.length;i++){
        if(map[s[i]]){
            stack.push(s[i])
        }else if(s[i]!==map[stack.pop()]){
            return false
        }
    }
    return stack.length === 0

}

const hasCycle =function (head){
    if(!head||head.next) return false
    while (head) {
        if(head.flag)return true
        head.flag=true
        head=head.next
    }
    return false
}