---
title: DFS、BFS
---

## DFS(深度优先遍历)
 
- 一个分枝走到底






## BFS(广度优先遍历)

- 逐层遍历



### 二叉树的层次遍历（中等）

- 解题思路

1. 层序遍历顺序就是广度优先遍历
2. 不过在遍历到时候需要记录当前节点所处到层级，方便将其添加到不同到数组中

- 解题步骤

1. 广度优先遍历二叉树
2. 遍历过程中，记录每个节点到层级，并将其添加到不同到数组中

```js
function levelOrder(root){
    if(!root)return [];
    const res=[];
    const queue=[root];
    while(queue.length){
        const levelSize=queue.length;
        const level=[];
        for(let i =0;i<levelSize;i++){
            const n=queue.shift();
            level.push(n.val);
            n.left&&queue.push(n.left);
            n.right&&queue.push(n.right);
        }
        res.push(level);
        
    }
    return res;
}   

```
