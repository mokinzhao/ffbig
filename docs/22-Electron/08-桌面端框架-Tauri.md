---
title: 桌面端框架-Tauri
---

## 简介

初识 Tauri 是在 2021 年 JavaScript 明星项目 的最受欢迎项目，它排第5。由于 Vite、esbuild、swc 等工具的大火，让基于Go、Rust 的高效率、跨语言前端构建类工具进入爆发期，加上 Bundleless 优质体验，让 Rust、Go 成为前端er的又一扇门（由于其语法和定位，大部分前端选择的是 Rust）。由于Tauri的 Rust 背景，加上构建产物小、WebView2 在 win11 的内置、Mac 内置 WebKit，对它进行了特别的留意（点了个 Star）。

>Rust 前景还是非常不错的，如 linux内核接纳rust，deno采用rust，微软拥抱rust，fuchsia的rust代码占比超50%，Apple在底层all-in rust，连续6年的stackoverflow最受欢迎语言。就是学习门槛稍微有点高

按照官方介绍是 “用前端技术构建一个更小、更快、更安全的桌面应用程序”。在技术实现上，前端使用操作系统的 WebView，后端和操作系统集成这块使用 Rust 实现。再往下，macOS 和 Windows 上用 tao 作界面处理库、在 Linux 上使用的是基于 gtk 孵化的WRY。虽然都叫 WebView，但在 macOS 上利用 WebKit，在 Windows 上利用 WebView2，在 Linux 上利用 WebKitGTK。
作为桌面端跨端新方案，大家都会默认归为 Electron 的替代方案，这类的框架也越来越多，Tauri 只是其中之一。它们都去尝试解决 Electron 的两个大问题：

构建产物过大。Electron 通过 Chromium、Node 来抹平各端差异，构建产物一定有这部分内容，导致产物压缩后也有几十M
内存消耗大。Chromium 吃内存，还有要提供操作系统访问能力的Node，内存消耗较大，对小项目不友好

看着这两个问题都被 Tauri 解决了，但新势力有个缺点就是 文档不完善、配套没跟上，一切资料来源于官网（有点简陋，目前够用）。
**WebView2** 微软对其的支持力度很大，为提升Office、OutLook等的体验，2021年4月开始对windows 2101版本以上进行推送，Windows 11 默认内置。其 runtime 包体积小，大概1.8MB，底层使用新版本edge的内核。微软内部桌面应用逐渐从electron切换到webview2，感觉 Tauri 是卡着时间点的框架，是桌面应用螺旋形上升发展的一个现象级框架。


## 与 Electron 对比


<br/>
<img src="./img/tvselectron.png" />
<br/>


## 参考

[仅仅过去 4 年，微软最终放弃了 Electron](https://mp.weixin.qq.com/s/EeOd-Ln9RUNmeWLlMkJmIg)


