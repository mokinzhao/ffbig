---
title: 浏览器工作原理二
---

## 跨域请求如何携带cookie?

1. 前端请求时在request对象中配置"withCredentials": true；
2. 服务端在response的header中配置"Access-Control-Allow-Origin", "http://xxx:${port}";
3. 服务端在response的header中配置"Access-Control-Allow-Credentials", "true"

[面试题 -- 跨域请求如何携带cookie?](https://juejin.cn/post/7066420545327218725?share_token=64606385-e1fa-497d-bdf3-dd753817542c)




