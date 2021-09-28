---
title: TypeScript + React 最佳实践
---
### 知识准备

- 建议熟读React和TypeScript官方文档

- 建议开启 tsconfig.json中 "noImplicitAny": true

放上两张TypeScript 知识脑图

![00-TypeScript-基础应用 (2).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7187768396984e57b9db27faa3f04840~tplv-k3u1fbpfcp-watermark.image?)


![01-TypeScript-高级进阶.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec29b321644a4758b67dfa2435dc941b~tplv-k3u1fbpfcp-watermark.image?)

建立了一个全栈大前端技术交流群，加群请加微信：mokinzhao

### 组件引入方式

- 函数组件

 ```js
//推荐使用✅ better
const WrapComponent: React.FC<ExtendedProps> = (props) => {
  // return ...
};
//直接使用
export default WrapComponent;

// 或者
export default function (props: React.PropsWithChildren<SpinProps>) {
  // return ...
}

 ```

- 类组件

 ```js

type IEProps {
  Cp?: React.ComponentClass<{ id?: number }>;
}
type IEState { id: number; }
//推荐使用✅ better
class ClassCpWithModifier extends React.Component<Readonly<IEProps>, Readonly<IEState>> {
  private gid: number = 1;
  public state: Readonly<IEState> = { id: 1 };
  render() { return this.state.id = 2; } // ts(2540)
}

 ```

- 两者均可使用的类型

```ts
React.ComponentType<P> = React.ComponentClass<P> | React.FunctionComponent<P>;

```

### Element

- onClick and onChange

```jsx
  // click 使用 React.MouseEvent 加 dom 类型的泛型
  // HTMLInputElement 代表 input标签 另外一个常用的是 HTMLDivElement
  const onClick = (e: React.MouseEvent<HTMLInputElement>) => {};✅ better
  // onChange使用 React.ChangeEvent 加 dom 类型的泛型
  // 一般都是 HTMLInputElement,HTMLSelectElement 可能也会使用
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};✅ better
  return (
    <>
      {'ProForm 设置泛型可以约定 onFinish 等接口的参数类型'}
      <ProForm<DataType> />
      {`
       DataType 设置render 中行的类型，
       Params 是参数的提交类型
       ValueType 表示自定的 valueType 类型，ProTable 会自动进行合并
     `}
      <ProTable<DataType, Params, ValueType> />
      <input onClick={onClick} onChange={onChange} />
    </>
  );
```

- Forms and onSubmit

```jsx
port * as React from 'react'

type changeFn = (e: React.FormEvent<HTMLInputElement>) => void

const App: React.FC = () => {

  const [state, setState] = React.useState('')

  const onChange: changeFn = e => {
    setState(e.currentTarget.value)
  }
    ✅ better
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      password: { value: string }
    } // 类型扩展
    const password = target.password.value
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={state} onChange={onChange} />
    </form>
  )

}

```

### Hooks 使用

- useState

```ts
//给定初始化值情况下可以直接使用

import { useState } from 'react';
// ...
const [val, toggle] = useState(false);
// val 被推断为 boolean 类型
// toggle 只能处理 boolean 类型


//没有初始值（undefined）或初始 null

type AppProps = { message: string };
const App = () => {
    const [data] = useState<AppProps | null>(null);✅ better
    // const [data] = useState<AppProps | undefined>();
    return <div>{data?.message}</div>;
};

```

- useEffect

```ts
function DelayedEffect(props: { timerMs: number }) {
    const { timerMs } = props;

    useEffect(() => {
        const timer = setTimeout(() => {
            /* do stuff */
        }, timerMs);
        
        // 可选
        return () => clearTimeout(timer);
    }, [timerMs]);
    // ✅ 确保函数返回 void 或一个返回 void|undefined 的清理函数
    return null;
}

//异步请求，处理方式：

// ✅ better
useEffect(() => {
    (async () => {
        const { data } = await ajax(params);
        // todo
    })();
}, [params]);

// 或者 then 也是可以的
useEffect(() => {
    ajax(params).then(({ data }) => {
        // todo
    });
}, [params])

```

- useRef

```ts
function TextInputWithFocusButton() {
    // 初始化为 null, 但告知 TS 是希望 HTMLInputElement 类型
    // inputEl 只能用于 input elements
    const inputEl = React.useRef<HTMLInputElement>(null);
    const onButtonClick = () => {
        // TS 会检查 inputEl 类型，初始化 null 是没有 current 上是没有 focus 属性的
        // 你需要自定义判断! 
        if (inputEl && inputEl.current) {
            inputEl.current.focus();
        }
        // ✅ best
        inputEl.current?.focus();
    };
    return (
        <>
            <input ref={inputEl} type="text" />
            <button onClick={onButtonClick}>Focus the input</button>
        </>
    );
}

```

