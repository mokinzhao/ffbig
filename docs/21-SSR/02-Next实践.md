---
title: Next实践
---

## NextJS+TailwindCss+AntdMobile入门实践

## 背景

最近看了几篇关于前端技术发展趋势的文章，其中SSR 方向势头最火的当属 **Next.js**，目前已有80.3k的start排在榜单第一，可见业界对他的认可之高，在 Node SSR框架一骑绝尘。

CSS领域的网红框架**Tailwind CSS**一直都有听说，但是没有实际使用，看到下载量也成猛增曲线，忍不住跃跃欲试。**Tailwind CSS**年底发布 3.0,作者很有想法

- **Tailwind CSS** 实现了 CSS-In-JS 版的语法，可以认为是内置了一套最佳实践的 CSS-In-JS 库，也没解决太大的痛点，只是如果你同时喜欢 Tailwind CSS 与 CSS-In-JS，可能会爱屋及乌的选择 Twin

## 开始

### 安装 NextJS

```sh
npx create-next-app@latest --typescript my-project

```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38494e2c61604bcea4642da7e70b12e1~tplv-k3u1fbpfcp-watermark.image?)

### 安装 TailwindCss

```sh
cd my-project
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 配置 TailwindCss

- 修改tailwind.config.js配置

```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e47770828a64df5994cf8a50685f06a~tplv-k3u1fbpfcp-watermark.image?)

- 配置./styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc57b7a7d89a465fa64712ba2e976430~tplv-k3u1fbpfcp-watermark.image?)

- 运行项目

```sh
npm run dev
```

- 写入代码，测试是否成功

```html
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4c80df0fc3549338a12176eda6cca6c~tplv-k3u1fbpfcp-watermark.image?)
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9fdb1a9a68c46498c0b24d7640acd8f~tplv-k3u1fbpfcp-watermark.image?)
### 安装 Antd-mobile

- 安装

```sh
yarn add antd-mobile@next
```

- 配置

在 Next.js 中使用 antd-mobile 需要做一些额外的配置。

首先，需要安装 next-transpile-modules 和 next-images 依赖：

```js
yarn add -D next-transpile-modules next-images
```

然后在 next.config.js 中进行配置：

```js
const withImages = require('next-images')

const withTM = require('next-transpile-modules')([
  'antd-mobile',
]);

module.exports = withTM(withImages({
  // 你项目中其他的 Next.js 配置
}));
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91681b7f79ba42fc92cb239ebb2700ae~tplv-k3u1fbpfcp-watermark.image?)

## 实现一个完整页面

```js
import type { NextPage } from 'next';
import Head from 'next/head';
import { Button, Card, Steps, Avatar, List, Space } from 'antd-mobile';
import {
  CheckCircleFill,
  ClockCircleFill,
  HandPayCircleOutline,
} from 'antd-mobile-icons';

const { Step } = Steps;
const ApprovalDetail: NextPage = () => {
  return (
    <div>
      <Head>
        <title>流程单详情</title>
        <meta name="description" content="流程单列表" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex flex-row m-3 items-center">
          <Avatar src="" style={{ '--size': '54px', borderRadius: '30px' }} />
          <div className="flex flex-col ml-8 " >
            <span>标题</span>
            <span>内容xxx</span>
          </div>
        </div>
        <List header="当前进程">
          <List.Item extra="未开启" clickable>
            大字号模式
          </List.Item>
          <List.Item description="管理已授权的产品和设备" clickable>
            授权管理
          </List.Item>
          <List.Item title="这里是标题">这里是主信息</List.Item>
        </List>

        <List header="申请信息">
          <List.Item extra="未开启" clickable>
            大字号模式
          </List.Item>
          <List.Item description="管理已授权的产品和设备" clickable>
            授权管理
          </List.Item>
          <List.Item title="这里是标题">这里是主信息</List.Item>
        </List>
        <Steps
          direction="vertical"
          current={1}
          style={{
            '--title-font-size': '17px',
            '--description-font-size': '15px',
            '--indicator-margin-right': '12px',
            '--icon-size': '22px',
          }}
        >
          <Step
            title="填写机构信息"
            description="这里是一些描述"
            icon={<CheckCircleFill />}
          />
          <Step
            title="签约机构"
            description={
              <Space block direction="vertical">
                <div>这里是一些描述</div>
                <Button color="primary">去查看</Button>
              </Space>
            }
            icon={<ClockCircleFill />}
          />
          <Step
            title="关联服务区"
            description="这里是一些描述"
            icon={<HandPayCircleOutline />}
          />
        </Steps>
      </main>
    </div>
  );
};

export default ApprovalDetail;

```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86f104c260704d7caf8bf73a74fd575d~tplv-k3u1fbpfcp-watermark.image?)

## 补充

目前引入Antd-mobile 写组件会报一个Warning: useLayoutEffect does nothing on the server的警告
```js
Warning: useLayoutEffect does nothing on the server的错误, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.
```
该错误的大概意思是建议 useLayoutEffect不能使用在非浏览器环境下无法正常执行，不能有效执行服务端前置渲染的数据格式。也有人建议在非浏览器环境使用 useEffect，在浏览器环境使用 useLayoutEffect。



作者查Antd-mobile GitHub issue 看到Antd-mobile官方已注意到此问题https://github.com/ant-design/ant-design-mobile/issues/4730

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8385a01a39aa4b4587a36240e0ff109d~tplv-k3u1fbpfcp-watermark.image?)
目前官方仍没有非常妥善的解决方式，但不影响正常使用


