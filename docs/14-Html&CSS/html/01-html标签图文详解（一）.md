---
title: html标签图文详解（一）
---

## 本文主要内容

- 头标签 `<header>`
- 排版标签：`<p>`、 `<div>`、 `<span>`、`<br>` 、 `<hr>` 、 `<center>` 、 `<pre>`
- 字体标记：`<h1>`、 `<font>`、 `<b>`、 `<u>` 、`<sup>` 、`<sub>`
- 超链接 `<a>`
- 图片标签 `<img>`

## 前言

### web 标准

web 标准介绍：

- w3c：万维网联盟组织，用来制定 web 标准的机构（组织）
- web 标准：制作网页要遵循的规范。
- web 标准规范的分类：结构标准、表现标准、行为标准。
- 结构：html。表现：css。行为：JavaScript。

web 标准总结：

- 结构标准：相当于人的身体。html 就是用来制作网页的。
- 表现标准： 相当于人的衣服。css 就是对网页进行美化的。
- 行为标准： 相当于人的动作。JS 就是让网页动起来，具有生命力的。

### 浏览器介绍

浏览器是网页运行的平台，常用的浏览器有 IE、火狐（Firefox）、谷歌（Chrome）、猎豹浏览器、Safari 和 Opera 等。如下图所示：

![](http://img.smyhvae.com/20170628_1352.png)

浏览器内核：

|    浏览器     |  内核   |
| :-----------: | :-----: |
|      IE       | trident |
| chrome / 欧鹏 |  blink  |
|     火狐      |  gecko  |
|    Safari     | webkit  |

PS：「浏览器内核」也就是浏览器所采用的「渲染引擎」，渲染引擎决定了浏览器如何显示网页的内容以及页面的格式信息。**渲染引擎是兼容性问题出现的根本原因。**

### Sublime Text 的使用

详情请移步至：[Sublime Text 使用技巧](https://github.com/mokinzhao/Tools/blob/master/%E5%B8%B8%E7%94%A8%E5%B7%A5%E5%85%B7/02-Sublime%20Text%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7.md)

## 一、HTML 的介绍

### 1、HTML 的概述：

**html**全称为 HyperText Markup Language，译为<font color=#0000ff>**超文本标记语言**</font>，不是一种编程语言，是一种描述性的标记语言，用于描述超文本中内容的显示方式。比如字体什么颜色，大小等。

- 超文本：音频，视频，图片称为超文本。
- 标记 ：<英文单词或者字母>称为标记，一个 HTML 页面都是由各种标记组成。

**作用**：HTML 是负责描述文档**语义**的语言。

**注意**：HTML 语言不是一个编程语言(有编译过程)，而是一个**标记语言**(<font color=#0000ff>**没有编译过程**</font>)，HTML 页面直接由浏览器解析执行。

#### HTML 是负责描述文档语义的语言

html 中，除了**语义**，其他什么都没有。

html 是一个纯本文文件（就是用 txt 文件改名而成），用一些标签来描述文字的语义，这些标签在浏览器里面是看不到的，所以称为“超文本”，所以就是“超文本标记语言”了。
所以，接下来，我们肯定要学习一堆 html 中的标签对儿，这些标签对儿能够给文本不同的语义。

比如，面试的时候问你，h1 标签有什么作用？

- 正确答案：给文本增加主标题的语义。
- 错误答案：给文字加粗、加黑、变大。

### 2、HTML 的历史

![html中标签发展趋势](http://img.smyhvae.com/20151001_1001.png)

我们专门来对 XHTML 做一个介绍。

**XHTML 介绍：**
XHTML：Extensible Hypertext Markup Language，可扩展超文本标注语言。
XHTML 的主要目的是为了<font color="blue">**取代 HTML**</font>，也可以理解为 HTML 的升级版。
HTML 的标记书写很不规范，会造成其它的设备(ipad、手机、电视等)无法正常显示。
XHTML 与 HTML4.0 的标记基本上一样。
XHTML 是<font color="blue">**严格的、纯净的**</font>HTML。

我们稍后将对 XHTML 的编写规范进行介绍。

### 3、HTML 的网络术语

- 网页 ：由各种标记组成的一个页面就叫网页。
- 主页(首页) : 一个网站的起始页面或者导航页面。
- 标记： `<p>`称为开始标记 ，`</p>`称为结束标记，也叫标签。每个标签都规定好了特殊的含义。
- 元素：`<p>内容</p>`称为元素.
- 属性：给每一个标签所做的辅助信息。
- xhtml： 符合 XML 语法标准的 HTML。
- dhtml：dynamic，动态的。`javascript + css + html`合起来的页面就是一个 dhtml。
- http：超文本传输协议。用来规定客户端浏览器和服务端交互时数据的一个格式。SMTP：邮件传输协议，ftp：文件传输协议。

### 4、HTML 的编辑工具

> 用的最多的编辑器是： VS Code 和 Sublime Text。

- VS Code：最火的前端代码编辑器。
- Sublime Text：很轻量的代码编辑器。
- NotePad：记事本。
- EditPlus：语法高亮显示。技巧： 根据颜色判断单词是否出错 （不是 100%）。不好的地方：没有代码提示。
- UltraEdit：根据颜色判断单词是否出错，可以显示 2 进制数据。
- dw(dreamweaver，专业工具) ：建立 WEB 站点和应用程序的专业工具。它将布局功能、开发工具、代码编辑组合在一起。有代码提示。

PS：后缀名不能决定文件格式，只能决定打开文件打开的方式。

### 5、计算机编码介绍

计算机，不能直接存储文字，存储的是编码。

计算机只能处理二进制的数据，其它数据，比如：0-9、a-z、A-Z，这些字符，我们定义一套规则来表示。假如：A 用 110 表示，B 用 111 表示等。

**ASCII 码：**
美国发布的，用 1 个字节(8 位二进制)来表示一个字符，共可以表示 2^8=256 个字符。
美国的国家语言是英语，只要能表示 0-9、a-z、A-Z、特殊符号。

**ANSI 编码：**
**每个国家为了显示本国的语言，都对 ASCII 码进行了扩展**。用 2 个字节(16 位二进制)来表示一个汉字，共可以表示 2^16 ＝ 65536 个汉字。例如：
中国的 ANSI 编码是 GB2312 编码(简体)，对 6763 汉字进行编码，含 600 多特殊字符。另外还有 GBK(简体)。
日本的 ANSI 编码是 JIS 编码。
台湾的 ANSI 编码是 BIG5 编码（繁体）。

**GBK：**
对 GB2312 进行了扩展，用来显示罕见的、古汉语的汉字。现在已经收录了 2.1 万左右。并提供了 1890 个汉字码位。K 的含义就是“扩展”。

**Unicode 编码(统一编码)：**
用 4 个字节(32 位二进制)来表示一个字符，想法不错，但效率太低。例如，字母 A 用 ASCII 表示的话一个字节就够，可用 Unicode 编码的话，得用 4 个字节表示，造成了空间的极大浪费。A 的 Unicode 编码是 0000 0000 0000 0000 0000 0000 0100 0000

**UTF-8(Unicode Transform Format)编码：**
根据字符的不同，选择其编码的长度。比如：一个字符 A 用 1 个字节表示，一个汉字用 2 个字节表示。

毫无疑问，开发中，都用**UTF-8**编码吧，准没错。

**中文能够使用的字符集两种：**

- 第一种：UTF-8。UTF-8 是国际通用字库，里面涵盖了所有地球上所有人类的语言文字，比如阿拉伯文、汉语、鸟语……

- 第二种：GBK（对 GB2312 进行了扩展）。gb2312 是国标，是中国的字库，里面**仅**涵盖了汉字和一些常用外文，比如日文片假名，和常见的符号。

字库规模： UTF-8（字全） > gb2312（只有汉字）

**重点 1：避免乱码**

我们用 meta 标签声明的当前这个 html 文档的字库，一定要和保存的文件编码类型一样，否则乱码！（重点）。

当我们不设置的时候，sublime 默认类型就是 UTF-8。而一旦更改为 gb2312 的时候，就一定要记得设置一下 sublime 的保存类型： `文件→ set File Encoding to → Chinese Simplified(GBK)`。

**重点 2：UTF-8 和 gb2312 的比较**

保存大小：UTF-8（更臃肿、加载更慢） > gb2312 （更小巧，加载更快）

总结：

- UTF-8：字多，有各种国家的语言，但是保存尺寸大，文件臃肿；
- gb2312：字少，只用中文和少数外语和符号，但是尺寸小，文件小巧。

列出 2 个使用情形：

1） 你们公司是做日本动漫的，经常出现一些日语动漫的名字，网页要使用 UTF-8。如果用 gb2312 将无法显示日语。
2） 你们公司就是中文网页，极度的追求网页的显示速度，要使用 gb2312。如果使用 UTF-8 将每个汉字多一个 byte，所以 5000 个汉字，多 5kb。

我们亲测：

- qq 网、网易、搜狐都是使用 gb2312。这些公司，都追求显示速度。
- 新华网藏语频道，使用的是 UTF-8，保证字符集的数量。

对了，我们是怎么查看网页的编码方式的呢？在浏览器中打开网页，右键，选择“查看网页源代码”，找到 me 标签中的 charset 属性即可。
那么，我们为什么可以查看网页的源代码呢？因为这个打开的网页已经存到我的临时文件夹里了，临时文件夹里的 html 是纯文本文件，纯文本文件自然剋以查看网页的源代码了。

### 6、HTML 颜色介绍

**颜色表示：**

- 纯单词表示：red、green、blue、orange、gray 等
- 10 进制表示：rgb(255,0,0)
- 16 进制表示：#FF0000、#0000FF、#00FF00 等

**RGB 色彩模式：**

- 自然界中所有的颜色都可以用红、绿、蓝(RGB)这三种颜色波长的不同强度组合而得，这就是人们常说的三原色原理。
- RGB 三原色也叫加色模式，这是因为当我们把不同光的波长加到一起的时候，可以得到不同的混合色。例：红+绿=黄色，红+蓝＝紫色，绿+蓝=青
- 在数字视频中，对 RGB 三基色各进行 8 位编码就构成了大约 1678 万种颜色，这就是我们常说的真彩色。所有显示设备都采用的是 RGB 色彩模式。
- RGB 各有 256 级(0-255)亮度，256 级的 RGB 色彩总共能组合出约 1678 万种色彩，即 256×256×256=16777216。

## 二、HTML 的规范

- HTML 是一个弱势语言
- HTML 不区分大小写
- HTML 页面的后缀名是 html 或者 htm(有一些系统不支持后缀名长度超过 3 个字符，比如 dos 系统)
- HTML 的结构： - 声明部分：主要作用是用来告诉浏览器这个页面使用的是哪个标准。<!doctype html>是 HTML5 标准。 - head 部分：将页面的一些额外信息告诉服务器。不会显示在页面上。 - body 部分：我们所写的代码必须放在此标签內。

目前，IE 浏览器是完全不支持 H5 的，支持最好的是 Opera 浏览器，可以支持 95%以上；其次是 google，可以支持一部分 H5。

### 1、编写 XHTML 的规范：

（1）所有标记元素都要正确的嵌套，不能交叉嵌套。正确写法举例：`<h1><font></font></h1>`

（2）所有的标记都必须小写。

（3）所有的标记都必须关闭。

- 双边标记：`<span></span>`
- 单边标记：`<br>` 转成 `<br />` `<hr>` 转成 `<hr />`，还有`<img src=“URL” />`

（4）所有的属性值必须加引号。`<font color="red"></font>`

（5）所有的属性必须有值。`<hr noshade="noshade">`、`<input type="radio" checked="checked" />`

（6）XHTML 文档开头必须要有 DTD 文档类型定义

### 2、HTML 的基本语法特性

#### （1）HTML 对换行不敏感，对 tab 不敏感

HTML 只在乎标签的嵌套结构，嵌套的关系。谁嵌套了谁，谁被谁嵌套了，和换行、tab 无关。换不换行、tab 不 tab，都不影响页面的结构。

也就是说，HTML 不是依靠缩进来表示嵌套的，就是看标签的包裹关系。但是，我们发现有良好的缩进，代码更易读。要求大家都正确缩进标签。

百度为了追求极致的显示速度，所以 HTML 标签都没有换行、都没有缩进（tab），HTML 和换不换行无关，标签的层次依然清晰，只不过程序员不可读了。如下图所示：

![](http://img.smyhvae.com/20170629_2226.png)

#### （2）空白折叠现象

HTML 中所有的**文字之间**，如果有空格、换行、tab 都将被折叠为一个空格显示。

举例如下：

![](http://img.smyhvae.com/20170629_2230.jpg)

#### （3）标签要严格封闭

标签不封闭是灾难性的。

标签不封闭的举例如下：

![](http://img.smyhvae.com/20170629_2245.jpg)

## 三、HTML 结构详解

> 备注：
>
> - 所有的浏览器默认情况下都会忽略空格和空行
> - 每个标签都有私有属性。也都有公有属性。
> - html 中表示长度的单位都是**像素**。HTML 只有一种单位就是像素。

HTML 标签通常是成对出现的（<font color="blue">**双边标记**</font>），比如 `<div>` 和 `</div>`，也有单独呈现的标签（<font color="blue">**单边标记**</font>），如：`<br />`、`<hr />`和`<img src="images/1.jpg" />`等。

属性与标记之间、各属性之间需要以空格隔开。属性值以双引号括起来。

### 快速生成 html 的骨架

**方式 1**：在 VS Code 中新建 html 文件，输入`html:5`，按 `Tab`键后，自动生成的代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

**方式 2**：在 Sublime Text 中安装`Emmet`插件。新建 html 文件，输入`html:5`，按`Tab`键后，自动生成的代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

**方式 3**：在 Sublime Text 中安装`Emmet`插件。新建 html 文件，输入`html:xt`，按`Tab`键后（或者按 Ctrl+E），自动生成的代码如下：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

上面的方式 2 和方式 3 中，我们会发现，第一行的内容有些不太一样，这就是我们接下来要讲的**文档声明头**。

### 1、文档声明头

任何一个标准的 HTML 页面，第一行一定是一个以`<!DOCTYPE ……>`开头的语句。

这一行，就是文档声明头，DocType Declaration，简称 DTD。此标签可告知浏览器文档使用哪种 HTML 或 XHTML 规范。

#### HTML4.01 有哪些规范呢？

**HTML4.01**这个版本是 IE6 开始兼容的。**HTML5 是 IE9 开开始兼容的**。如今，手机、移动端的网页，就可以使用 HTML5 了，因为其兼容性更高。

说个题外话，html1 至 html3 是美国军方以及高等研究所用的，并未对外公开。

HTML4.01 里面有两大种规范，每大种规范里面又各有 3 种小规范。所以一共 6 种规范（见下图）。

HTML4.01 里面规定了**普通**和**XHTML**两大种规范。HTML 觉得自己有一些规定不严谨，比如，标签是否可以用大写字母呢？`<H1></H1>`所以，HTML 就觉得，把一些规范严格的标准，又制定了一个 XHTML1.0。在 XHTML 中的字母 X，表示“严格的”。

总结一下，HTML4.01 一共有 6 种 DTD。说白了，HTML 的第一行语句一共有 6 种情况：

![](http://img.smyhvae.com/20170629_1600.png)

下面对上图中的三种小规范进行解释：

- **strict**：表示“严格的”，这种模式里面的要求更为严格。这种严格体现在哪里？有一些标签不能使用。
  比如，u 标签，就是给一个本文加下划线，但是这和 HTML 的本质有冲突，因为 HTML 只能负责语义，不能负责样式，而 u 这个下划线是样式。所以，在 strict 中是不能使用 u 标签的。
  那怎么给文本增加下划线呢？今后的 css 将使用 css 属性来解决。
  那么，XHTML1.0 更为严格，因为这个体系本身规定比如标签必须是小写字母、必须严格闭合标签、必须使用引号引起属性等等。

- **Transitional**：表示“普通的”，这种模式就是没有一些别的规范。

- **Frameset**：表示“框架”，在框架的页面使用。

在 sublime 输入的 html:xt，x 表示 XHTML，t 表示 transitional。

在 HTML5 中极大的简化了 DTD，也就是说 HTML5 中就没有 XHTML 了（W3C 自己打脸了）：

```
<!DOCTYPE html>
```

### 2、头标签

#### html5 的比较完整的骨架：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <meta name="Author" content="" />
    <meta name="Keywords" content="牛逼，很牛逼，特别牛逼" />
    <meta
      name="Description"
      content="网易是中国领先的互联网技术公司，为用户提供免费邮箱、游戏、搜索引擎服务，开设新闻、娱乐、体育等30多个内容频道，及博客、视频、论坛等互动交流，网聚人的力量。"
    />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

面试题：

- 问：网页的 head 标签里面，表示的是页面的配置，有什么配置？
- 答：字符集、关键词、页面描述、页面标题、IE 适配、视口、iPhone 小图标等等。

头标签都放在<head></head>头部分之间。包括：`<title>`、`<base>`、`<meta>`、`<link>`

- `<title>`：指定整个网页的标题，在浏览器最上方显示。
- `<base>`：为页面上的所有链接规标题栏显示的内容定默认地址或默认目标。
- `<meta>`：提供有关页面的基本信息
- `<body>`：用于定义 HTML 文档所要显示的内容，也称为主体标签。我们所写的代码必须放在此标签內。
- `<link>`：定义文档与外部资源的关系。

**meta 标签**：

上面的`<meta>`标签都不用记，但是另外还有一个`<meta>`标签是需要记住的：

```html
<meta http-equiv="refresh" content="3;http://www.baidu.com" />
```

上面这个标签的意思是说，3 秒之后，自动跳转到百度页面。

常见的几种 meta 标签如下：

（1）字符集 charset：

```html
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
```

字符集用 meta 标签中的`charset`定义，meta 表示“元”。“元”配置，就是表示基本的配置项目。

charset 就是 charactor set（即“字符集”）。

浏览器就是通过 meta 来看网页是什么字符集的。比如你保存的时候，meta 写的和声明的不匹配，那么浏览器就是乱码。

（2）视口 viewport：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

`width=device-width` ：表示视口宽度等于屏幕宽度。

viewport 这个知识点，初学者还比较难理解，以后学 Web 移动端的时候会用到。

（2）定义“关键词”：

举例如下：

```html
<meta
  name="Keywords"
  content="网易,邮箱,游戏,新闻,体育,娱乐,女性,亚运,论坛,短信"
/>
```

这些关键词，就是告诉搜索引擎，这个网页是干嘛的，能够提高搜索命中率。让别人能够找到你，搜索到你。

（3）定义“页面描述”：

meta 除了可以设置字符集，还可以设置关键字和页面描述。

只要设置 Description 页面描述，那么百度搜索结果，就能够显示这些语句，这个技术叫做**SEO**（search engine optimization，搜索引擎优化）。

设置页面描述的举例：

```html
<meta
  name="Description"
  content="网易是中国领先的互联网技术公司，为用户提供免费邮箱、游戏、搜索引擎服务，开设新闻、娱乐、体育等30多个内容频道，及博客、视频、论坛等互动交流，网聚人的力量。"
/>
```

效果如下：

![](http://img.smyhvae.com/20170629_1743.png)

**title 标签**:

用于设置网页标题：

```html
<title>网页的标题</title>
```

title 也是有助于 SEO 搜索引擎优化的。

**base 标签**：

```html
<base href="/" />
```

base 标签用于指定基础的路径。指定之后，所有的 a 链接都是以这个路径为基准。

### 3、`<body>`标签的属性

其属性有：

- `bgcolor`：设置整个网页的背景颜色。
- `background`：设置整个网页的背景图片。
- `text`：设置网页中的文本颜色。
- `leftmargin`：网页的左边距。IE 浏览器默认是 8 个像素。
- `topmargin`：网页的上边距。
- `rightmargin`：网页的右边距。
- `bottommargin`：网页的下边距。

`<body>`标签另外还有一些属性，这里用个例子来解释：

![](http://img.smyhvae.com/2015-10-02-cnblogs_html_39.png)

上方代码中，当我们对`点我点我`这几个字使用超链时，`link`属性表示默认显示的颜色、`alink`属性表示鼠标点击但是还没有松开时的颜色、`vlink`属性表示点击完成之后显示的颜色。效果如下：

![](http://img.smyhvae.com/2015-10-02-cnblogs_html_05.gif)

接下来，我们讲一下`<body>`里的各种标签的属性。

## 一、排版标签

### 注释标签

```html
<!-- 注释  -->
```

### 段落标签`<p>`

```html
<p>This is a paragraph</p>
<p>This is another paragraph</p>
```

属性：

- `align="属性值"`：对齐方式。属性值包括 left center right。
  举例：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html166440-1dcd2ad6e6353559.png)

<br>

段落，是英语 paragraph“段落”缩写。

HTML 标签是分等级的，HTML 将所有的标签分为两种：

- **文本级标签**：p、span、a、b、i、u、em。文本级标签里只能放**文字、图片、表单元素**。（a 标签里不能放 a 和 input）

- **容器级标签**：div、h 系列、li、dt、dd。容器级标签里可以放置任何东西。

从学习 p 的第一天开始，就要死死记住：**p 标签是一个文本级标签，p 里面只能放文字、图片、表单元素**。其他的一律不能放。

错误写法：（尝试把 h 放到 p 里）

```html
	<p>
		我是一个小段落
		<h1>我是一级标题</h1>
	</p>
```

网页效果如下：

![](http://img.smyhvae.com/20170630_1102.png)

上图显示，浏览器不允许你这么做，我们使用 Chrome 的 F12 审查元素发现，浏览器自己把 p 封闭掉了，不让你去包裹 h1。

PS：Chrome 浏览器是世界上 HTML5 支持最好的浏览器。提供了非常好的开发工具，非常适合我们开发人员使用。审查元素功能的快捷键是 F12。

### 块级标签 `<div>`和`<span>`

> div 和 span 是非常重要的标签，div 的语义是 division“分割”； span 的语义就是 span“范围、跨度”。

> CSS 课程中你将知道，这两个东西，都是最最重要的“盒子”。

div：把标签中的内容作为一个块儿来对待(division)。必须单独占据一行。

div 标签的属性：

- `align="属性值"`：设置块儿的位置。属性值可选择：left、right、 center。

<br>

**`<span>`和`<div>`唯一的区别在于**：`<span>`是不换行的，而`<div>`是换行的。

如果单独在网页中插入这两个元素，不会对页面产生任何的影响。这两个元素是专门为定义 CSS 样式而生的。或者说，DIV+CSS 来实现各种样式。

效果举例：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_08.png)

div 在浏览器中，默认是不会增加任何的效果的，但是语义变了，div 中的所有元素是一个小区域。
div 标签是一个**容器级**标签，里面什么都能放，甚至可以放 div 自己。

span 也是表达“小区域、小跨度”的标签，但是是一个**文本级**的标签。
就是说，span 里面只能放置文字、图片、表单元素。 span 里面不能放 p、h、ul、dl、ol、div。

span 里面是放置小元素的，div 里面放置大东西的。举例如下：

span 举例：

```html
<p>
  简介简介简介简介简介简介简介简介
  <span>
    <a href="">详细信息</a>
    <a href="">购买</a>
  </span>
</p>
```

div 举例：

```html
<div class="header">
  <div class="logo"></div>
  <div class="nav"></div>
</div>
<div class="content">
  <div class="guanggao"></div>
  <div class="dongxi"></div>
</div>
<div class="footer"></div>
```

所以，我们亲切的称呼这种模式叫做“**div+css**”。**div 标签负责布局，负责结构，负责分块。css 负责样式**。

### 换行标签`<br>`（已废弃）

当你打算结束一行，而又不想开始一个新段落时，`<br>`标签就派上用场了。无论你将它置于何处，`<br>`标签都会产生一个强制的换行。

```html
This <br />
is a para<br />graph with line breaks
```

效果如下：

![](http://img.smyhvae.com/2015-10-01-cnblogs_html03.png)

上图显示，**`<p>`标签和`<br>`标签的区别在于**：`<p>`标签会在段落的前后自动插入一个空行，而`<br>`标签没有空行；而且`<br>`标签没有属性。

注意`<br>` 没有结束标签，把`<br>`标签写为 `<br/>` 是经得起未来考验的做法，XHTML 和 XML 都接受在打开的标签内部来关闭标签的做法。

<br>

### 水平线标签`<hr>`（已废弃）

水平分隔线（horizontal rule）可以在视觉上将文档分隔成各个部分。
效果如下：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_04.png)

属性：

- `align="属性值"`：设定线条置放位置。属性值可选择：left right center。
- `size="2"`：设定线条粗细。以像素为单位，内定为 2。
- `width="500"`或`width="70%"`：设定线条长度。可以是绝对值（单位是像素）或相对值。如果设置为相对值的话，内定为 100%。
- `color="#0000FF"`：设置线条颜色。
- `noshade`：不要阴影，即设定线条为平面显示。若没有这个属性则表明线条具阴影或立体，这是内定值。
  属性效果演示：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_05.png)

<br>

### 内容居中标签 `<center>`

此时 center 代表是一个标签，而不是一个属性值了。只要是在这个标签里面的内容，都会居于浏览器的中间。
效果演示：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_06.png)

到了 H5 里面，center 标签不建议使用。

<br>

### 预定义（预格式化）标签：`<pre>`

含义：将保留其中的所有的空白字符(空格、换行符)，原封不动的输出结果（告诉浏览器不要忽略空格和空行）
说明：真正排网页过程中，`<pre>`标签几乎用不着。但在 PHP 中用于打印一个数组时使用。

效果演示：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_07.png)

上图中，好像红框部分的字体变小了，而且还出现了缩进，好吧， 这个其实是浏览器搞的鬼。
为什么要有`<pre>`这个标签呢？答案是：

> 所有的浏览器默认情况下都会忽略空格和空行。

好吧，其实这个标签也用的比较少。

## 二、字体标签

### 标题

标题使用`<h1>`至`<h6>`标签进行定义。`<h1>`定义最大的标题，`<h6>`定义最小的标题。具有 align 属性，属性值可以是：left、center、right。
效果演示：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_09.png)

### 字体标签`<font>`（已废弃）

属性：

- `color="红色"`或`color="#ff00cc"`或`color="new rgb(0,0,255)"`：设置字体颜色。
  设置方式：单词 \ #ff00cc \ rgb(0,0,255)
- `size`：设置字体大小。 取值范围只能是：1 至 7。取值时，如果取值大于 7 那就按照 7 来算，如果取值小于 1 那就按照 1 来算。如果想要更大的字体，那就只能通过 css 样式来解决。
  设置：用’+2’代表值是 5 或直接给值
- `face="微软雅黑"`：设置字体类型。注意在写字体时，“微软雅黑”这个字不能写错。
  举例：

```html
<font face="微软雅黑" color="#FF0000" size="10">vae</font>
```

效果：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_10.png)

### 特殊字符（转义字符）

- `&nbsp;`：空格 （non-breaking spacing，不断打空格）
- `&lt;`：小于号（less than）
- `&gt;`：大于号（greater than）
- `&amp;`：符号`&`
- `&quot;`：双引号
- `&apos;`：单引号
- `&copy;`：版权`©`
- `&trade;`：商标`™`
- `&#32464;`：文字`绐`。其实，`#32464`是汉字`绐`的 unicode 编码。

要求背诵的特殊字符有：`&nbsp;`、`&lt;`、`&gt;`、`&copy;`。

比如说，你想把`<p>`作为一个文本在页面上显示，直接写`<p>`是肯定不行的，因为这代表的是一个段落标签，所以这里需要用到**转义字符**。应该这么写：

```html
这是一个HTML语言的&lt;p&gt;标签
```

正确的效果如下：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_11.png)

错误的效果如下：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_12.png)

其实我们只要记住前三个符号就行了，其他的在需要的时候查一下就行了。而且，EditPlus 软件中是可以直接点击这些符号进行选择的：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_13.png)

来一张表格，方便需要的时候查询：

| 特殊字符 | 描述             | 字符的代码 |
| :------- | :--------------- | :--------- |
|          | 空格符           | `&nbsp;`   |
| <        | 小于号           | `&lt;`     |
| >        | 大于号           | `&gt;`     |
| &        | 和号             | `&amp;`    |
| ￥       | 人民币           | `&yen;`    |
| ©        | 版权             | `&copy;`   |
| ®        | 注册商标         | `&reg;`    |
| °        | 摄氏度           | `&deg;`    |
| ±        | 正负号           | `&plusmn;` |
| ×        | 乘号             | `&times;`  |
| ÷        | 除号             | `&divide;` |
| ²        | 平方 2（上标 2） | `&sup2;`   |
| ³        | 立方 3（上标 3） | `&sup3;`   |

### 一些小标签/小标记

- `<u>`：下划线标记

- `<s>`或`<del>`：中划线标记（删除线）

- `<i>`或`<em>`：斜体标记

效果：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_15.png)

上面的这几个标签，常用于做一些小装饰、小图标。比如：

20180118_2340.png

这张图中，我们通过查看京东网站的代码发现，箭头处的小图标都是用的标签`<i>`。

div 的主要目的是用来布局，而小装饰却可以用来

### 粗体标签`<b>`或`<strong>`（已废弃）

效果：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_14.png)

