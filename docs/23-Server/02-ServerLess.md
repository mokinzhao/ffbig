---
title: ServerLess
---

### ServerLess 基本概念

- 简介

```js
❝ 我们可以将 Serverless 拆解为 server 和 less 两个单词，从字面上推断词意即为“少服务器的，亦或是无服务器的，弱化后端和运维概念,当前比较成熟的 Serverless 云产品主要有 Amazon Lambda、Google Cloud Function、Azure Function、AliCloud Function Compute、Tencent CloudBase等
```

- 2.1 Serverless 的演变

![](https://pic4.zhimg.com/80/v2-2c7902465220a6c4a141b2922ab23cab_720w.jpg)

- 2.2 什么是Serverless

```js
❝ Serverless = Faas (Function as a service) + Baas (Backend as a service)
```

![](https://pic2.zhimg.com/80/v2-d07b3dc660e2ce0b4d5e0800a49122b9_720w.jpg)

- 2.3 云函数（Faas）

```js
❝ FaaS（Function-as-a-Service）是服务商提供一个平台、提供给用户开发、运行管理这些函数的功能，而无需搭建和维护基础框架，是一种事件驱动由消息触发的函数服务
```

前端同学调用Faas服务如同调用本地函数一样简洁，如下所示，是一个腾讯云中一个简单的小程序云开发demo，cloudfunction是用来定义云函数的方法

![](https://pic4.zhimg.com/80/v2-3b6385b92a0fe9628b4469294860c43f_720w.jpg)


- 2.4 后端即服务（ BaaS）


```js
❝ BaaS（Backend-as-a-Service）后端即服务，包含了后端服务组件，它是基于 API 的第三方服务，用于实现应用程序中的核心功能，包含常用的数据库、对象存储、消息队列、日志服务等等。
❞
```

比如腾讯云云开发中下面的这些服务 ：

微信小程序的云调用 wx-server-sdk
云开发数据库 wx.cloud.database

![](https://pic4.zhimg.com/80/v2-704ef4b2925776dc97ee2238dbefe047_720w.jpg)

- 2.5 Serverless的架构

![](https://pic2.zhimg.com/80/v2-b055003199a4a4c0851a9c6eab8486c5_720w.jpg)

- 2.6 Serverless的优势

1. 环境统一: 不需要搭建服务端环境,, 保持各个机器环境一致 Serverless 的机制天然可复制
2. 按需计费: 我们只在代码运行的时候付费，没有未使用资源浪费的问题
3. 丰富的SDK: 有完善的配套服务, 如云数据库, 云存储, 云消息队列, 云音视频和云 AI 服务等
4. 弹性伸缩: 不需要预估流量, 关心资源利用率, 备份容灾, 扩容机器 ，可以根据流量动态提前峰值流量

![](https://pic2.zhimg.com/80/v2-8c524a691b8c03b126dabd339cc67761_720w.jpg)

```js
❝ “ Serverless 带来的其实是前端研发模式上的颠覆。相对以往纯前端研发的方式，Serverless 屏蔽底层基础设施的复杂度，后台能力通过FaaS平台化，我们不再需要关注运维、部署的细节，开发难度得到了简化，前端开发群体的边界就得以拓宽，能够参与到业务逻辑的开发当中，更加贴近和理解业务，做更有价值的输出。”
❞
```

- 2.7 Serverless的缺点

1. 云厂商强绑定：它们常常会和厂商的其他云产品相绑定，如对象存储、消息队列等，意味你需要同时开通其他的服务，迁移成本高，如果想迁移基本原有的逻辑不可服用，kennel需要重构
2. 不适合长时间任务：云函数平台会限制函数执行时间，如阿里云 Function Compute 最大执行时长为 10 min
3. 冷启动时间：函数运行时，执行容器和环境需要一定的时间，对 HTTP 请求来讲，可能会带来响应时延的增加
4. 调试与测试：开发者需要不断调整代码，打印日志，并提交到函数平台运行测试，会带来开发成本和产生费用

![](https://pic1.zhimg.com/80/v2-42d4ea7ce6eff0fff6c3944b3f6a61c0_720w.jpg)

- 2.8 Serverless的应用场景

1. 场景1: 负载有波峰波谷
波峰波谷时，机器资源要按照峰值需求预，比如医院挂号这需求，假设在每天10点放号预约，那10点就会有峰值的出现，为了这个峰值并发的考虑，准备了相对应性能（固定）的服务器，然而在波谷时机器利用率又明显下降，不能进行资源复用导致浪费，而serverless不用为了波峰去做准备，不用留住水位，支持弹性缩扩容，在你高峰时再在进行动态扩容

2. 场景2: 定时任务（报表统计等）
服务空闲时间来处理批量数据，来生成数据报表，通过Serverless方式，不用额外购买利用率并不高的处理资源，比如每日的凌晨，分析前一天收集的数据并生成报告

3. 场景3: 小程序开发（云开发）
比如微信小程序开发m在实际开发中，如果我们不用云开发的openid获取流程，而用传统的方式，你就知道openid的获取是非常繁琐的一个过程，前端需要通过wx.login获取一个code值（具有时效性）再通过code值去后台用appsecret去调取openid。

```js
❝ 而云函数由于是部署在腾讯云的关系，腾讯云将云调用将鉴权部分有效的封装，让你的接口很容易的实现了鉴权保护，无需维护复杂的鉴权机制，从而让个人开发者和小团队可以更容易地开发小程序
```

![](https://pic2.zhimg.com/80/v2-cc0184fb7e0b2d4548126c2a68344b8d_720w.jpg)

## 参考链接

::: tip
你学BFF和Serverless了吗 ⭐️
<https://zhuanlan.zhihu.com/p/368780365/>
:::
