---
title: 搭建私有npm仓库
---

## 私有npm仓库的优点

1. 方便，公司内部开发的私有包,统一管理，方便开发和使用
2. 安全，私有包托管在公司内部服务器中，外部无法访问
3. 加速，自己搭建npm 服务器,本身可以自带常用package的缓存, cnpm 有一些包存在路径问题,而npm 的速度有些感人,自建的服务器会缓存下载过的包，可以节省时间
4. 管理，对于发布和下载npm包可以配置权限管理

## 搭建方法：使用verdaccio

## 搭建步骤

1. 安装
npm install –global verdaccio

2. 运行
verdaccio

3. 修改配置文件
 找到运行显示的xxx/verdaccio/config.yaml文件

```shell
#设置NPM包的存放目录
storage: ./storage
#配置WEB UI界面
web :
title : ‘搭建私有NPM’
#logo : logo.png
#设置用户验证的文件。
auth:
htpasswd:
file: ./htpasswd
max_users: 1000 #默认为1000，改为-1，禁止注册
#设置其它的npm注册源(registry)
uplinks:
npmjs:
url: https://registry.npmjs.org/
#配置权限管理
packages:
‘@/’:
#表示哪一类用户可以对匹配的项目进行安装 【$all 表示所有人都可以执行对应的操作，$authenticated 表示只有通过验证的人可以执行对应操作，$anonymous 表示只有匿名者可以进行对应操作（通常无用）】
access: $all
#表示哪一类用户可以对匹配的项目进行发布
publish: $authenticated
‘*’:
#表示哪一类用户可以对匹配的项目进行安装
access: $all
#表示哪一类用户可以对匹配的项目进行发布
publish: $authenticated
# 如果一个npm包不存在，它会去询问设置的代理。
proxy: npmjs
#日志输出设置
logs:
-{type: stdout, format: pretty, level: http}
#-{type: file, path: verdaccio.log, level: info}
#修改监听的端口
listen: 0.0.0.0:4873

```

4. 启动 verdaccio
本地测试直接打开 http://localhost:4873/
公司部署的IP地址: xxxx


## 使用

1. 当前npm 服务指向verdaccio

npm set registry http://ip:4873


2. 注册用户
    - npm adduser –registry http://ip:4873
    - 按照提示输入userName 和 password,email
    - 输入后就注册完成

查看当前用户,是否是注册用户
npm whoami

3. 登录账号

npm login // npm login和npm adduser命令是等效的，如果是第一次登陆，且用户名不存在冲突，那么登陆信息会在进行加密处理后，存入和config.yaml文件同级的htpasswd文件中。


4. 发布

npm publish 或者 npm publish --registry http://ip:4873 //项目中发布包 发布后可以在storage文件夹下看到包

- 项目package.json配置

```js
  "publishConfig": {    
     "registry": "http://ip:4873/" 
   }, 
  "private": true, //手动添加, 防止将私有模块上传到公网
```

## 参考

![私有npm仓库](https://juejin.cn/post/6953115364511186975)

![搭建属于自己的私有npm库](https://juejin.cn/post/6983945466694074382)
