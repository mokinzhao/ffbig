---
title: React原理-渲染流程
---


## Init阶段

- 特点

初始化阶段，

## Render阶段


- 特点 

可同步，可异步


### BeginWork


### CompleteWork


## Commit阶段

- 特点

同步执行

### Before Mutation

- 这个阶段 DOM 节点还没有被渲染到界面上去

1. 过程中会触发 getSnapshotBeforeUpdate

2. 也会处理 useEffect 钩子相关的调度逻辑

### Mutation

- 这个阶段负责 DOM 节点的渲染

在渲染过程中，会遍历 effectList，根据 flags（effectTag）的不同，执行不同的 DOM 操作

### Layout

这个阶段处理 DOM 渲染完毕之后的收尾逻辑

1. 会调用componentDidMount/componentDidUpdate，
2. 调用 useLayoutEffect 钩子函数

重点：**会把 fiberRoot 的 current 指针指向 workInProgress Fiber 树**


## 经典问答

- setState 后的流程是什么？

1. 


- setState 是同步还是异步的？



