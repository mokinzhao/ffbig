---
title: CSS基础一
---

# 选择器

## 选择器分类

- 元素选择器 a{}

- 伪元素选择器 ::before{}

TODO 待补充

## 选择器的权重

- ID选择器#id{} +100

- 类属性 伪类 +10

- 元素 伪元素 +1

- 其他选择器 +0

### 属性加强-优先级

- !important 优先级最高

- 元素属性 优先级高

- 相同权重 后写的生效

## 字体

- 字体族
- 字重

## 行高

- 行高的构成

## 背景

- base64 用在小图标 上

## 边框

- 边框属性

border

- 边框背景

- 边框原理
    - 实现一个三角形

## 滚动

- 滚动行为

- 滚动条

## 文字折行

- overflow-wrap（word-wrap）通用换行控制
    - 是否保留单词
- word-break 针对多字节文字
    - 中文句子也是单词
- white-space 空白处是否断行

## 装饰属性

- 字重 font-weight
- 斜体 font-style：itatic
- 下划线 text-decoration
- 指针 cursor

## CSS Hack

处理多个浏览器的兼容性问题


## 问题集锦

1. Css选择器优先级？
2. 雪碧图的作用
3. 自定义字体使用场景
4. 伪类和伪元素的区别？
5. 如何美化checkbox？
    - label[for]和id
    - 隐藏原生input
    - :checked+label

