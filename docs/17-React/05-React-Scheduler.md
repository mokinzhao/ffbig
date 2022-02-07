---
title: React原理-Scheduler&TimeSlice
---

## 调度器（Scheduler）




## 时间切片（TimeSlice）

### requestIdleCallback


## 问答环节

::: warning 问
requestIdleCallback 和 requestAnimationFrame 的区别？
:::

::: tip 答
requestAnimationFrame 的回调会在每一帧确认执行, 属于高优先级任务. 而 requestIdleCallback 的回调不一定, 属于低优先级任务.
我们看到的页面是浏览器一帧一帧绘制出来的, 通常 FPS 在 60 的时候是比较流畅的, 而 FPS 比较低的时候就会感觉到卡顿.
:::
