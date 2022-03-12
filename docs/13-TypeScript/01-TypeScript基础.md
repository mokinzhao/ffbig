---
title: TypeScript-基础
---

## 类型概述

- 静态类型和动态类型

静态类型严格,性能较好

静态类型是编译时候确定类型，js 是执行的时候确定变量类型

- 强类型和弱类型

JS 是一门动态弱类型语言

## 基本类型

- string
- boolean
- number
- bigint
- array
- undefined
- null
- symbol

## 特殊类型

- any
- unknown
- void 
- 元组
- 枚举
- never
- object

## 枚举（enum）

- 数字枚举

```ts
enum Gender {
    ONE=1,
    TWO,
    THREE
}
```

- 字符串枚举

```ts
enum Gender {
    ONE='one',
    TWO='two',
    THREE='three'
}
```

- 异构枚举

```ts
enum Gender {
    ONE='one',
    TWO=2,
    THREE
}
```

- 联合枚举

- 枚举成员

- 枚举类型

- 常量枚举

```ts
const enum Gender {}
```

- 外部枚举

```ts
declare enum Gender {}
```

不需要一个对象，只需要对象的值

## 任意类型

- any

- null undefined

- never
  代表不会出现的值；作为不会返回函数值的类型
- void
  void 代表没有任何返回值类型
  唯一值
  void 和 never 的区别，void 可以赋值给 null undefined
- Symbol

### 交叉类型和联合类型

- 交叉类型 & 取所有类型的并集

- 联合类型 ｜取定义里面的合适类型

- 类型缩减

 1. 1｜number 
 
 2. 不想被缩减 1｜number &{}

### 索引类型

### 映射类型

### 条件类型

### 类型推导

1.基础类型推断
2.上下文类型推断

- 联合类型

```ts
let name: string | number;
name.toStrig();
name.toFixed(2);
```

- 类型断言

```ts
let name: string | number;
(name as number).toFixed(2);

(name as strig).length;
//双重断言
name as any as boolean;
```

- 字面量类型和类型字面量

```ts
type Name = "a" | "b" | "c";
```

### 类型兼容性

1. X兼容Y ：X （目标类型）= Y（源类型）

2. 源类型必须具备目标类型的必要属性

3. 接口之间赋值，成员少的兼容成员多的;

4. 参数是成员多的兼容成员少的

5. 返回值类型：程员少的兼容成员多的

6. 固定参数可以兼容可选和剩余参数的

7. 枚举类型：枚举和 number类型 可以相互兼容，枚举之间是不兼容的

8. 类兼容性 ：类里面有私有成员两个类无法兼容，其他可以兼容，父子可以兼容

9. 泛型兼容性：泛型无成员时候可以兼容，泛型函数定义相同是可以相互兼容的

- 总结

1. 结构之间兼容：成员少的兼容成员多的

2. 函数之间兼容：参数多的兼容参数少的

### 类型保护

- instance 

```ts
if(lang instanceof Java){
    lang.helloJava()
}else{
    lang.helloJavaScript()
}
```

- in 

```ts
if(lang in Java){
    lang.helloJava()
}else{
    lang.helloJavaScript()
}
```

- typeof

```ts
if(typeof x === 'string'){
    x.length()
}else{
    x.toFixed(2)
}
```

- 自定义类型保护函数

### 类型守位

### 函数

- 函数重载

```ts
add(name:string):void
add(name:number):void
add(){}
```

- is 类型缩窄

- 参数修饰符

  readonly
  public
  protected
  private

- 可选参数 x？:string

- 默认参数 x='2'

- 剩余参数 ...2

- this ,类型不固定,typeScript 会提升

### 类(class)

- 继承(extends)

- 属性和方法 修饰符

1. readonly 只读
2. public 公共
3. protected 子类 可用
4. private 自己可用
5. static 静态属性或方法

- 存取器

 1. get
 2. set

- 抽象类(abstract class)

1. 可以定义派生类要实现的属性和方法

2. 可以实现派生类需要继承的默认属性和方法

- 多态

但个继承 多个接口但实现

- 类类型

- 总结：实践oop思想离不开类的使用

### 接口

- 特性

  1. 同名接口可以写多个 2.接口可以实现继承 3.函数类型接口
  2. 只能约束类的共有成员
  3. 接口也能继承
  4. 强化面向接口编程

- 可索引接口

 数字索引

- 抽象类和接口的区别

- 接口 和 type 的区别
  能用接口不用 type

type 能使用联合和交叉类型

type 不能继承和重载

interface 只能定义一个对象

### 类型别名(type)

### TypeScript 文章推荐

- 深入理解 TypeScript <https://jkchao.github.io/typescript-book-chinese/#why>

- Vue3.0 前的 TypeScript 最佳入门实践<https://juejin.im/post/5d0259f2518825405d15ae62>
