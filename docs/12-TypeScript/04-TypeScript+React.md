---
title: TypeScript + React 最佳实践
---

### 组件引入方式

- 函数组件

 ```js
//推荐使用
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
//推荐使用
type IEProps {
  Cp?: React.ComponentClass<{ id?: number }>;
}
type IEState { id: number; }

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
  const onClick = (e: React.MouseEvent<HTMLInputElement>) => {};
  // onChange使用 React.ChangeEvent 加 dom 类型的泛型
  // 一般都是 HTMLInputElement,HTMLSelectElement 可能也会使用
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
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
    const [data] = useState<AppProps | null>(null);
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

- typeof and instanceof: 用于类型区分

- keyof: 获取object的key

- O[K]: 属性查找

- [K in O]: 映射类型

- +or - or readonly or ?: 加法、减法、只读和可选修饰符

- x ? Y : Z: 用于泛型类型、类型别名、函数参数类型的条件类型

- !: 可空类型的空断言

- as: 类型断言

- as const 常量断言

- is: 函数返回类型的类型保护

- 使用查找类型访问组件属性类型

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


