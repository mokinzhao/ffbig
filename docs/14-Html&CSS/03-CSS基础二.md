---
title: CSS基础二
---

# 布局

## 常用布局方式

- table 表格布局

- float 浮动+margin

- inline-block布局

- flexbox 布局

- grid 网格布局

## 布局属性

### 盒子模型

### display

- 块级盒子：display 为 block、list-item、table、flex、grid、flow-root

- 行内级盒子：display 为 inline、inline-block、inline-table

所有块级盒子都会参与 BFC，呈现垂直排列；而所有行内级盒子都参会 IFC，呈现水平排列。

### position

- absolute

生成绝对定位的元素，相对于static定位以外的一个父元素进行定位。元素的位置通过left、top、right、bottom属性进行规定。

- relative

生成相对定位的元素，相对于其原来的位置进行定位。元素的位置通过left、top、right、bottom属性进行规定。

- fixed

生成绝对定位的元素，指定元素相对于屏幕视⼝（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变，⽐如回到顶部的按钮⼀般都是⽤此定位⽅式。

- static默认值

没有定位，元素出现在正常的文档流中，会忽略 top, bottom, left, right 或者 z-index 声明，块级元素从上往下纵向排布，⾏级元素从左向右排列。

- inherit

规定从父元素继承position属性的值

- sticky

粘性定位的元素是依赖于用户的滚动，在 position:relative 与 position:fixed 定位之间切换。它的行为就像 position:relative; 而当页面滚动超出目标区域时，它的表现就像 position:fixed;，它会固定在目标位置。元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。这个特定阈值指的是 top, right, bottom 或 left 之一，换言之，指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相

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


## 推荐阅读

[总结了 42 种前端常用布局方案【建议收藏】](https://mp.weixin.qq.com/s/b4hxbgWIBw0K6ateW-7uEQ)