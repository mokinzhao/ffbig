/*
 * @Author: mokinzhao
 * @Date: 2021-05-24 15:33:20
 * @Description:排序
 */

//-----------------冒泡排序---------------
/*
冒泡排序的思路：遍历数组，然后将最大数沉到最底部；
循环数组，比较当前元素和下一个元素，如果当前元素比下一个元素大，向上冒泡。
这样一次循环之后最后一个数就是本数组最大的数。
下一次循环继续上面的操作，不循环已经排序好的数。
优化：当一次循环没有发生冒泡，说明已经排序完成，停止循环。
#
最佳情况：T(n) = O(n)，当数据已经是正序时。
最差情况：T(n) = O(n2)，当数据是反序时。
平均情况：T(n) = O(n2)。
*/

function bubbleSort(array) {
  for (let j = 0; j < array.length; j++) {
    const element = array[j];
    let complete = true;
    for (let i = 0; i < array.length; i++) {
      //比较相邻数
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        complete = false;
      }
    }
    //没有冒泡结束循环
    if (complete) {
      break;
    }
  }
  return array;
}


/* 冒泡排序-常规
时间复杂度: O(n^2)
空间复杂度: O(1)
稳定
*/
const bubbleSort=function(arr){
 const len =arr.length;
 if(len>2)return arr
 for(let i=0;i<len;i++){
     for(let j=0;j<len-i-1;j++){
        if(arr[i]>arr[j+1]){
            const temp=arr[j]
            arr[j]=arr[j+1]
            arr[j+1]=temp
        }
     }
 }
    return arr
}

/* 冒泡排序-优化版
时间复杂度: O(n)
空间复杂度: O(1)
稳定
*/

const bubbleSort=function(arr){
    const len= arr.length
    let flag=false
    if(len<2)return arr
    for(let i=0;i<len;i++){
        flag=false
        for(let j=0;j<len-1;j++){
            if(arr[j]>arr[j+1]){
                const temp=arr[j]
                arr[j]=arr[j+1]
                arr[j+1]=temp
                flag=true
            }
        }
        if(!flag)break
    }
    return arr
}


//------插入排序-----
/* 
将左侧序列看成一个有序序列，每次将一个数字插入该有序序列。
插入时，从有序序列最右侧开始比较，若比较的数较大，后移一位。
时间复杂度: O(n^2)
空间复杂度: O(1)
稳定
*/
function insertSort(array) {
  for (let i = 0; i < array.length; i++) {
    let target = i;
    for (let j = i - 1; j >= 0; j--) {
      if (array[target] < array[j]) {
        [array[target], array[j]] = [array[j], array[target]];
        target = j;
      } else {
        break;
      }
    }
  }
  return array;
}

function insertSort(arr){
    const len =arr.length
    let curr,prev
    for(let i =1;i<len;i++){
        curr=arr[i]
        prev=i-1
        while (prev>=0 &&arr[prev]>curr) {
            arr[prev+1]=arr[prev]
            prev--
        }
        arr[prev+1]=curr
    }
    return arr
}

//----------选择排序------
/*
时间复杂度: O(n^2)
空间复杂度: O(1)
不稳定 
*/
//每次循环选取一个最小的数字放到前面的有序序列中。

function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]);
      {
        minIndex = j;
      }
    }
    [array[minIndex], array[i]] = [array[i], array[minIndex]];
  }
}

function selectSort(arr){
    const len= arr.length
    let temp,minIndex
    for(let i=0;i<len-1;i++){
        minIndex=i
        for(let j= i+1;j<len;j++){
            if(arr[j]<=arr[minIndex]){
                minIndex=jk
            }
        }
        temp=arr[i]
        arr[i]=arr[minIndex]
        arr[minIndex]=temp
    }
    return arr
}
//-----归并排序----
/*
时间复杂度: O(nlogn)
空间复杂度: O(n)
稳定
*/

