---
title: React-Reconciler&Fiber
---

### 源码顺序

- 实现虚拟Dom

- 开始workOnRoot

1. beginWork构建

2. completeWork完成

- 遍历fiber

1. 开始遍历fiber节点之后
2. 如果有儿子，开始处理儿子
3. 如果没有儿子，自己结束了，开始处理弟弟
4. 如果没有弟弟，父亲就结束了，说明自己是最小到儿子了，开始处理叔叔
5. 如果没有叔叔，找它爷爷
