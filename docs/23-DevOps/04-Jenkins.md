---
title: Jenkins
---

## Jenkins是什么？

Jenkins 是一款业界流行的开源持续集成工具，广泛用于项目开发，具有自动化构建、测试和部署等功能。

Jenkins 是一个开源项目，提供了一种易于使用的持续集成系统，使开发者从繁杂的集成中解脱出来，专注于更为重要的业务逻辑实现上。同时 Jenkins 能实施监控集成中存在的错误，提供详细的日志文件和提醒功能，还能用图表的形式形象地展示项目构建的趋势和稳定性。


## 主体流程（Jenkins+Docker）

首先我们把我们的电脑想象成一台服务器，当然如果你有服务器，也可以直接在服务器上，执行以下操作
我这里方便起见，就直接把我的电脑（mac）当做一台服务器，事实证明这里面很多坑！！！
注意区分以下本地和服务器的区别，其实我们这里都是我们的电脑

1. 我们在服务器（这里是我们的mac）上安装docker

2. 我们在服务器（这里是我们的mac）上用docker安装了jenkins

3. 我们本地新建一个vue项目，并推到github

4. 我们本地访问服务器上的jenkins，即打开网址http://localhost:8081 (如果是服务器这里localhost换成你服务器的ip)

5. 我们用jenkins拉了github的项目到jenkins的安装目录里的workspace/目录

6. jenkins使用执行shell跑了命令

```sh
npm install
npm run build
```

这里我们需要给jenkins安装nodejs插件

7. 我们用jenkins ssh连接到我们的服务器

这里我们需要安装Publish Over SSH插件，并配置好服务器

8. 在服务器（这里是我们的mac）上执行以下操作

- 把我们的vue项目打包成镜像vuenginxapp
- 用这个镜像创建一个容器vuenginxapp

## 推荐阅读

[写给前端的 Jenkins 教程——10分钟实现前端/ Node.js 项目的 CI/CD](https://juejin.cn/post/6896151951545729031#heading-10)

[都2022年了，还不用Jenkins自动化部署？](https://juejin.cn/post/7048582881576222734)

[Docker+Nginx+Jenkins实现前端自动化部署](https://juejin.cn/post/6869736425953165319#heading-0)