<br>

### 上标`<sup>` 下标`<sub>`

上小标这两个标签容易混淆，怎么记呢？这样记：`b`的意思是`bottom：底部`
举例：

```html
O<sup>2</sup> 5<sub>3</sub>
```

效果：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_16.png)

## 三、超链接

超链接有三种形式：

**1、外部链接**：链接到外部文件。举例：

```html
<a href="02页面.html">点击进入另外一个文件</a>
```

a 是英语`anchor`“锚”的意思，就好像这个页面往另一个页面扔出了一个锚。是一个文本级的标签。

href 是英语`hypertext reference`超文本地址的缩写。读作“喝瑞夫”，不要读作“喝夫”。

效果：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_17.png)

当然，我们也可以直接点进链接，访问一个网址。举例如下；

```
	<a href="http://www.baidu.com" target="_blank">点我点我</a>
```

**2、锚链接**：
指给超链接起一个名字，作用是**在本页面或者其他页面的的不同位置进行跳转**。比如说，在网页底部有一个向上箭头，点击箭头后回到顶部，这个就是利用到了锚链接。
首先我们要创建一个**锚点**，也就是说，使用`name`属性或者`id`属性给那个特定的位置起个名字。效果如下：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_18.png)

上图中解释：

11 行代码表示，顶部这个锚的名字叫做 name1。
然后在底部设置超链接，点击时将回到顶部（此时，网页中的 url 的末尾也出现了`#name1`）。注意**上图中红框部分的`#`号不要忘记了**，表示跳到名为 name1 的特定位置，这是规定。如果少了`#`号，点击之后，就会跳到 name1 这个文件或者 name1 这个文件夹中去。