- useReducer

使用 useReducer 时，多多利用 Discriminated Unions 来精确辨识、收窄确定的 type 的 payload 类型。 一般也需要定义 reducer 的返回类型，不然 TS 会自动推导。
```ts
const initialState = { count: 0 };

// ❌ bad，可能传入未定义的 type 类型，或码错单词，而且还需要针对不同的 type 来兼容 payload
// type ACTIONTYPE = { type: string; payload?: number | string };

// ✅ good
type ACTIONTYPE =
    | { type: 'increment'; payload: number }
    | { type: 'decrement'; payload: string }
    | { type: 'initial' };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + action.payload };
        case 'decrement':
            return { count: state.count - Number(action.payload) };
        case 'initial':
            return { count: initialState.count };
        default:
            throw new Error();
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({ type: 'decrement', payload: '5' })}>-</button>
            <button onClick={() => dispatch({ type: 'increment', payload: 5 })}>+</button>
        </>
    );
}

```

- useContext
一般 useContext 和 useReducer 结合使用，来管理全局的数据流。

```ts
interface AppContextInterface {
    state: typeof initialState;
    dispatch: React.Dispatch<ACTIONTYPE>;
}

const AppCtx = React.createContext<AppContextInterface>({
    state: initialState,
    dispatch: (action) => action,
});
const App = (): React.ReactNode => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppCtx.Provider value={{ state, dispatch }}>
            <Counter />
        </AppCtx.Provider>
    );
};

// 消费 context
function Counter() {
    const { state, dispatch } = React.useContext(AppCtx);
    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({ type: 'decrement', payload: '5' })}>-</button>
            <button onClick={() => dispatch({ type: 'increment', payload: 5 })}>+</button>
        </>
    );
}
```

- 自定义 Hooks

Hooks 的美妙之处不只有减小代码行的功效，重点在于能够做到逻辑与 UI 分离。做纯粹的逻辑层复用。
例子：当你自定义 Hooks 时，返回的数组中的元素是确定的类型，而不是联合类型。可以使用 const-assertions 。

```ts
//例子：当你自定义 Hooks 时，返回的数组中的元素是确定的类型，而不是联合类型。可以使用 const-assertions 。

export function useLoading() {
    const [isLoading, setState] = React.useState(false);
    const load = (aPromise: Promise<any>) => {
        setState(true);
        return aPromise.finally(() => setState(false));
    };
    return [isLoading, load] as const; // 推断出 [boolean, typeof load]，而不是联合类型 (boolean | typeof load)[]
}

//也可以断言成 tuple type 元组类型。

export function useLoading() {
    const [isLoading, setState] = React.useState(false);
    const load = (aPromise: Promise<any>) => {
        setState(true);
        return aPromise.finally(() => setState(false));
    };
    return [isLoading, load] as [
        boolean, 
        (aPromise: Promise<any>) => Promise<any>
    ];
}


//如果对这种需求比较多，每个都写一遍比较麻烦，可以利用泛型定义一个辅助函数，且利用 TS 自动推断能力。

function tuplify<T extends any[]>(...elements: T) {
    return elements;
}

function useArray() {
    const numberValue = useRef(3).current;
    const functionValue = useRef(() => {}).current;
    return [numberValue, functionValue]; // type is (number | (() => void))[]
}

function useTuple() {
    const numberValue = useRef(3).current;
    const functionValue = useRef(() => {
    }).current;
    return tuplify(numberValue, functionValue); // type is [number, () => void]
}


```

### 其他

#### 什么时候使用泛型

当你的函数，接口或者类，需要作用到很多类型的时候，
当我们需要一个 id 函数，函数的参数可以是任何值，返回值就是将参数原样返回，并且其只能接受一个参数，在 js 时代我们会很轻易地甩出一行

```js
const id = arg => arg

```

由于其可以接受任意值，也就是说我们的函数的入参和返回值都应该可以是任意类型，如果不使用泛型，我们只能重复的进行定义

```ts
type idBoolean = (arg: boolean) => boolean

type idNumber = (arg: number) => number

type idString = (arg: string) => string
```

如果使用泛型，我们只需要

```ts

function id<T>(arg: T): T {
  return arg
}

// 或

const id1: <T>(arg: T) => T = arg => {
  return arg
}

```

- 需要被用到很多地方的时候，比如常用的工具泛型 Partial。
功能是将类型的属性变成可选， 注意这是浅 Partial

```js
type Partial<T> = { [P in keyof T]?: T[P] }
```

如果需要深 Partial 我们可以通过泛型递归来实现

