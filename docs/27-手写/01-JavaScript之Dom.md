---
title: JavaScript之Dom和Bom
---

## DOM

### 实现一个可以拖拽的DIV

```js
var dragging = false
var position = null

xxx.addEventListener('mousedown',function(e){
  dragging = true
  position = [e.clientX, e.clientY]
})
document.addEventListener('mousemove', function(e){
  if(dragging === false) return null
  const x = e.clientX
  const y = e.clientY
  const deltaX = x - position[0]
  const deltaY = y - position[1]
  const left = parseInt(xxx.style.left || 0)
  const top = parseInt(xxx.style.top || 0)
  xxx.style.left = left + deltaX + 'px'
  xxx.style.top = top + deltaY + 'px'
  position = [x, y]
})
document.addEventListener('mouseup', function(e){
  dragging = false
})
```

### 图片懒加载

```js
// <img src="default.png" data-src="https://xxxx/real.png">
function isVisible(el) {
  const position = el.getBoundingClientRect()
  // 可视区域高度
  const windowHeight = document.documentElement.clientHeight
  // 顶部边缘可见
  const topVisible = position.top > 0 && position.top < windowHeight;
  // 底部边缘可见
  const bottomVisible = position.bottom < windowHeight && position.bottom > 0;
  return topVisible || bottomVisible;
}

function imageLazyLoad() {
  const images = document.querySelectorAll('img')
  for (let img of images) {
    const realSrc = img.dataset.src
    if (!realSrc) continue
    if (isVisible(img)) {
      img.src = realSrc
      img.dataset.src = ''
    }
  }
}

// 测试
window.addEventListener('load', imageLazyLoad)
window.addEventListener('scroll', imageLazyLoad)
// or
window.addEventListener('scroll', throttle(imageLazyLoad, 1000))

```

### 滚动加载

- 原理就是监听页面滚动事件，分析clientHeight、scrollTop、scrollHeight三者的属性关系。

```js
window.addEventListener('scroll', function() {
  const clientHeight = document.documentElement.clientHeight;
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  if (clientHeight + scrollTop >= scrollHeight) {
    // 检测到滚动至页面底部，进行后续操作
    // ...
  }
}, false);

```

### 渲染大数据不卡住页面

- 合理使用createDocumentFragment和requestAnimationFrame

```js
setTimeout(() => {
  // 插入十万条数据
  const total = 100000;
  // 一次插入的数据
  const once = 20;
  // 插入数据需要的次数
  const loopCount = Math.ceil(total / once);
  let countOfRender = 0;
  const ul = document.querySelector('ul');
  // 添加数据的方法
  function add() {
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < once; i++) {
      const li = document.createElement('li');
      li.innerText = Math.floor(Math.random() * total);
      fragment.appendChild(li);
    }
    ul.appendChild(fragment);
    countOfRender += 1;
    loop();
  }
  function loop() {
    if(countOfRender < loopCount) {
      window.requestAnimationFrame(add);
    }
  }
  loop();
}, 0)

```

### 打印出当前网页使用了多少种HTML元素

```js
const fn = () => {
  return [...new Set([...document.querySelectorAll('*')].map(el => el.tagName))].length;
}

```

### 判断元素是否在可视区域内

- getBoundingClientRect

Element.getBoundingClientRect()  方法返回元素的大小及其相对于视口的位置。返回的是一个对象，对象里有这8个属性：left，right，top，bottom，width，height，x，y

- 缺点：
       1. 每次scroll都得重新计算，性能耗费大
       2. 引起重绘回流

```js
// html
<div id="box"></div>
body {
       height: 3000px;
       width: 3000px;
      }

#box {
       width: 300px;
       height: 300px;
       background-color: red;
       margin-top: 300px;
       margin-left: 300px;
    }
// js
const box = document.getElementById('box')
        window.onscroll = function () {
            // box完整出现在视口里才会输出true，否则为false
            console.log(checkInView(box))
        }

function checkInView(dom) {
        const { top, left, bottom, right } = dom.getBoundingClientRect()
        console.log(top, left, bottom, right)
        console.log(window.innerHeight, window.innerWidth)
        return top >= 0 &&
                left >= 0 &&
                bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                right <= (window.innerWidth || document.documentElement.clientWidth)
        }
```

- IntersectionObserver

IntersectionObserver接口 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态的方法。祖先元素与视窗(viewport)被称为根(root)

通俗点说就是：IntersectionObserver是用来监听某个元素与视口的交叉状态的。交叉状态是什么呢？请看下图，一开始整个元素都在视口内，那么元素与视口的交叉状态就是100%，而我往下滚动，元素只有一半显示在视口里，那么元素与视口的交叉状态为50%：

```js
body {
            height: 3000px;
            width: 3000px;
        }

#box1 {
            width: 300px;
            height: 300px;
            background-color: red;
            margin-top: 100px;
            margin-left: 300px;
        }
#box2 {
            width: 300px;
            height: 300px;
            background-color: red;
            margin-top: 100px;
            margin-left: 300px;
        }
<div id="box1"></div>
<div id="box2"></div>

const io = new IntersectionObserver(entries => {
            console.log(entries)
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1]
            // root: xxxxxxxxx
        })
io.observe(document.getElementById('box1'))
io.observe(document.getElementById('box2'))

```



### 将虚拟 Dom 转化为真实 Dom

- 题目：JSON 格式的虚拟 Dom 怎么转换成真实 Dom

