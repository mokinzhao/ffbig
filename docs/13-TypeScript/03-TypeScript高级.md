---
title: TypeScript-高级（类型体操）
---

## 声明文件编写

- declare

## 逆变协变

- 协变（covariant），如果它保持了子类型序关系≦。该序关系是：子类型≦基类型。即List可以分配给List

- 逆变（contravariant），如果它逆转了子类型序关系。 List<“Animal> 可以分配给 List<“Dog>

- 双向协变 (Bivariant) List<”Animal> 与List<”Dog>可以互相分配

- 不变 (Invariant) List<“Animal> 和 List<”Dog>不存在分配关系，或者说无法互相分配

## 参考

[TypeScript类型中的逆变协变](https://juejin.cn/post/7039315081150087181)

[神光-TypeScript 类型体操通关秘籍](https://juejin.cn/book/7047524421182947366)
