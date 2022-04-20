---
title: React-Native
---

## 概念

## 基础应用

### RN与Native 通信

在 React Native 中，原生端和 JavaScript 交互是通过 Bridge 进行的，Bridge 的作用就是给 React Native 内嵌的 JS Engine 提供原生接口的扩展供 JS 调用。所有的本地存储、图片资源访问、图形图像绘制、3D 加速、网络访问、震动效果、NFC、原生控件绘制、地图、定位、通知等都是通过 Bridge 封装成 JS 接口以后注入 JS Engine 供 JS 调用。理论上，任何原生代码能实现的效果都可以通过 Bridge 封装成 JS 可以调用的组件和方法, 以 JS 模块的形式提供给 RN 使用。

- 发送事件到 JavaScript

原生模块可以在没有被调用的情况下往 JavaScript 发送事件通知。最简单的办法就是通过RCTDeviceEventEmitter，这可以通过ReactContext来获得对应的引用，像这样：

```java
...
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
...
private void sendEvent(ReactContext reactContext,
                       String eventName,
                       @Nullable WritableMap params) {
  reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
}
@ReactMethod
public void addListener(String eventName) {
  // Set up any upstream listeners or background tasks as necessary
}
@ReactMethod
public void removeListeners(Integer count) {
  // Remove upstream listeners, stop unnecessary background tasks
}
...
WritableMap params = Arguments.createMap();
params.putString("eventProperty", "someValue");
...
sendEvent(reactContext, "EventReminder", params);
````

- JavaScript 模块可以通过使用NativeEventEmitter模块来监听事件

```js
import { NativeEventEmitter, NativeModules } from 'react-native';
// ...

  componentDidMount() {
    // ...
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    this.eventListener = eventEmitter.addListener('EventReminder', (event) => {
       console.log(event.eventProperty) // "someValue"
    };
    // ...
  }
  componentWillUnmount() {
    this.eventListener.remove(); // 组件卸载时记得移除监听事件
  }
```

### RN调用Native原生模块


#### Native 端

1. 编写 ToastToastModule 继承 ReactContextBaseJavaModule

```java
// ToastModule.java

package com.your-app-name;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class ToastModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public ToastModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

    @Override
  public String getName() {
    return "ToastExample";
  }

    @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

    @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }
}

```


2. 第二步注册

- 创建一个新的 Java 类并命名为CustomToastPackage.java

```java
// CustomToastPackage.java

package com.your-app-name;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustomToastPackage implements ReactPackage {

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(
                              ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();

    modules.add(new ToastModule(reactContext));

    return modules;
  }

}
```


- 注册到MainApplication.java


```java
// MainApplication.java
...
import com.your-app-name.CustomToastPackage; // <-- 引入你自己的包
...
protected List<ReactPackage> getPackages() {
  @SuppressWarnings("UnnecessaryLocalVariable")
  List<ReactPackage> packages = new PackageList(this).getPackages();
  // Packages that cannot be autolinked yet can be added manually here, for example:
  // packages.add(new MyReactNativePackage());
  packages.add(new CustomToastPackage()); // <-- 添加这一行，类名替换成你的Package类的名字 name.
  return packages;
}
```

#### JS端

```js
// ToastExample.js
/**
 * This exposes the native ToastExample module as a JS module. This has a
 * function 'show' which takes the following parameters:
 *
 * 1. String message: A string with the text to toast
 * 2. int duration: The duration of the toast. May be ToastExample.SHORT or
 *    ToastExample.LONG
 */
import { NativeModules } from 'react-native';
// 下一句中的ToastExample即对应上文
// public String getName()中返回的字符串
export default NativeModules.ToastExample;
```

- 现在，在别处的 JavaScript 代码中可以这样调用你的方法：

```js
import ToastExample from './ToastExample';

