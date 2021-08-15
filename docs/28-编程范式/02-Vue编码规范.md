---
title: Vue 推荐写法
---

## Vue 推荐写法

5.1、组件名为多个单词

我们开发过程中自定义的组件的名称需要为多个单词，这样做可以避免跟现有的以及未来的 HTML 元素相冲突，因为所有的 HTML 元素名称都是单个单词的。

推荐：

```js
Vue.component('todo-item', {
  // ...
})
export default {
  name: 'TodoItem',
  // ...
}
```

不推荐：

```js
Vue.component('todo', {
  // ...
})
export default {
  name: 'Todo',
  // ...
}
```

5.2、组件的 data 必须是一个函数
当在组件中使用  data  属性的时候 (除了  new Vue  外的任何地方)，它的值必须是返回一个对象的函数。 因为如果直接是一个对象的话，子组件之间的属性值会互相影响。

推荐：

```js
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

不推荐：

```js
export default {
  data: {
    foo: 'bar'
  }
}
```

5.3、Prop 定义应该尽量详细
prop 的定义应该尽量详细，至少需要指定其类型。

推荐：

```js
props: {
  status: String
}
// 更好的做法！
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```

不推荐：

```js
props: ['status']
```

5.4、为 v-for 设置键值
v-for 中总是有设置 key 值。在组件上*总是*必须用  key  配合  v-for，以便维护内部组件及其子树的状态。

推荐：

```js
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

不推荐：

```js
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

5.5、完整单词的组件名
组件名应该倾向于完整单词而不是缩写，编辑器中的自动补全已经让书写长命名的代价非常之低了，而其带来的明确性却是非常宝贵的。不常用的缩写尤其应该避免。

推荐：

```js
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

不推荐：

```js
components/
|- SdSettings.vue
|- UProfOpts.vue
```

5.6、多个特性元素的每个特性分行
在 JavaScript 中，用多行分隔对象的多个属性是很常见的最佳实践，因为这样更易读。

推荐：

```js
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

不推荐：

```js
<MyComponent foo="a" bar="b" baz="c"/>
```

5.7、模板中简单的表达式
组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。复杂表达式会让你的模板变得不那么声明式。我们应该尽量描述应该出现的*是什么*，而非*如何*计算那个值。而且计算属性和方法使得代码可以重用。

推荐：

```js
<!-- 在模板中 -->
{{ normalizedFullName }}
// 复杂表达式已经移入一个计算属性
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```

不推荐：

```js
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

5.8、简单的计算属性
应该把复杂计算属性分割为尽可能多的更简单的属性。

推荐：

```js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```

不推荐：

```js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

5.9、指令缩写
指令推荐都使用缩写形式，(用 : 表示 v-bind: 、用 @ 表示 v-on: 和用 # 表示 v-slot:)。

推荐：

```js
<input
  @input="onInput"
  @focus="onFocus"
>
```

不推荐：

```js
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

5.10、标签顺序保持一致
单文件组件应该总是让标签顺序保持为 、<script>、 <style> 。

推荐：

```js
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

不推荐：

```js
<!-- ComponentA.vue -->
<template>...</template>
<style>/* ... */</style>
<script>/* ... */</script>
```

5.11、组件之间通信

```js
父子组件的通信推荐使用 prop 和 emit，而不是 this.$parent 或改变 prop；
兄弟组件之间的通信推荐使用 EventBus（$emit　/ $on），而不是滥用 vuex；
祖孙组件之间的通信推荐使用 $attrs / $listeners 或 provide / inject（依赖注入） ，而不是滥用 vuex；
```

5.12、页面跳转数据传递

```js
页面跳转，例如 A 页面跳转到 B 页面，需要将 A 页面的数据传递到 B 页面，推荐使用 路由参数进行传参，而不是将需要传递的数据保存 vuex，然后在 B 页面取出 vuex 的数据，因为如果在 B 页面刷新会导致 vuex 数据丢失，导致 B 页面无法正常显示数据。
```

推荐：

```js
let id = ' 123';
this.$router.push({name: 'homeworkinfo', query: {id:id}});
```

5.13、script 标签内部声明顺序

```js
script 标签内部的声明顺序如下：
data > prop > components > filter > computed > watch > 钩子函数（钩子函数按其执行顺序） > methods
```

5.14、计算属性 VS 方法 VS 侦听器

```js
（1）推荐使用计算属性：计算属性基于响应式依赖进行缓存，只在相关响应式依赖发生改变时它们才会重新求值；相比之下，每次调用方法都会再次执行方法；
（2）推荐使用计算属性：而不是根据 Watch 侦听属性，进行回调； 但是有计算属性做不到的：当需要在数据变化时执行异步或开销较大的操作时，侦听器是最有用的。
```

5.15、v-if VS v-show

```js
v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的属性 display 进行切换。
```

推荐：

```js
如果运行时，需要非常频繁地切换，推荐使用 v-show 比较好；如果在运行时，条件很少改变，则推荐使用 v-if 比较好。
```

#### Vue 开发必须知道的 36 个技巧【近 1W 字】

[https://juejin.im/post/5d9d386fe51d45784d3f8637#heading-50](https://juejin.im/post/5d9d386fe51d45784d3f8637#heading-50?fileGuid=HtKDCxcXdhJCcqy3)


### JS 代码整洁之道：

[https://github.com/alivebao/clean-code-js](https://github.com/alivebao/clean-code-js?fileGuid=HtKDCxcXdhJCcqy3)
