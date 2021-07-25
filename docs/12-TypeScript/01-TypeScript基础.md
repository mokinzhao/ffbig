---
title: TypeScript基础
---

# 类型概述

静态类型和动态类型 ,强类型和弱类型

# 基本类型

- string
- boolean
- number
- bigint
- 数组、元组

## 枚举

- 普通枚举

```ts
enum Gender {}
```

- 常量枚举

```ts
const enum Gender {}
```

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

-

### 类型推导

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

### 函数

- 函数重载

```ts
add(name:string):void
add(name:number):void
add(){}
```

- 参数修饰符
  public
  readonly

### 类

- 类继承

### 接口

- 特性

  1.同名接口可以写多个 2.接口可以实现继承 3.函数类型接口

- 可索引接口

- 抽象类和接口的区别

- 接口 和 type 的区别
  能用接口不用 type

### TypeScript 文章推荐

- 深入理解 TypeScript <https://jkchao.github.io/typescript-book-chinese/#why>

- Vue3.0 前的 TypeScript 最佳入门实践<https://juejin.im/post/5d0259f2518825405d15ae62>