ToastExample.show('Awesome', ToastExample.SHORT);
```

### RN调用Native原生组件

原生视图需要被一个ViewManager的派生类（或者更常见的，SimpleViewManager的派生类）创建和管理。一个SimpleViewManager可以用于这个场景，是因为它能够包含更多公共的属性，譬如背景颜色、透明度、Flexbox 布局等等。

这些子类本质上都是单例——React Native 只会为每个管理器创建一个实例。它们创建原生的视图并提供给NativeViewHierarchyManager，NativeViewHierarchyManager 则会反过来委托它们在需要的时候去设置和更新视图的属性。ViewManager还会代理视图的所有委托，并给 JavaScript 发回对应的事件。

提供原生视图很简单：

1. 创建一个 ViewManager 的子类。
2. 实现createViewInstance方法。
3. 导出视图的属性设置器：使用@ReactProp（或@ReactPropGroup）注解。
4. 把这个视图管理类注册到应用程序包的createViewManagers里。
5. 实现 JavaScript 模块。

## 性能优化

一般在移动端开发中，我们会使用原生应用或者 H5，但它们都有不能忽视的缺点。如果使用原生开发的话，由于客户端发版和版本审核，迭代周期会比较长；而使用 H5 的话，它的性能体验又比较差，不如原生应用流畅。所以，为了解决这两个问题，RN 就出现了。

RN 会把应用的 JS 代码（包括依赖的 framework）编译成一个 buddle.js（如 iOS 下 index.ios.bundle.js），它整体框架的目的就是解释运行这个 js 文件。如果是 js 扩展的 API，则通过调用 bridge 方法来调用 native 方法。在这个框架下，上线周期和 Hybrid 类似，

但因为框架层负责跨平台的渲染，渲染效率比 Hybrid 好得多，前端开发者只需要关心如何编写 JS 代码即可。

有关 RN 的环境搭建和基础使用，我就不多介绍了，这里重点来聊聊 RN 下的性能优化问题。

2016 年初我使用 RN 改造个人中心页面，当时遇到了两个难题：

- Listview 无限下拉列表初始渲染慢，滚动过程中卡顿体验差的问题；

- 用户在拍照时，遇到的卡死的问题，根源是调用拍照控件时出现卡顿。

第一个是 RN 的老大难问题了，我最初是通过官方提供的 Flatlist 来解决，但由于 Flatlist 追求比较一致的滑动体验，使用空白的 view 组件进行占位，如果你滑动比较快，会来不及渲染就会出现白屏。后来，我做了技术调研后，在 Native 侧封装了一个原生的ListView，通过 RN 层来调用解决了这个问题。

第二个问题，调起照片控件时出现卡顿，后来定位发现，原来是 JS 调用 Native 照片预览时，出现了延迟。

为什么会这样呢？

目前的 RN 框架，是基于大量 JSON 消息序列化和反序列化来进行通信的。它的大致逻辑包括以下两段；

从 JS 到 Native 通信，即当 JS 调用 RN 控件时，JS 会把它需要调用的 NativeModule 函数和 NativeModule 对应的名称参数用 JSON 序列化后，传递给 Native，Native 接着会提取并调用对应的 NativeModule 的方法；

从 Native 返回向 JS 通信，Native 先通过 CreateInstance 将数据处理成 JSON，再传递给 JS ，JS 完成调用 JSModule，以实现 Native调用 JS 组件的能力。

在通讯过程中，如果出现调用延迟，会导致操作后没反应情况的发生。

这就需要通过周期性调用类似 ping 的方式来检测是否出现延迟。具体来说，在调用 ping 指令后对时间进行记录，如果时间超过某个阈值，就认为出现延迟了，阻塞延迟后，需要等待该进程结束，而非持续排队调用。

解决过程中，还需要注意两点：

原有 Hybrid 工程迁移到 RN 过程中，会发现很多新旧功能兼容问题，此时我们可以重新根据 RN 下的体验去设计页面功能，而不是盲目做功能拷贝；

提前做好 RN 基础建设，打包编译和热更新流程，尽量和 Hybrid 下的基建体系保持统一。

## 原理浅析

### RN有三个线程

1. JavaScript 线程：属于 JS 引擎，用于运行 JS Bundle ；
2. Native/UI 线程：运行 Native Modules 和处理 UI 渲染、用户手势等操作；
3. Shadow 线程：在渲染之前计算元素的布局；

- JS thread： 其实是 JavaScript 线程，负责 JS 和原生代码的交互线程，因为 JS 是单线程模型，所以需要一个单独的线程来驱动，并且 JS 和 Native 交互是异步的。
- UI thread：这个可以看作是主线程，可以看作是 UI Manager 线程，负责页面的交互和控件绘制逻辑。
- Shadow thread: 这个线程是负责 Native 布局，提供给 yoga 引擎使用。

## 参考

- [React Native 原理与实践](https://juejin.cn/post/6916452544956858382)

- [2022 年 React Native 的全新架构更新](https://juejin.cn/post/7063738658913779743)

- [RN 性能优化三部曲](https://supercodepower.com/react-native-performance-native)

- [前端搞跨端跨栈|刘芳-如何在 toB 业务中用 RN 开发 APP](https://www.yuque.com/zaotalk/posts/c10-1)

- [React Native原理之跨端通信机制-网易云音乐](https://juejin.cn/post/7069687439949824031#heading-8)
