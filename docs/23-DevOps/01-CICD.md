---
title: CI/CD
---

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