```js
{
  tag: 'DIV',
  attrs:{
  id:'app'
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}
//把上诉虚拟Dom转化成下方真实Dom
<div id="app">
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>

```

- 实现

```js
// 真正的渲染函数
function _render(vnode) {
  // 如果是数字类型转化为字符串
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  // 字符串类型直接就是文本节点
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }
  // 普通DOM
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    // 遍历属性
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key];
      dom.setAttribute(key, value);
    });
  }
  // 子数组进行递归操作
  vnode.children.forEach((child) => dom.appendChild(_render(child)));
  return dom;
}
```

### 请实现 DOM2JSON 一个函数

- 题目描述

```js
<div>
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>

//把上诉dom结构转成下面的JSON格式

{
  tag: 'DIV',
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}

```

- 代码实现

```js
function dom2Json(domtree) {
  let obj = {};
  obj.name = domtree.tagName;
  obj.children = [];
  domtree.childNodes.forEach((child) => obj.children.push(dom2Json(child)));
  return obj;
}


```

### 将树结构转换为DOM

- 题目描述

```js
{
    tag: 'DIV',
    children: [
        { tag: 'SPAN', children: [] },
        {
            tag: 'UL',
            children: [
                { tag: 'LI', children: [] },
                { tag: 'LI', children: [] }
            ]
        }
    ]
}

将上方的树结构对象转化为下面的DOM

<div>
    <span></span>
    <ul>
        <li></li>
        <li></li>
    </ul>
</div>

```

- 代码实现

```js
// 真正的渲染函数
function _render(vnode) {
  // 如果是数字类型转化为字符串
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  // 字符串类型直接就是文本节点
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }
  // 普通DOM
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    // 遍历属性
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key];
      dom.setAttribute(key, value);
    });
  }
  // 子数组进行递归操作
  vnode.children.forEach((child) => dom.appendChild(_render(child)));
  return dom;
}
```

### 返回DOM tree的高度

- 题目描述

    1. Tree的高度是指从根结点开始到叶节点最大的层数。空根结点的高度是0。

    2. 给定一个DOM tree，能否返回它的高度？

    3. 比如如下的DOM tree的高度是4。

```js
<div>
  <div>
    <p>
      <button>Hello</button>
    </p>
  </div>
  <p>
    <span>World!</span>
  </p>
</div>
```

- 代码实现

```js

/**
 * @param {HTMLElement | null} tree
 * @return {number}
 */
// BFS 递归实现
function getHeight(tree) {
  if (!tree) return 0
  const result = []

  const bfs = (nodes) => {
    if (nodes.length) {
      let childs = []
      for (let i = 0; i < nodes.length; i += 1) {
        const children = nodes[i].children
        childs = [...childs, ...children]
      }
      result.push(childs)
      bfs(childs)
    }
  }

  bfs([tree])

  return result.length       
}

```

### 事件委托

```js
  function delegate(element, eventType, selector, fn) {
            element.addEventListener(eventType, e => {
                let el = e.target
                while (!el.matches(selector)) {
                    if (element === el) {
                        el = null
                        break
                    }
                    el = el.parentNode
                }
                el && fn.call(el, e, el)
            },true)
            return element
        }
```

### JSONP 跨域

- 作用：
script标签不遵循同源协议，可以用来进行跨域请求，优点就是兼容性好但仅限于GET请求

- 实现步骤:
    - 创建script标签
    - 设置script标签的src属性，以问号传递参数，设置好回调函数callback名称
    - 插入到html文本中
    - 调用回调函数，res参数就是获取的数据

```js
let script = document.createElement('script');

script.src = 'http://www.baidu.cn/login?username=JasonShu&callback=callback';

document.body.appendChild(script);

function callback (res) {
    console.log(res);
}
```

- 基于Promise封装

```js
const jsonp = ({ url, params, callbackName }) => {
  const generateUrl = () => {
    let dataSrc = '';
    for (let key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        dataSrc += `${key}=${params[key]}&`;
      }
    }
    dataSrc += `callback=${callbackName}`;
    return `${url}?${dataSrc}`;
  }
  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement('script');
    scriptEle.src = generateUrl();
    document.body.appendChild(scriptEle);
    window[callbackName] = data => {
      resolve(data);
      document.removeChild(scriptEle);
    }
  })
}

```

## BOM

### 检测移动/PC设备

```js
const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop';
```

### 实现Browser history

- 浏览器中关于history的常见操作有
    1. new BrowserHistory() - 打开一个新的tab的时候，会有一个新的空history
    2. goBack() - 回到上一个地址，注意当前地址会被保留，使得forward()可以帮助我们返回
    3. forward() - 前往之前访问过的地址
    4. visit() - 当你输入一个新的地址，或者点击一个链接的时候，会添加一个新的记录不过可以forward()前往的地址会被消除 

```js
class BrowserHistory {
  constructor(url) {
    this.history = [url || undefined]
    this.index = 0
  }

  visit(url) {
    if (this.index === this.history.length - 1) {
      this.history.push(url)
    } else {
      this.history = this.history.splice(0, this.index + 1)
      this.history.push(url)
    }
    this.index = this.history.length - 1
  }
  
  get current() {
    return this.history[this.index]
  }
  
  goBack() {
    this.index -= 1
    this.index = this.index < 0 ? 0 : this.index
    return this.history[this.index]
  }
  
  forward() {
    this.index += 1
    this.index = this.index > this.history.length - 1 ? this.history.length - 1 : this.index
    return this.history[this.index]
  }
}

```