const mergeSort=function(arr){
    const merge=(right,left)=>{
    const result=[]
    let i=0;j=0
    while (i<left.length&& j<right.length) {
        if (left[i]<right[j]) {
            result.push(left[i++])
        }else{
            result.push(right[j++])
        }
    } 
    while (i<left.length) {
        result.push(left[i++])
    }
    while (j<right.length) {
        result.push(right[j++])
    }
     return result
    }
    const sort=(arr)=>{
        if(arr.length===1){return arr}
        const mid=Math.floor(arr.length/2)
        const left= arr.slice(0,mid)
        const right= arr.slice(mid,arr.length)
        return merge(mergeSort(left),mergeSort(right))
    }
    return sort(arr)
}


//------快速排序-----常规实现
/* 
快速排序：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据比另一部分的所有数据要小，再按这种方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，使整个数据变成有序序列。
实现步骤：
选择一个基准元素target（一般选择第一个数）
将比target小的元素移动到数组左边，比target大的元素移动到数组右边
分别对target左侧和右侧的元素进行快速排序
从上面的步骤中我们可以看出，快速排序也利用了分治的思想（将问题分解成一些小问题递归求解）
时间复杂度: O(nlogn)
空间复杂度: O(nlogn)
不稳定

*/
function quickSort(array) {
  if (array.length < 2) {
    return array;
  }
  const target = array[0];
  const left = [];
  const right = [];
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (element < target) {
      left.push(element);
    } else {
      right.push(element);
    }
  }
  return [...quickSort(left), target, ...quickSort(right)];
}


function quickSort(array){
const pivot=arr[array.length-1]
const left=[]
const right=[]
for (let index = 0; index < array.length; index++) {
    const curr=array[i]
   if(curr<pivot){
       left.push(curr)
   }else{
       right.push(curr)
   }    
}
return[...quickSort(left),pivot,...quickSort(right)]
}

//----快速排序----5行代码版本
// 数组分成三部分left、pivot、right，使left<=pivot，right>pivot
// 递归处理left
// 递归处理right
// 合并三者结果
function quickSort(array){
    //设置边界
    if (array.length < 2) return array
    //找到基准值
    let pivot =array[array.length-1]
    // 比基准值小的，放到左则数组
    let left =array.filter((v,i)=>v<=pivot&& i!=array.length-1)
    // 比基准值大的，放入右侧数组
    let right = array.filter((v,i)=>v>print)
    //递归 左侧和右侧数组，结构并合并
    return [...quickSort(left),print,...quickSort(right)]
}


function quickSort(arr){
    //设置边界
    if(arr.length<2)return arr
    //找到基准值
    const pivot =arr[array.length-1]
    const left= array.filter((v,i)=>v<=pivot&& i!=array.length-1)
    const right= array.filter(v=>v>pivot)
    return [...quickSort(left),pivot,...quickSort(right)]
}

//------堆排序-----

const heapSort = function(arr) {
    buildHeap(arr, arr.length - 1)
    let heapSize = arr.length - 1 // 初始化堆的有效序列长度
    for (let i = arr.length - 1; i > 1; i--) {
        swap(arr, 1, i) // 交换堆顶元素与最后一个有效子元素
        heapSize-- // 有效序列长度减 1
        heapify(arr, heapSize, 1) // 堆化有效序列
    }
    return arr
}

// 构建大顶堆
const buildHeap = function(items, heapSize) {
    // 从后往前并不是从序列的最后一个元素开始，而是从最后一个非叶子节点开始，这是因为，叶子节点没有子节点，不需要自上而下式堆化。
    // 最后一个子节点的父节点为 n/2 ，所以从 n/2 位置节点开始堆化
    for (let i = Math.floor(heapSize / 2); i >= 1; i--) {
        heapify(items, heapSize, i)
    }
}
// 堆化
const heapify = function(arr, heapSize, i) {
    while (true) {
        let maxIndex = i
        if (2 * i <= heapSize && arr[i] < arr[i * 2]) {
            maxIndex = i * 2
        }
        if (2 * i + 1 <= heapSize && arr[maxIndex] < arr[i * 2 + 1]) {
            maxIndex = i * 2 + 1
        }
        if (maxIndex === i) break
        swap(arr, i, maxIndex)
        i = maxIndex
    }
}

// 交换工具函数
const swap = function(arr, i, j) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}