```js
type DeepPartial<T> = T extends Function

  ? T

  : T extends object

  ? { [P in keyof T]?: DeepPartial<T[P]> }

  : T

type PartialedWindow = DeepPartial<Window>

```

#### Type 和Interface的选用时机

- 在定义公共 API 时(比如编辑一个库）使用 interface，这样可以方便使用者继承接口
- 在定义组件属性（Props）和状态（State）时，建议使用 type，因为 type的约束性更强
- type 类型不能二次编辑，而 interface 可以随时扩展

#### 请求封装

```ts
interface RequestMethodInUmi<R = false> {
  <T = any>(
    url: string,
    options: RequestOptionsWithResponse & { skipErrorHandler?: boolean },
  ): Promise<RequestResponse<T>>;
  <T = any>(
    url: string,
    options: RequestOptionsWithoutResponse & { skipErrorHandler?: boolean },
  ): Promise<T>;
  <T = any>(
    url: string,
    options?: RequestOptionsInit & { skipErrorHandler?: boolean },
  ): R extends true ? Promise<RequestResponse<T>> : Promise<T>;
}
const request: RequestMethodInUmi = (url: any, options: any) => {
  const requestMethod = getRequestMethod();
  return requestMethod(url, options);
};

declare namespace API {
   type ResponseInfoStructure = {
    success: boolean; // if request is success
    data?: Record<string, never>; // response data
    message?: string;
    errorCode?: string; // code for errorType
    errorMessage?: string; // message display to user
  };
}
export async function getFakeCaptcha(
  params: {
    // query
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ResponseInfoStructure>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }:);
}

```

- 推荐的前后端一体化插件

1. swagger-typescript-api <https://github.com/acacode/swagger-typescript-api>
2. yapi-to-typescript <https://github.com/fjc0k/yapi-to-typescript>
3. GraphQL Code Generator <https://www.graphql-code-generator.com>


#### 常用技巧

- 对象类型尽量使用Record<string, unknown> 代替{} 和object

```ts
type ObjectTypes = {
    objBetter: Record<string, unknown>; // ✅ better，代替 obj: object
    
    // 对于 obj2: {}; 有三种情况：
    obj2Better1: Record<string, unknown>; // ✅ better 同上
    obj2Better2: unknown; // ✅ any value
    obj2Better3: Record<string, never>; // ✅ 空对象
    
    /** Record 更多用法 */
    dict1: {
        [key: string]: MyTypeHere;
    };
    dict2: Record<string, MyTypeHere>; // 等价于 dict1
};

//好处：

//1.当你书写 home 值时，键入 h 常用的编辑器有智能补全提示；
//2.home 拼写错误成 hoem，会有错误提示，往往这类错误很隐蔽；
//3.收窄接收的边界。

```

- 函数类型不建议直接给 Function 类型，有明确的参数类型、个数与返回值类型最佳

```ts
type FunctionTypes = {
    onSomething: Function; // ❌ bad，不推荐。任何可调用的函数
    onClick: () => void; // ✅ better ，明确无参数无返回值的函数
    onChange: (id: number) => void; // ✅ better ，明确参数无返回值的函数
    onClick(event: React.MouseEvent<HTMLButtonElement>): void; // ✅ better
};
```

- React Prop 类型

```ts
export declare interface AppProps {
    children1: JSX.Element; // ❌ bad, 没有考虑数组类型
    children2: JSX.Element | JSX.Element[]; // ❌ 没考虑字符类型
    children3: React.ReactChildren; // ❌ 名字唬人，工具类型，慎用
    children4: React.ReactChild[]; // better, 但没考虑 null
    children: React.ReactNode; // ✅ best, 最佳接收所有 children 类型
    functionChildren: (name: string) => React.ReactNode; // ✅ 返回 React 节点
    
    style?: React.CSSProperties; // React style
    
    onChange?: React.FormEventHandler<HTMLInputElement>; // 表单事件! 泛型参数即 `event.target` 的类型
}
```

- 使用查找类型访问组件属性类型

```ts
// Great
import Counter from './d-tips1'

type PropsNew = React.ComponentProps<typeof Counter> & {

  age: number

}

const App: React.FC<PropsNew> = props => {

  return <Counter {...props} />

}
export default App

```

- Promise 类型

```ts

type IResponse<T> = {
  message: string
  result: T
  success: boolean
}

async function getResponse(): Promise<IResponse<number[]>> {
  return {
    message: '获取成功',
    result: [1, 2, 3],
    success: true,
  }
}

getResponse().then(response => {
  console.log(response.result)
})
```

- typeof/instanceof/in/is: 类型守卫用于类型区分

```ts
//typeof
function doSome(x: number | string) {
  if (typeof x === 'string') {
    // 在这个块中，TypeScript 知道 `x` 的类型必须是 `string`
    console.log(x.subtr(1)); // Error: 'subtr' 方法并没有存在于 `string` 上
    console.log(x.substr(1)); // ok
  }

  x.substr(1); // Error: 无法保证 `x` 是 `string` 类型
}

//instanceof

class Foo {
  foo = 123;
  common = '123';
}
class Bar {
  bar = 123;
  common = '123';
}
function doStuff(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  }
  if (arg instanceof Bar) {
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}
doStuff(new Foo());
doStuff(new Bar());

//in

interface A {
  x: number;
}

interface B {
  y: string;
}

function doStuff(q: A | B) {
  if ('x' in q) {
    // q: A
  } else {
    // q: B
  }
}

//is

function isString(test: any): test is string{
    return typeof test === 'string';
}

function example(foo: number | string){
    if(isString(foo)){
        console.log('it is a string' + foo);
        console.log(foo.length); // string function
    }
}
example('hello world');
// is 为关键字的「类型谓语」把参数的类型范围缩小了,当使用了 test is string 之后,我们通过 isString(foo) === true 明确知道其中的参数是 string,而 boolean 并没有这个能力,这就是 is 关键字存在的意义.

```

- 索引/映射/条件/断言 类型

```ts

//用extends 关键字判断两个类型的子类型关系
  type isSubTyping<Child, Par> = Child extends Par ? true : false;
  type isAssertable<T, S> = T extends S ? true :  S extends T ? true : false;
  type isNumAssertable = isAssertable<1, number>; // true
  type isStrAssertable = isAssertable<string, 'string'>; // true
  type isNotAssertable = isAssertable<1, boolean>; // false

//条件类型中的类型推断 infer
{
  type ElementTypeOfObj<T> = T extends { name: infer E; id: infer I } ? [E, I] : never;
  type isArray = ElementTypeOfObj<{ name: 'name'; id: 1; age: 30 }>; // ['name', 1]
  type isNever = ElementTypeOfObj<number>; // never
}
// keyof: 获取object的key
  type MixedObjectKeys = keyof MixedObject; // string | number
  type animalKeys = keyof animal; // 'type' | 'age'
  type numberIndexKeys = keyof numberIndex; // "type" | "age" | "nickname"

// O[K]: 属性查找
class Images {
    public src: string = 'https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
    public alt: string = '谷歌'
    public width: number = 500
}
type propsNames = keyof Images
type propsType = Images[propsNames]

// “[K in O]”: 映射类型
  type SpecifiedKeys = 'id' | 'name';
  type TargetType = {
    [key in SpecifiedKeys]: any;
  }; // { id: any; name: any; }
  type TargetGeneric<O extends string | number | symbol> = {
    [key in O]: any;
  }
  type TargetInstance = TargetGeneric<SpecifiedKeys>; // { id: any; name: any; }

/* !: 非空断言-不建议用 */
const data={
    a:''
    b:{c:''}
} 
  data!.a!.c
/* as as : 双重断言*/

function handler(event: Event) {
  const element = (event as any) as HTMLElement; // ok
}

/* as const 常量断言*/

// type '"hello"'
let x = "hello" as const
// type 'readonly [10, 20]'
let y = [10, 20] as const
// type '{ readonly text: "hello" }'
let z = { text: "hello" } as const
//优点：
//1.对象字面量的属性，获得readonly的属性，成为只读属性
//2.数组字面量成为readonly tuple只读元组
//3.字面量类型不能被扩展（比如从hello类型到string类型）
```

#### 常用工具类型

- Partial 对象或接口属性变为可选

```ts
type partial<T> = { [K in keyof T]?: T[K] }
```

- Required 对象或接口属性变为必选

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};

```

- Pick 提取指定属性 为新的类型 

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

- Omit 忽略指定属性为新的类型

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

- Readonly 所有属性设为只读

```ts
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]
}
```

- Exclude 从联合类型中去除指定的类型

```ts
type Exclude<T, U> = T extends U ? never : T;
```

- Extract 从联合类型中提取指定的类型

```ts
type Extract<T, U> = T extends U ? T : never;
```

- NonNullable 从联合类型中去除 null 或者 undefined 的类型

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

- record

```ts
type MyExclude<T, K> = T extends K ? never : T;
```

### 参考文档

::: tip
React+TypeScript Cheatsheets ⭐️⭐️⭐️
<https://github.com/typescript-cheatsheets/react/>
:::

::: tip
React + TypeScript实践 ⭐️⭐️
<https://juejin.cn/post/6952696734078369828/>
:::


