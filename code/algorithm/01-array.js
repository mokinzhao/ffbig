/*
 * @Author: mokinzhao
 * @Date: 2021-03-30 20:36:16
 * @Description:数组
 */

/* 两数字之和 */

//解法一 :map -两数求差
const twoSum=function(array,target){
    const map=new Map()
    for (let index = 0; index < array.length; index++) {
            const diff=target-array[i]
            if(map.has(diff)){
                return [map.get(diff),i]
            }
        map.set(array[i],i)
    }
}



//解法二 :object -两数求差
const twoSum=function(array,target){
 const object={}
 for (let index = 0; index < array.length; index++) {
    const diff=target-object[index]
    if(diff!=undefined){
        return [ diff,i]
    }
    object[array[i]]=i
 }
}



/* 三数之和 */
const threeSum=function(nums){
    //排除边界
    if(!nums||nums.length<3)return[]
    let result =[];
    let second;
    let last;
    //排序
    nums.sort((a,b)=>a-b)
    for (let index = 0; index < nums.length; index++) {
        if(nums[index]>0)break
        //去重
        if(i>0&&nums[index]===nums[index-1])continue
        second=i+1
        last =nums.length-1
        while (second<last) {
            const sum=nums[index]+nums[second]+nums[last]
            if(!sum){
                //sum 为0
                result.push([nums[index],nums[second],nums[last]])
                //去重
                while (second<last && nums[second]===nums[second+1]) {
                    second++
                }
                while (second<last && nums[last]===nums[last-1]) {
                    last--
                }
                second++
                last--
            }
            else if(sum<0){
                second++
            }
            else if(sum>0){
                last--
            }
        }
        return result
    }
}

const threeSum=function(sums){
    const result =[]
    nums.sort((a,b)=>a-b);
    for(let i=0;i<nums.length;i++){
        //跳过重复数字
        if(i&&nums[i]===nums[i-1]){
            continue;
        }
        let left=i+1;
        let right =nums.length-1;
        while (left<right) {
            const sum=nums[i]+nums[left]+nums[right];
            if(sum>0){
                right--
            }else if(sum<0){
                left++
            }else{
                result.push([nums[i],nums[left++],nums[right--]])
                //跳过重复数字
                while (nums[left]===nums[left-1]) {
                    left++;
                }
                // 跳过重复数字
                while (nums[right]===nums[right+1]){
                    right--;
                }
            }
        }
    }
    return result
}

//#20.有效的括号
/* 
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
有效字符串需满足：
左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
*/
const isValid = function (string) {
  const mapper = {
    "{": "}",
    "[": "]",
    "(": ")",
  };
  const stack = [];
  for (const i in string) {
    const v = string[i];
    if (["{", "[", "("].indexOf(v) > -1) {
      stack.push(v);
    } else {
      const peak = stack.pop();
      if (v !== mapper[peak]) {
        return false;
      }
    }
  }
  if (stack.length > 0) {
    return false;
  }
  return true;
};