如果我们将上图中的第 28 行代码写成：

```html
<a href="a.html#name1">回到顶部</a>
```

那就表示，点击之后，跳转到`a.html`页面的`name1锚点`中去。

说明：name 属性是 HTML4.0 以前使用的，id 属性是 HTML4.0 后才开始使用。为了向前兼容，因此，name 和 id 这两个属性都要写上，并且值是一样的。

**3、邮件链接**：
代码举例：

```html
<a href="mailto:smyhvae@163.com">点击进入我的邮箱</a>
```

效果：点击之后，会弹出 outlook，作用不大。

### 超链接的属性

- `href`：目标 URL
- `title`：悬停文本。
- `name`：主要用于设置一个锚点的名称。
- `target`：告诉浏览器用什么方式来打开目标页面。`target`属性有以下几个值： - `_self`：在同一个网页中显示（默认值） - `_blank`：**在新的窗口中打开**。 - `_parent`：在父窗口中显示 - `_top`：在顶级窗口中显示

`title`属性举例：

```html
<a href="09_img.html" title="很好看哦">结婚照</a>
```

效果如下：

![](http://img.smyhvae.com/20170630_1415.png)

`target`属性举例：

```html
<a href="1.html" title="悬停文本" target="_blank">链接的内容</a>
```

blank 就是“空白”的意思，就表示新建一个空白窗口。为啥有一个\_ ，就是规定，没啥好解释的。
也就是说，如果不写`target=”_blank”`那么就是在相同的标签页打开，如果写了`target=”_blank”`，就是在新的空白标签页中打开。

#### 备注 1：分清楚 img 和 a 标签的各自的属性

区别如下：

```html
<img src="1.jpg" /> <a href="1.html"></a>
```

#### 备注 2：a 是一个文本级的标签

比如一个段落中的所有文字都能够被点击，那么应该是 p 包裹 a：

```html
<p>
  <a href="">段落段落段落段落段落段落</a>
</p>
```

而不是 a 包裹 p：

```html
<a href="">
  <p>
    段落段落段落段落段落段落
  </p>
</a>
```

a 的语义要小于 p，a 就是可以当做文本来处理，所以 p 里面相当于放的就是纯文字。

## 四、图片标签

img: 代表的就是一张图片。是单边标记。

img 是自封闭标签，也称为单标签。

#### 能插入的图片类型：

- 能够插入的图片类型是：jpg(jpeg)、gif、png、bmp。类型和类型之间有什么区别，css 课上讲。

- 不能往网页中插入的图片格式是：psd、ai

> HTML 页面不是直接插入图片，而是插入图片的引用地址，所以也要把图片上传到服务器上。

### `src`属性：图片的相对路径和绝对路径

这里涉及到图片的一个属性：

- `src`属性：指图片的路径。

在写**图片的路径**时，有两种写法：相对路径、绝对路径

#### 1、**写法一：相对路径**

相对当前页面所在的路径。两个标记 `.` 和 `..` 分表代表当前目录和父路径。

举例 1：

```html
<!-- 当前目录中的图片 -->
<img src="2.jpg" />
<img src=".\2.jpg" />
<!-- 上一级目录中的图片 -->
<img src="..\2.jpg" />
```

img 是 image“图片”的简写，src 是英语 source“资源”的缩写。

相对路径不会出现这种情况：

```html
aaa/../bbb/1.jpg
```

`../`要么不写，要么就写在开头。

举例 2：

```html
<img src="images/1.jpg" />
```

上方代码的意思是说，当前页面有一个并列的文件夹`images`，在文件夹`images`中存放了一张图片`1.jpg`
效果：

![Paste_Image.png](http://img.smyhvae.com/20151001_19.jpg)

相对路径的面试题。现有如下文件层级图：

![](http://img.smyhvae.com/20170630_1133.png)

问题：如果想在 index.html 中插入 1.png，那么对应的 img 语句是？

分析：

现在 document 是最大的文件夹，里面有两个文件夹 work 和 photo。work 中又有一个文件夹叫做 myweb。myweb 文件夹里面有 index.html。 所以 index.html 在 myweb 文件夹里面，上一级就是 work 文件夹，上两级就是 document 文件夹。通过 document 文件夹当做一个中转站，进入 photo 文件夹，看到了 1.png。

答案：

```html
<img src="../../photo/1.png" />
```

#### 2、写法二：**绝对路径**

绝对路径包括以下两种：

（1）以盘符开始的绝对路径。举例：

```html
<img src="C:\Users\smyhvae\Desktop\html\images\1.jpg" />
```

（2）网络路径。举例：

```html
<img src="http://api.ffbig.com/wchatp.jpeg" />
```

大家打开上面的 img 中的链接，扫一扫，可能有惊喜哦。

### 相对路径和绝对路径的总结

相对路径的好处：站点不管拷贝到哪里，文件和图片的相对路径关系都是不变的。
相对路径使用有一个前提，就是网页文件和你的图片，必须在一个服务器上。

问题：我的网页在 C 盘，图片却在 D 盘，能不能插入呢？

答案： 用相对路径不能，用绝对路径也不能。

注意：可以使用 file://来插入，但是这种方法，没有任何意义！因为服务器上没有所谓 c 盘、d 盘。

下面的方法是行的，但是没有任何工程上的意义，这是因为服务器没有盘符，linux 系统没有盘符：

```html
<img src="file://C:\Users\Danny\Pictures\明星\1.jpg" alt="" />
```

总结一下：

- 我们现在无论是在 a 标签、img 标签，如果要用路径。只有两种路径能用，就是相对路径和绝对路径。

- 相对路径，就是../ image/ 这种路径。从自己出发，找到别人；

- 绝对路径，就是http://开头的路径。

- 绝对不允许使用 file://开头的东西，这个是完全错误的！

### img 标签的其他属性

- `width`：宽度
- `height`：高度
- `Align`：指图片的水平对齐方式，属性值可以是：left、center、right
- `title`：**提示性文本**。公有属性。也就是鼠标悬停时出现的文本。
- `border`：给图片加边框（描边），单位是像素，边框的颜色是黑色
- `Hspace`：指图片左右的边距
- `Vspace`：指图片上下的边距

- `alt`：当图片不可用（无法显示）的时候，代替图片显示的内容。alt 是英语 alternate “替代”的意思，代表替换资源。（有的浏览器不支持）

举例：

```html
<img src="images/1.jpg" width="300" height="`188" title="这是美女" />
```

效果：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_20.png)

`Alt`属性效果演示：（当图片 src 不可用的时候，显示文字。这样做，至少能让用户知道，这个图片大概是什么内容）

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_21.png)

- 图片的`align`属性：**图片和周围文字的相对位置**。属性取值可以是：bottom（默认）、center、top、left、right。
  我们来分别看一下这`align`属性的这几个属性值的区别。

1、`align=""`，图片和文字低端对齐。即默认情况下的显示效果：

![](http://img.smyhvae.com/2015-10-02-cnblogs_html_19.png)

2、`align="center"`：图片和文字水平方向上居中对齐。显示效果：

![](http://img.smyhvae.com/2015-10-02-cnblogs_html_21.png)

3、`align="top"`：图片与文字顶端对齐。显示效果：

![](http://img.smyhvae.com/2015-10-02-cnblogs_html_22.png)

4、`align="left"`：图片在文字的左边。显示效果：

![](http://img.smyhvae.com/2015-10-02-cnblogs_html_23.png)

5、`align="right"`：图片在文字的右边。显示效果：

![](http://img.smyhvae.com/2015-10-02-cnblogs_html_24.png)

**注意事项：**
（1）如果要想保证图片等比例缩放，请只设置 width 和 height 中其中一个。
（2）如果想实现图文混排的效果，请使用 align 属性，取值为 left 或 right。

### 热点问题

指的是对图片的**局部区域**加超链接。
我们知道，如果给图片加一个超链接，那个点击这个图片的任意区域，都会跳转到新的位置。举例：

```html
<a href="网页2.html"><img src="2.jpg"/></a>
```

上方代码表明：给图片加一个超链接，那个点击这个图片的任意区域，都会跳转到新的位置。
现在，我只想对图片的局部区域加超链接，该怎么做呢？这里的难点在于坐标的确定，此时需要用到 Dreamweaver。

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_22.png)

上图中，切换到“设计”标签，然后：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_23.png)

上图中，点击菜单栏`插入-图像`，导入图片：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_24.png)

，在图片上点击右键，选择`属性`，弹出属性面板：

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_25.png)

上图中，我们可以利用红框部分的`地图`绘制需要添加超链接的区域。箭头处表示的是要链接到的文件。蓝框部分表示打开新页面的方式，蓝狂部分的`new`是没有下划线的，它和`_blank`的含义是一样的。

![Paste_Image.png](http://img.smyhvae.com/2015-10-01-cnblogs_html_26.png)
局部区域的热点设置完毕后，上图显示，红框部分就是多出的代码，也正是我们需要的代码。多出的代码如下：

```html
<img
  src="file:///C|/Users/smyhvae/Desktop/html/1.jpg"
  alt=""
  width="488"
  height="730"
  usemap="#Map"
/>
<map name="Map">
  <area
    shape="circle"
    coords="227,374,63"
    href="file:///C|/Users/smyhvae/Desktop/html/网页2.html"
    target="_blank"
  />
</map>
```

上方代码中，第一行的`usemap="#Map"`表示我要引用名为`Map`的地图。
然后第 02 至第 04 行就给出了地图的定义。
效果演示：

![3.gif](http://img.smyhvae.com/3.gif)

最后，送上妹子的近照一张。楼主已经仁至义尽了：http://img.smyhvae.com/2015-10-01-cnblogs_html_20150219214912_11994.jpg

怎么？还没看够？且看下文：[HTML 标签----图文详解（二）](http://www.cnblogs.com/smyhvae/p/4852863.html)

## 我的公众号

想学习<font color=#0000ff>**更多的技能**</font>？不妨关注我的微信公众号（AT 弄潮儿 id：`mokinzhao`）。

扫一扫，你将发现另一个全新的世界，而这将是一场美丽的意外：

![](http://img.smyhvae.com/cnblogs/%E7%94%9F%E5%91%BD%E5%9B%A2%E9%98%9F%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg)
