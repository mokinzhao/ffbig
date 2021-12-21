/*
 * @Author: mokinzhao
 * @Date: 2021-04-07 17:26:48
 * @Description: 树和递归
 */

// #104 二叉树的最大深度
/*
给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

说明: 叶子节点是指没有子节点的节点。

示例：
给定二叉树 [3,9,20,null,null,15,7]，
    3
   / \
  9  20
    /  \
   15   7
返回它的最大深度 3
 */

var maxDepth = function (root) {
  if (!root) {
    return 0;
  }
  if (!root.left && !root.right) {
    return 1;
  }
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};

// #101 对称二叉树

/* 
给定一个二叉树，检查它是否是镜像对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

    1
   / \
  2   2
 / \ / \
3  4 4  3
 

但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

    1
   / \
  2   2
   \   \
   3    3
*/

var isSymmetric = function (root) {
  return isMirror(root, root);
};

var isMirror = function (t1, t2) {
  if (t1 == null && t2 == null) {
    return true;
  }
  if (t1 == null || t2 == null) {
    return false;
  }
  return (
    t1.val == t2.val &&
    isMirror(t1.right, t2.left) &&
    isMirror(t1.left, t2.right)
  );
};




// 给定一个树，给定一个节点id，返回从root到该节点的path（从跟节点到查询节点的路径上所有节点的id，
// 以短横线连接）、以及该节点的所有子孙节点中是叶子节点的节点id数组

const exampleTree = {
    _id: 1,
    children: [{
      _id: 2,
      children: [{
        _id: 4,
        children: [{
          _id: 7,
          children: []
        }]
      }, {
        _id: 5,
        children: []
      }]
    }, {
      _id: 3,
      children: [{
        _id: 6,
        children: [{
          _id: 8,
          children: [{
            _id: 10,
            children: []
          }]
        }, {
          _id: 9,
          children: []
        }]
      }]
    }]
  }
  
  
  const exampleId = 6
  const exampleResult = {
    path: '1-3-6',
    leaves: [9, 10]
  }


  const getNode = (exampleId,tree)=>{
    
    if(!tree. '[object Object]') return null
    let path=''
    let leaves=[]
    //递归遍历
    

  }



  //反转二叉树
  const invertTree =function (root){
        if(root ===null){
            return null
        }
        invertTree(root.left)
        invertTree(root.right) 
        const temp =root.left
        root.left= root.right
        root.right =temp
        return root
  }

  //判断两颗树是否相同
  
