---
title: CSS手写
---

## 水平垂直居中

- 水平居中

    1. 行内元素: text-align:center

    2. 块级元素: margin:0 auto

    3. 绝对定位和移动: absolute + transform

    4. 绝对定位和负边距: absolute + margin

    5. flex布局: flex + justify-content:center

- 垂直居中

    1. 子元素为单行文本: line-height:height

    2. absolute + transform

    3. flex + align-items:center

    4. table: display:table-cell; vertical-align: middle

    5. 利用position和top和负margin

- 水平垂直居中

1. 已知元素宽高：绝对定位 +margin：auto

```css
 div{
      width: 200px;
      height: 200px;
      background: green;
      position:absolute;
      left:0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
  }

```

2. 已知元素宽高:绝对定位+负margin

```css
div{
      width: 200px;
      height: 200px;
      background: green;
      position:absolute;
      left:0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
  }
```

3. absolute+transform

```css
 div{
     width: 200px;
     height: 200px;
     background: green;
     position:absolute;
     left:50%;    /* 定位父级的50% */
     top:50%;
     transform: translate(-50%,-50%); /*自己的50% */
   }
```

4. flex + justify-content + align-items

```css
.box{
   height:600px;  

   display:flex;
   justify-content:center;  //子元素水平居中
   align-items:center;      //子元素垂直居中
     /* aa只要三句话就可以实现不定宽高水平垂直居中。 */
    }
  .box>div{
    background: green;
    width: 200px;
    height: 200px;
  }
```

## 用CSS创建一个三角形

- 设置透明, 隐藏其中三个三角形

```css
 .box{
	width:0px;
	height:0px;
	border: 50px solid;
	border-color:transparent transparent transparent #ef4848;
}
```

- 先将所有边框设为透明, 然后需要哪边再对其设置颜色

```css
.box{
	width:0px;
	height:0px;
	border: 50px solid transparent;
	border-left:50px solid #ef4848;
}
```

## 实现三栏布局

- Flex布局

```html
<style>
.container{
  display:flex;
  justify-content: center;
  height: 200px;
  background: #eee;
}
.left {
   width: 200px;
   background-color: red;
   height: 100%;
 }
.main {
    background-color: yellow;
    flex: 1;
}
.right {
    width: 200px;
    background-color: green;
}
</style>
<div class="container">
  <div class="left">1</div>
  <div class="main">2</div>
  <div class="right">3</div>
</div>
```

- 绝对定位布局

```html
<style>
.container {
  position: relative;
  background:#eee;
  height:200px;
	}
.main {
  height: 200px;
  margin: 0 120px;
  background-color: yellow;
	}
.left {
  position: absolute;
  width: 100px;
  height: 200px;
  left: 0;
  top: 0;
  background-color: red;
	}
.right {
  position: absolute;
  width: 100px;
  height: 200px;
  background-color: green;
  right: 0;
  top: 0;
}
</style>

<div class="container">
  <div class="left">1</div>
  <div class="main">2</div>
  <div class="right">3</div>
</div>
```

- 双飞翼布局

```html
<style>
.content {
  float: left;
  width: 100%;
}
.main {
  height: 200px;
  margin-left: 110px;
  margin-right: 220px;
  background-color: yellow;
}
.left {
  float: left;
  height: 200px;
  width: 100px;
  margin-left: -100%;
  background-color: red;
}
.right {
  width: 200px;
  height: 200px;
  float: right;
  margin-left: -200px;
  background-color: green;
}

</style>
<div class="content">
  <div class="main"></div>
</div>
<div class="left"></div>
<div class="right"></div>

```

- 圣杯布局

```html
<style>
.container {
  margin-left: 120px;
  margin-right: 220px;
}
.main {
  float: left;
  width: 100%;
  height: 300px;
  background-color: yellow;
}
.left {
  float: left;
  width: 100px;
  height: 300px;
  margin-left: -100%;
  position: relative;
  left: -120px;
  background-color: blue;
}
.right {
  float: left;
  width: 200px;
  height: 300px;
  margin-left: -200px;
  position: relative;
  right: -220px;
  background-color: green;
}
</style> 
<div class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>

```

:::
圣杯布局和双飞翼布局解决问题的方案在前一半是相同的，也就是三栏全部float浮动，但左右两栏加上负margin让其跟中间栏div并排，以形成三栏布局。
:::

## 实现等高布局的方式

- 等高布局，顾名思义就是在同一个父容器中，子元素高度相等的布局。从等高布局的实现方式来说，可以分为两种，分别是伪等高和真等高。伪等高是指子元素的高度差依然存在，只是视觉上给人的感觉就是等高，真等高是指子元素的高度真实相等

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/24/16e9c5f747551670~tplv-t2oaga2asx-watermark.awebp)

