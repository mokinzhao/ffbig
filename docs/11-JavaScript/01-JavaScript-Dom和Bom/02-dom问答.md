---
title: Javascript-DOM问答
---

## 如何判断元素是否到达可视区域

- window.innerHeight 是浏览器可视区的高度

- document.body.scrollTop||document.documentElement.scrollTop是浏览器滚动的距离

- imgs.offsetTop 是元素顶部距离文档顶部的高度（包括滚动条的距离）

- 内容达到显示区域的：img.offsetTop < window.innerHeight+document.body.scrollTop

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c57fc165a4ce4d5b9a2885867d4f1cab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)


