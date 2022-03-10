---
title: WebSocket
---

## 基本概念

- WebSocket是HTML5提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于TCP传输协议，并复用HTTP的握手通道。浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接， 并进行双向数据传输。

- WebSocket 的出现就解决了半双工通信的弊端。它最大的特点是：服务器可以向客户端主动推动消息，客户端也可以主动向服务器推送消息。

- WebSocket 是一种在单个TCP连接上进行全双工通信的协议。WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。
在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接， 并进行双向数据传输。（维基百科）
WebSocket本质上一种计算机网络应用层的协议，用来弥补http协议在持久通信能力上的不足。
WebSocket 协议在2008年诞生，2011年成为国际标准。现在最新版本浏览器都已经支持了。
它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。

## Socket.io

实际应用中，如果需要Websocke进行双向数据通信，Socket.io是一个非常好的选择。其实github上面也有通过JS封装好的Websocket库，ws可用于client和基于node搭建的服务端使用，但是用起来相对繁琐，star相对Socket.io较少，所以不推荐使用。

Socket.io不是Websocket，它只是将Websocket和轮询 （Polling）机制以及其它的实时通信方式封装成了通用的接口，并且在服务端实现了这些实时机制的相应代码。也就是说，Websocket仅仅是 Socket.io实现实时通信的一个子集。因此Websocket客户端连接不上Socket.io服务端，当然Socket.io客户端也连接不上Websocket服务端。

## 参考

- [WebSocket 基础与应用系列（一）—— 抓个 WebSocket 的包](https://mp.weixin.qq.com/s?__biz=MzI1ODE4NzE1Nw==&mid=2247490686&idx=1&sn=4fb03f25d0229f5f7c9d95ce855dfce7&chksm=ea0d5684dd7adf921a425bd8a29ba52e326cc628bff1e982c678df12380a084e68b95d0772d9&scene=21#wechat_redirect)

- [WebSocket 基础与应用系列（二）—— Engine.IO 原理了解](https://mp.weixin.qq.com/s/bemT3Gz7xiLuHDwB5hMsYQ)

- [一文吃透 WebSocket 原理 刚面试完，趁热赶紧整理](https://juejin.cn/post/7020964728386093093#heading-1)

- [前端架构师破局技能，NodeJS 落地 WebSocket 实践](https://juejin.cn/post/7038491693997359117)

