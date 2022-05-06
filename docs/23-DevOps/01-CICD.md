---
title: CI/CD
---

## 什么是CI/CD

>在软件工程中，CI/CD 或 CICD 通常指的是持续集成和持续交付或持续部署的组合实践。CI/CD 通过在应用程序的构建、测试和部署中实施自动化，在开发和运营团队之间架起了桥梁。—— 引用自维基百科

- **CI（Continuous Integration）** 指的是持续集成，即项目代码的新更改会定期构建、测试并合并到代码仓库中，有效解决一次开发多个项目分支导致代码冲突问题。

- **CD（Continuous Delivery/Continuous Deployment）** 指的是持续持续交付/持续部署，即项目代码的新更改可以自动或手动合并到主分支，并在合并至主分支后自动执行构建、测试流程，检测新更改是否对主分支代码产生影响。构建测试通过后，会自动发布并部署至生产环境，有效减轻运维团队负担。

## gitlab-ci

- <1> install阶段

就是执行npm install命令,根据package.json安装node_modules依赖包

- <2> eslint阶段

执行eslint检查，判断代码格式是否符合规范，如果不符合则pipeline终止。

在这之前，我先通过npm install eslint安装了eslint检查工具，然后在项目根目录下配置了.eslintrc文件。这部分可自行参考相关资料，这里暂不多赘述。

- <3> build阶段

编译生成生产代码，可以通过webpack之类的打包工具执行编译。当然可以通过框架提供的编译命令进行编译，例如我这个示例项目是用 react-scripts脚手架搭建的，所以通过npx react-scripts build进行编译。

- <3> test阶段

编译后的dist 目录下文件，可以使用e2e 自动化测试进行主体流程检测，确保核心功能正常，无白屏，可登录，可支付等核心用例通过

- <4> deploy阶段

deploy也就是部署阶段，也就是把刚才bulid阶段生成的生产代码，部署到生产访问的服务器上。这里又具体有以下两部分工作要做


## 参考

- [GitLab CI 打造一条自己的流水线](https://mp.weixin.qq.com/s/jvZWWtpsWP7gt9eL7OkSPg)
