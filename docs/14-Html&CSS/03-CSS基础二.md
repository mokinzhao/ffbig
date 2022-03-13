---
title: CSS基础二布局
---

## 常用布局方式

- table 表格布局

- float 浮动+margin

- inline-block布局

- flexbox 布局

## 布局属性

### 盒子模型

### display

- block
- inline
- inline-block
- flex
- table

### position

- static
- relative
- absolute
- fixed (固定位置)

## FLexBox布局

### 优点

- 弹性盒子
- 盒子本来就是并列的
- 指定宽度即可
- 简单、方便

### 缺点

浏览器兼容问题

## FLoat 布局

- 元素“浮动”
- 脱离文档流
- 但不脱离文本流

### 特性

- 对自身影响：
    - 形成“块”BFC
    - 位置尽量上靠
    - 位置尽量靠左

- 对兄弟对影响：
    - 上面贴非float元素
    - 旁边贴float元素
    - 不影响其他块级元素位置
    - 影响其他块级元素内部文本

- 对父级元素影响
    - 从布局上“消失”
    - 高度塌陷

- 清楚浮动的方式
    - overflow：hidden
    - clear：both

## inline-block布局

## 响应式布局

- 在不同设备上正常使用

- 一般主要处理屏幕大小问题

### 主要方法

- 隐藏+折行+自适应空间
- rem
- vw/vh
- viewport
- media query


## 参考

[1.5 万字 CSS 基础拾遗（核心知识、常见需求）](https://juejin.cn/post/6941206439624966152)


