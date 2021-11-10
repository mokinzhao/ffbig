---
title: TypeScript-进阶
---

## 抽象类、重载、重写、继承、多态

- 抽象类（abstract）

- 重写（override）

- 重载（overload）

- 继承 (extends)
  子类 使用父类属性和方法
  
- 多态
  不同的子类有不同的实现

## 泛型

### 定义

1. 泛型指的是类型参数化，即原来某种具体的类型进行参数化

2. 可以给泛型定义若干个参数类型

3. 并在调用时给泛型传入明确的类型参数

### 特性

1. 函数和类可以轻松地支持多钟类型，增强程序的扩展性
2. 不必写多条函数重载，冗长的联合类型声明，增强代码可读性
3. 灵活控制类型之间的约束，有效约束类型成员之间的关系
4. 泛型可以写多个

```ts
function reflect<P>(param:P):P{
    return param
}

const reflectStr=reflect<string>('string')

const reflectStr=reflect<number>(0)
```

### 泛型-参数

```ts
function useState<S>(state:S,initialValue>:S){
    return [state,()=>void 0] as unknown as [S,(s:S)=>void]
}

```

### 泛型-类

```ts
class Memory<S>{
    store:S
 constructor(store:S){
     this.store=store
 }

 set store(store:S){
     this.store=store
 }

 get store(){
    return this.store
 }
}

```

### 泛型-组件

### 泛型-函数

### 泛型-接口

### 默认泛型

### 泛型约束

```ts
interface LengthWise={

}

function logger< T extends LengthWise>(val:T)
```

## 装饰器

- 类装饰器

- 类装饰器工厂

可以多，但不可以少

- 属性装饰器
- 方法装饰器
- 参数装饰器
- 装饰器执行顺序

  1.类装饰器最后执行 ;后写先执行 2.方法和就去参数先执行

  先内后外执行，先上后下

### 类型兼容性

### 类型声明

::: tip
React + TypeScript最佳实践 ⭐️
<https://juejin.cn/post/6952696734078369828/>
:::
