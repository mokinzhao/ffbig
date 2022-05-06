---
title: TypeScript-面试题
---

## TypeScript 和JavaScript 的关系和区别？

- JavaScript
  - 解释型脚本语言，无需额外编译
  - 是动态弱类型语言

- TypeScript
  - TypeScript 是JavaScript 的超集合
  - 面向对象，静态类型，适合大型项目，健壮、可读性、可维护性强
  - 无法直接运行，需要babel等编译器翻译

## Type 和 Interface的区别

- 类型别名可以为任何类型引入名称。例如基本类型，联合类型等
- 类型别名不支持继承
- 类型别名不会创建一个真正的名字
- 类型别名无法被实现(implements)，而接口可以被派生类实现
- 类型别名重名时编译器会抛出错误，接口重名时会产生合并

## const和readonly的区别

- const用于变量，readonly用于属性
- const在运行时检查，readonly在编译时检查
- 使用const变量保存的数组，可以使用push，pop等方法。但是如果使用ReadonlyArray<"number>声明的数组不能使用push，pop等方法。

## 参考

[TypeScript面试题及答案收录[不断更新]](https://juejin.cn/post/6999985372440559624)

[「面试题」TypeScript](https://juejin.cn/post/6988763249982308382)
