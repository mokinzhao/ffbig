---
title: Hybrid项目优化
---

# 技术栈分层

## Native

### 优点

操作体验流畅、性能好、数据存储较安全

### 缺点

发版周期长、频繁下周更新、线上故障修复及时度低

### 适用场景

- 原生动画、原生API（相机、蓝牙）
- 多媒体、音视频
- 数据加密、存储（JNI）

## ReactNative

### 优点

有热更新能力、跨平台、支持前端编码

### 缺点

操作体验一般，流畅度一般

### 适用场景

- 主流程、核心支付、下单模块

## H5

### H5特点

体验流畅度较弱、灵活、高效、发布便捷

### 适用场景

- 运营活动

- 内置商城

# 整体优化

## RN/Native 优化

### RN/Native耗时

- 耗时链路：Click->startActivity-> WebView初始化->loadUrl

- 耗时占比：15%

### 优化措施

- 预加载（WebView预初始化）
- CodeCache（缓存）
- bundle体积优化
    - Tree Shaking
    - 按需加载打包
- 懒加载
    - RAMbundle

## 网络优化

### 网络耗时链路

- 耗时链路：DNS->TCP->Request->Response

- 耗时占比：50%

### 网络优化措施

- 请求前置
- 并行请求
- 网络缓存（强缓存/协商缓存）
- 借用原生请求(okHttp)

- 浏览器标签
    - dns-prefetch
    - prefetch
    - preconnect（受限）
    - prerender(受限)
     
## 渲染优化

### 渲染耗时链路

- 耗时链路：解析->布局->渲染->首屏绘制

- 耗时占比：35%

### 渲染优化措施

- 分布渲染（只渲染视口内）

- NSR/SSR同构/骨架屏

## 综合优化

### 内存优化

- 容器费用
- 预创建
- 资源预取
- 空间换时间（内存大）
- 时间换空间（内存小）

### 缓存体系

- MemoryCache

- DiskCache

CSS、Html、JS

- ContentCache

单View多Page

- Multi-WebView

### 获取首屏时间

1. 开启MutationObserve
2. 检测首屏外节点变动
3. 次数超过阀值
4. 关闭Mutation
5. 计算首屏时间

## 参考

[得物AppH5秒开优化实战](https://mp.weixin.qq.com/s/23ZFPK4CaCkinwpZ3SG9Rw)