- (伪等高)使用padding-bottom和负的margin-bottom来实现

```css

.container {
    position: relative;
    overflow: hidden;
}
    
.left,
.main,
.right {
    padding-bottom: 100%;
    margin-bottom: -100%;
    float: left;
    color: #fff;
}

.left {
    width: 20%;
    background: red;
}

.main {
    width: 60%;
    background: green;
}

.right {
    width: 20%;
    background: blue;
}

<div class="container">
    <div class="left">左侧内容</div>
    <div class="main">
        <p>中间内容</p>
        <p>中间内容</p>
        <p>中间内容</p>
    </div>
    <div class="right">右侧内容</div>
</div>

```

- （真等高）使用flex布局的方式

```css
.container {
    display: flex;
}

.left,
.main,
.right {
    flex: 1;
    color: #fff;
}

.left {
    background: red;
}

.main {
    background: green;
}

.right {
    background: blue;
}

<div class="container">
    <div class="left">左侧内容</div>
    <div class="main">
        <p>中间内容</p>
        <p>中间内容</p>
        <p>中间内容</p>
    </div>
    <div class="right">右侧内容</div>
</div>

```

- 使用绝对定位的方式

```css
.container {
  position: relative;
  height: 200px;
}

.left,
.main,
.right {
    position: absolute;
    top: 0;
    bottom: 0;
    color: #fff;
}

.left {
    left: 0;
    width: 20%;
    background: red;
}

.main {
    left: 20%;
    right: 20%;
    background: green;
}

.right {
    right: 0;
    width: 20%;
    background: blue;
}

<div class="container">
    <div class="left">左侧内容</div>
    <div class="main">
        <p>中间内容</p>
        <p>中间内容</p>
        <p>中间内容</p>
    </div>
    <div class="right">右侧内容</div>
</div>

```

- 使用table布局的方式

```css
.container {
    width: 100%;
    display: table;
}

.left,
.main,
.right {
    display: table-cell;
    color: #fff;
}

.left {
    width: 20%;
    background: red;
}

.main {
    width: 60%;
    background: green;
}

.right {
    width: 20%;
    background: blue;
}

<div class="container">
    <div class="left">左侧内容</div>
    <div class="main">
        <p>中间内容</p>
        <p>中间内容</p>
        <p>中间内容</p>
    </div>
    <div class="right">右侧内容</div>
</div>

```

- 使用grid网格布局的方式

```css
.container {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    color: #fff;
}

.left {
    background: red;
}

.main {
    background: green;
}

.right {
    background: blue;
}

<div class="container">
    <div class="left">左侧内容</div>
    <div class="main">
        <p>中间内容</p>
        <p>中间内容</p>
        <p>中间内容</p>
    </div>
    <div class="right">右侧内容</div>
</div>

```

## CSS实现0.5px的细线

```html
<style>
.line {
    position: relative;
}
.line:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: #000000;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
}
</style>

<div class="line"></div>

```

## 如何使用 CSS 实现网站的暗黑模式 (Dark Mode)

```css
@media (prefers-color-scheme: dark) {
    :root{
    }
}
```

## 清除浮动有哪些方法

- clear清除浮动（添加空div法）在浮动元素下方添加空div,并给该元素写css样式：{clear:both;height:0;overflow:hidden;}
- 给浮动元素父级设置高度
- 父级同时浮动（需要给父级同级元素添加浮动）
- 父级设置成inline-block，其margin: 0 auto居中方式失效
- 给父级添加overflow:hidden 清除浮动方法
- 万能清除法 after伪类 清浮动（现在主流方法，推荐使用）

```css
.float_div:after{
  content:".";
  clear:both;
  display:block;
  height:0;
  overflow:hidden;
  visibility:hidden;
}
.float_div{
  zoom:1
}
```

## CSS的性能优化方案

- 层级尽量扁平，避免嵌套过多层级的选择器；
- 使用特定的选择器，避免解析器过多层级的查找；
- 减少使用通配符与属性选择器；
- 减少不必要的多余属性；
- 避免使用!important标识，可以选择其他选择器；
- 实现动画时优先使用CSS3的动画属性，动画时脱离文档流，开启硬件加速；
- 使用link标签代替@import；
- 将渲染首屏内容所需的关键CSS内联到HTML中；
- 使用资源预加载指令preload让浏览器提前加载CSS资源并缓存；
- 使用Gulp，Webpack等构建工具对CSS文件进行压缩处理；
