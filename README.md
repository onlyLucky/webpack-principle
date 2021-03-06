<div align="center">
  <h1>webpack-principle</h1>
  <p>对webpack打包工具的个人理解,原理的部分实践</p>
  <a href="https://github.com/onlyLucky/webpack-principle">
    <img src="https://s4.ax1x.com/2022/02/28/bu6BJx.png" alt="node">
  </a>
  <a href="https://github.com/onlyLucky/webpack-principle">
    <img src="https://s4.ax1x.com/2022/02/28/bu6yQO.png" alt="npm">
  </a>
  <a href="https://github.com/onlyLucky/webpack-principle">
    <img src="https://s4.ax1x.com/2022/02/28/bu6sSK.png" alt="build">
  </a>
  <a href="https://github.com/onlyLucky/webpack-principle">
    <img src="https://s4.ax1x.com/2022/02/28/bu6DW6.png" alt="license">
  </a>
</div>

## 目录

1. [webpack 解决问题](#webpack解决问题)
2. [使用 webpack 实现模块化打包](#使用webpack实现模块化打包)
3. [loader 实现特殊资源的加载](#loader实现特殊资源的加载)
4. [plugin 插件机制](#plugin插件机制)
5. [webpack 运行机制和核心工作原理](webpack运行机制和核心工作原理)
6. [使用 DevServer 提高本地开发效率](使用DevServer提高本地开发效率)
7. [sourceMap 配置](sourceMap配置)
8. [HMR 模块热替换机制](HMR模块热替换机制)
9. [webpack 高级特性及应对项目优化需求](webpack高级特性及应对项目优化需求)

## webpack 解决问题

如何在前端项目中更高效的管理和维护项目中的每一个资源，想要理解 webpack，就要先对它想要解决的问题或者目标有一个充分认识

webpack 的产生是由前端模块化演化进程相关的，下面会介绍前端模块化的过程

### 模块化过程

[js 模块化详细文档](doc/js模块化.md)

> 早期的前端技术标准根本没有预料到前端行业会有今天这个规模，所以在设计上存在很多缺陷

1. 文件划分方式

[![bPU6PO.png](https://s4.ax1x.com/2022/02/23/bPU6PO.png)](https://imgtu.com/i/bPU6PO)

这种相对简单粗暴的文件划分，只是简单的解决了模块划分，但是同时还是带来了很多问题

> **缺点：**
>
> - 模块直接在全局工作，大量模块成员污染全局作用域
> - 没有私有空间，所有模块内的成员都可以在模块外部被访问修改
> - 一旦模块增多，容易产生命名冲突
> - 无法管理模块与模块之间的依赖关系
> - 在维护的过程中也很难分辨每个成员所属的模块

下面代码是引入上面的文件划分后的模块
[![bPNICF.png](https://s4.ax1x.com/2022/02/23/bPNICF.png)](https://imgtu.com/i/bPNICF)

2. 命名空间方式

可见的下面使用全局变量对象添加键值

```js
// module-a.js
window.moduleA = {
  method1: function(){
    console.log('moduleA#method1')
  }
}

// module-b.js
window.moduleB = {
  data: 'one',
  method1: fucntion(){
    console.log('moduleB#method1')
  }
}
```

显而易见当前方式，只是解决命名冲突的问题，但其他问题依旧存在

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="module-a.js"></script>
    <script src="module-b.js"></script>
    <script>
      moduleA.method1();
      moduleB.method1();
      // 模块成员依旧可以修改
      moduleB.data = "foo";
    </script>
  </body>
</html>
```

3. IIFE 立即调用函数

[立即调用函数表达式](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)

```js
// module-a.js
;(fucntion(){
  var name = 'module-a'
  function method1(){
    console.log(name + '#method1')
  }
  window.moduleA = {
    method1
  }
})()
```

4. IIFE 依赖参数

```js
// module-a.js
;(fucntion($){
  var name = 'module-a'
  function method1(){
    console.log(name + '#method1')
  }
  window.moduleA = {
    method1
  }
})(Jquery)
```

更为理想的方式是在页面中引入一个 JS 入口文件，其余用到的模块可以通过代码控制，能够按需加载，随之后面就出现了模块化规范

### 模块化规范

**模块化规范的出现**

> 目前通过约定实现模块化的方式
>
> 但是不同的开发者在实施的过程中会出现一些细微的差别
>
> 为了统一不同开发者、不同项目之间的差异
>
> 这个时候就需要一个行业标准去规范模块化的实现

**根本需求：**

- 一个统一的模块化标准规范
- 一个可以自动加载模块的基本库

---

#### CommonJS 规范

是 nodejs 中所遵循的模块规范

该规范约定一个文件就是一个模块，每个模块都有单独的作用域，通过 module。exports 导出成员，在通过 require 函数载入模块

早期制定前端模块化标准时，并没有直接选择 CommonJS 规范，而是选择专门为浏览器端重新设计了一个规范`AMD`，即异步模块定义规范，同期推出`Require.js`,除了实现 AMD 模块化规范，本身也是一个非常强大的模块加载器

随着前端模块化标准日渐完善，ES6 推出了 ES Modules 规范

前端模块化规范最佳实践方式也基本实现统一

- 在 node 环境中，遵循 CommonJS 规范
- 在浏览器环境中，遵循 ES Modules 规范

#### ES Modules

随着 webpack 等一系列打包工具的流行，这一个规范开始逐渐被普及，经过多年的迭代，ES Modules 已发展成为现今最主流的前端模块化标准

下面是 ES Modules 参考链接，本身特性就不多做赘述了，也可以参考上面提供的文档：

- [MDN ES Module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

### 模块打包工具

为什么会出现模块打包工具

- 我们所使用的 ES Modules 模块本身就**存在环境兼容问题**，尽管主流浏览器最新版本都支持这一特性，但是你无法确保用户的浏览器版本
- 模块化的方式划分出来的模块文件过多，但是前段应用又运行在浏览器中，每个文件都需要发送请求，**频繁发送网络请求，影响应用工作效率**
- 前端应用日益复杂，不仅仅只用 JavaScript 代码需要模块化，html 和 css 等这些**资源文件也有模块化问题**

[![biuk80.png](https://s4.ax1x.com/2022/02/24/biuk80.png)](https://imgtu.com/i/biuk80)

> 前端模块化进程，是我们深入学习 webpack 前必须要掌握的内容，也是前端开发者必不可少的基础储备
>
> webpack 从一个打包工具，发展成为前端项目构建系统，虽然表面上只是发生了名称上的变化，但是背后透露出来的是：模块化思想的伟大，可以帮助你统治前端整个项目

## 使用 webpack 实现模块化打包

- 能够将散落的模块打包在一起
- 能够编译代码中的新特性
- 能够支持不同种类的前端资源模块

其中最主流的就是 webpack、parcel、和 rollup

下面以 webpack 为例：

- webpack 作为一个模块打包工具，本身就可以实现模块化代码打包问题，通过 webpack 可以将零散的 js 代码打包到一个 js 文件中
- 对于有环境兼容问题的代码。webpack 可以在打包过程中通过 loader 机制对其实现编译转换，然后在进行打包
- 对于不同类型的前端模块，webpack 支持在 js 中以模块化的方式载入任意类型的资源文件
- 具备代码拆分的能力，能够将应用中心所有的模块按需进行分包，去除了单个文件过大，导致加载慢的问题

### webpack 快速上手

下面是打包项目文件建构

    └─configuration
          ├── src
          │    ├─ heading.js
          │    ├─ index.js
          ├── index.html
          ├── package.json
          └── webpack.config.js   ......... webpack配置文件

详细代码参考[configuration](configuration)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack-快速上手</title>
  </head>
  <body>
    <script type="module" src="./src/index.js"></script>
  </body>
</html>
```

这里 `type="module"` 这种用法是 ES Modules 中提到的标准，用来区分加载的是一个普通的 js 脚本，还是一个模块

```shell
npm init --yes
npm i webpack webpack-cli --save-dev
```

webpack 是 webpack 的核心模块
webpack-cli 是 webpack 的 CLI 程序，用来命令行中调用 webpack

```shell
npx webpack --version
```

npx 是 npm 5.2 以后新增的一个命令，可以更方便的执行远程模块或项目 node_modules 中的 CLI 程序

```shell
npx webpack
```

在执行的过程中，webpack 默认会自动从`src/index.js`文件开始打包

> webpack4 以后的版本支持零配置方式直接启动打包
>
> 整个过程会按照约定将`src/index.js`作为打包入口
>
> 最终打包入口会存放到`dist/main.js`中

下面是 webpack 相关配置，不再进行过多赘述，详情可以参考 webpack 官网文档

```js
const path = require("path");
// 这里处于node环境遵循的是CommonJS规范
module.exports = {
  entry: "./src/index.js", //注意这里的./不能省略
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "output"),
  },
};
```

在这里`webpack.config.js`是运行在 node 环境中的，模块化规范使用 CommonJS 规范，也可以使用 node 内置模块

#### 配置文件添加智能提示

webpack 的配置项较多，很多选项支持不同类型的配置方式，特别是刚刚接触 webpack 的配置

下面的方式提供一种方式方便配置

```js
// 一定记得运行webpack前记得注释掉这里
import { Configuration } from "webpack";

/**
 *@type {Configuration}
 */

// 这里处于node环境遵循的是CommonJS规范
const config = {
  entry: "./src/index.js", //注意这里的./不能省略
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "output"),
  },
};

module.exports = config;
```

添加 import 语句，只是为了导入 webpack 配置对象的类型，目的是为了标注 config 对象的类型

最后一定记得运行 webpack 前记得注释掉这里，因为 import 引入的配置项不符合 node 环境模块化规范

#### webpack 工作模式

webpack 针对不同环境的三组预设配置：

- production 模式

  启动内置优化插件，自动优化打包结果，打包速度偏慢

- development 模式

  自动优化打包速度，添加一些调试过程中的辅助插件以便于更好的调试错误

- none 模式

  运行最原始的打包，不做任何处理，这种模式一般需要分析我们模块的打包结果时会用到

想要修改 webpack 的工作模式方式有两种：

- 通过 CLI--mode 参数掺入

- 通过配置文件中设置 mode 属性

#### 打包结果运行原理

推荐使用 mode 模式为 none，打包结果原理可见

[![bE4CHs.png](https://s4.ax1x.com/2022/02/25/bE4CHs.png)](https://imgtu.com/i/bE4CHs)

执行完打包后的文件，其实是一个立即执行函数（[IIFE](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)）

> VScode 中折叠的快捷键是 Ctrl+K,Ctrl+0 （macOS： Command+K，Command+0）方便快速折叠展示

[![bEHgMV.png](https://s4.ax1x.com/2022/02/25/bEHgMV.png)](https://imgtu.com/i/bEHgMV)

后面可以使用 debug 的方式，一步一步的走下去

> webpack 的基本使用并不复杂，特别是最新版本进行了配置简化，在这种不复杂的配置下，开发人员对他的掌握能力，主要体现在是否**能够理解工作机制和原理上面**

## loader 实现特殊资源的加载

详细代码参考[webpack-loader](webpack-loader)

webpack 不仅是 javascript 模块打包工具，还是整个前端项目（前端工程）的模块打包工具，可以**通过 webpack 去管理前端项目中的任意类型的资源文件**

单方面直接使用配置打包，特殊资源是不可取的。下图介绍了如何加载资源模块的

[![beZVzR.jpg](https://s4.ax1x.com/2022/02/26/beZVzR.jpg)](https://imgtu.com/i/beZVzR)

可见不同类型文件有不同类型的加载器：

我们可以通过 npm 先去安装这个 loader，到配置文件中添加对应的配置

```shell
$ npm install css-loader --save-dev

# or yarn add css-loader --dev
```

下面是 webpack.config.js 配置

```js
module.exports = {
  //样式文件路径
  entry: "./src/main.css",
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/, //根据打包过程中所遇到的文件路径匹配是否使用该loader
        use: ["style-loader", "css-loader"], //指具体的loader
      },
    ],
  },
};
```

下图大致介绍了加载器的使用过程
[![beZEW9.jpg](https://s4.ax1x.com/2022/02/26/beZEW9.jpg)](https://imgtu.com/i/beZEW9)

如果你尝试的页面中使用这里输出的 bundle.js 文件，会发现刚刚的这个 main.css 模块并没用工作，解决的方案只需要像上面一样添加一个 style-loader。

[![beKZbq.png](https://s4.ax1x.com/2022/02/26/beKZbq.png)](https://imgtu.com/i/beKZbq)

上面在只使用 css-loader 的时候，**css-loader 只会把打包遇到的 css 模块加载到 js 代码中，而并不会使用这个模块**

#### 通过 js 加载资源模块

[![beZAJJ.jpg](https://s4.ax1x.com/2022/02/26/beZAJJ.jpg)](https://imgtu.com/i/beZAJJ)
**为什么要在 js 中加载其他资源**

> 首先如果不在 js 中引入类似样式模块，图片文件之类的，就需要你单独将这些资源文件引入到 html 文件中，再通过 js 添加相应的逻辑代码，后期资源文件调整，就需要你去**同时维护 html 和 js 这两条线**了
>
> 遵循 webpack 的设计，所有资源加载都是由 js 控制，后期只需要维护 js 代码这一条线了
>
> 1.  逻辑上比较合理，因为 js 确实需要这些资源文件配合才能实现整体功能
> 2.  配合 webpack 这类的工具的打包，能确保在上线时，资源不会丢失，而且都是必要的
>
> 下面是常用的 loader，我就不单独进行讲述了，官方文档中都有讲述

- [file-loader](https://www.webpackjs.com/loaders/file-loader/)
- [url-loader](https://www.webpackjs.com/loaders/url-loader/)
- [babel-loader](https://www.webpackjs.com/loaders/babel-loader/)
- [style-loader](https://www.webpackjs.com/loaders/style-loader/)
- [eslint-loader](https://www.webpackjs.com/loaders/eslint-loader/)
- [css-loader](https://www.webpackjs.com/loaders/css-loader/)
- [sass-loader](https://www.webpackjs.com/loaders/sass-loader/)
- [postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)
- [vue-loader](https://www.webpackjs.com/loaders/vue-loader/)

#### 开发一个 loader

详细代码参考[md-loader](md-loader)

下面将手动开发一个解析 markdown 语法的 md-loader，下图是具体实现的原理

[![beZki4.jpg](https://s4.ax1x.com/2022/02/26/beZki4.jpg)](https://imgtu.com/i/beZki4)

- 添加 md 文件 loader 处理文件(markdown-loader.js)添加

```js
module.exports = (source) => {
  // 加载到的模块内容 => '#About\n\nthis is a makedown file.'
  console.log(source);
  // 返回值就是最终被打包内容
  return "hello loader";
};
```

- 将上面 loader 绑定 wepack 配置文件，处理 md 后缀文件

```js
module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
  },
  mode: "none",
  module: {
    rules: [
      {
        test: /.md$/,
        // 直接使用相对路径
        use: "./markdown-loader.js",
      },
    ],
  },
};
```

执行`npm run build`之后直接执行获取结果

[![bnGR74.png](https://s4.ax1x.com/2022/02/27/bnGR74.png)](https://imgtu.com/i/bnGR74)

> Any Source ==> loader1 ==> loader2 ==> loader3 ==> JavaScript Code
>
> 解决方法：
>
> - 直接在这个 loader 的最后返回一段 js 代码字符串
> - 再找一个合适的加载器，在后面接着处理我们得到的结果

上面报了个错，是因为我们自己编写的 loader return 返回的是 js 代码字符串，修改为`console.log("hello loader~")`,然后再次运行打包

```js
module.exports = (source) => {
  // 加载到的模块内容 => '#About\n\nthis is a makedown file.'
  console.log(source);
  // 返回值就是最终被打包内容
  return 'console.log("hello loader~")';
};
```

下图是打包后的结果：
[![bnUKJJ.png](https://s4.ax1x.com/2022/02/27/bnUKJJ.png)](https://imgtu.com/i/bnUKJJ)

> **实现 loader 逻辑**
>
> - 需要安装一个能够将 markdown 解析为 html 的模块 -- marked
> - 安装完成之后，在 markdown-loader.js 中导入
> - 使用这个模块解析 source

最后实现 loader，也很简单

```js
const marked = require("marked");

module.exports = (source) => {
  // 转换markdown语法为html
  const html = marked(source);
  // const code = `module.exports = ${JSON.stringify(html)}`
  const code = `export default ${JSON.stringify(html)}`;
  return code;
};
```

**多个 loader 配合使用**

我们现在可以更改 loader，只返回转义后的 html 文件字符串，再使用 html-loader 处理 html 文件，安装依赖，再将 webpack md 文件 loader ，将 use 属性更改为数组，依次引入多个 loader， **这里注意一点，loader 的加载顺序是从右向左执行处理的**

> 总结：
>
> loader 机制是 webpack 最核心的机制，正因为有 loader 机制，webpack 才能足以支持整个前端项目模块化的大梁，实现通过 webpack 去加载任何你想加载的资源

---

## plugin 插件机制

上一次讲的是 loader，这里当前主要目的是了解 plugin 插件机制如何横向扩展 webpack 的构建能力

> webpack 的插件机制其目的是为了增强 webpack 在项目自动化构建方面的能力

**插件最常见的应用场景：**

- 实现自动在打包之前清楚 dist 目录（上一次的打包能力）
- 自动生成应用所需要的 html 文件
- 根据不同环境为代码注入类似 api 地址这种可能变化的部分
- 拷贝不需要参与打包的资源文件到输出目录
- 压缩 webpack 打包完成后输出的文件
- 自动发布打包结果到服务器实现自动部署

### 体验插件机制

[体验插件机制](configuration)

> webpack 每次打包的结果直接覆盖到 dist 目录，**打包前，dist 目录中就有可能已经存入了一些在上次打包操作时遗留的文件**，再次打包，**只能覆盖同名的文件**。已经移除的资源文件就会一直累积，最终导致部署上线出现多余文件
>
> 这个合理 :joy_cat: 吗？ 显而易见不是河狸
>
> 所以，在每次完整打包之前，自动清理 dist 目录，每次打包后，dist 目录中就只会存在那些必要的文件

- 安装相应插件依赖

```shell
$ npm install html-webpack-plugin clean-webpack-plugin --save-dev
```

安装完成后会到配置文件，载入这个模块。 不同`clean-webpack-plugin`，`html-webpack-plugin`插件默认导出为插件类型，不需要结构内部成员

- webpack 配置文件引用

```js
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = {
  entry: "./src/index.js", //注意这里的./不能省略
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  mode: "none",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack plugins add",
      meta: {
        viewport: "width=device-width",
      },
    }),
  ],
};

module.exports = config;
```

对于生成的 html 文件，如果 title 需要修改，还有一些自定义 meta 标签和一些基础的 DOM 结构，可以对 htmlWebpackPlugin 进行添加配置

- 打包后结果

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>webpack plugins add</title>
    <meta name="viewport" content="width=device-width" />
    <script defer src="bundle.js"></script>
  </head>
  <body></body>
</html>
```

html-webpack-plugin 插件除了自定义输出文件内容，可以同时添加多个 html 文件。

```js
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: "webpack plugins add",
    meta: {
      viewport: "width=device-width",
    },
  }),
  new HtmlWebpackPlugin({
    filename: "about.html",
  }),
];
```

- 用于复制文件的插件

项目中一般还有些不需要参与构建的静态文件，最终也需要发布到线上，我们可以使用 copy-webpack-plugin

```js
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: "webpack plugins add",
    meta: {
      viewport: "width=device-width",
    },
  }),
  new HtmlWebpackPlugin({
    filename: "about.html",
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: path.join(__dirname, "public"), to: "public" }],
  }),
];
```

### 开发一个插件

详细代码参考[webpack-plugins](webpack-plugins)

插件机制

> 任务==>任务==>任务==>任务==>任务==>任务

插件的机制上是将一个任务一个任务作为钩子函数挂载到 webpack 上，下面将会开发一个 plugin 将打包后文件中存在的注释去除掉

> emit AsyncSeriesHook
>
> 这个钩子会在 webpack 即将向输出目录输出文件时执行

```js
// remove-webpack-plugin.js
lass RemoveCommentsPlugin{
  apply(compiler){
    console.log('RemoveCommentsPlugin')
    // compile 包含了这次构建的所有配置
    compiler.hooks.emit.tap('RemoveCommentsPlugin',compilation=>{
      // compilation 可以理解为此次打包的上下文
      for(const name in compilation.assets){
        console.log(name)//输出文件名称
      }
    })
  }
}
module.exports = RemoveCommentsPlugin;
```

```js
//webpack.config.js
const RemoveCommentsPlugin = require("./remove-comment-plugin.js");
module.exports = {
  //样式文件路径
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
  },
  mode: "none",
  module: {
    rules: [
      {
        test: /\.css$/, //根据打包过程中所遇到的文件路径匹配是否使用该loader
        use: ["style-loader", "css-loader"], //指具体的loader
      },
    ],
  },
  plugins: [new RemoveCommentsPlugin()],
};
```

打印出来的结果为

```js
RemoveCommentsPlugin;
bundle.js;
```

> **总结**
>
> - 简单了解几个非常常用的插件，一般都适用于任何类型的项目，不管你有没有使用框架，或者使用的是哪一个框架，基本上都能用到
> - 通过一个简单的插件开发过程，了解插件机制的工作原理
> - webpack 为每一个工作环节都预留了合适的钩子
> - 扩展时只需要找到合适的时机去做合适的事情

[webpack 自定义插件](https://webpack.docschina.org/contribute/writing-a-plugin/)

## webpack 运行机制和核心工作原理

[![bGfK1S.png](https://s4.ax1x.com/2022/03/02/bGfK1S.png)](https://imgtu.com/i/bGfK1S)

### 工作过程

webpack 在整个打包的过程中：

- 通过 loader 处理特殊类型资源的加载，例如加载样式、图片
- 通过 plugin 实现各种自动化的构建任务，例如自动压缩、自动发布

### 工作原理剖析

如果想了解 webpack 整个工作过程的细节，那就需要**更深入的了解刚刚说到的环节**，他们落实到代码层面上到底做了些什么，或者说如何实现的，**必须有针对的查阅 webpack 源码**

> **查阅源码的思路：**
>
> 1.  webpack CLI 启动打包流程
> 2.  载入 webpack 核心模块，创建 compiler 对象
> 3.  使用 compiler 对象开始编译整个项目
> 4.  从入口文件开始，解析模块依赖，形成依赖关系树
> 5.  递归依赖树，将每个模块交给对应的 loader 处理
> 6.  合并 loader 处理完的结果，将打包结果输出到 dist 目录

### webpack CLI

webpack CLI 作用是将 CLI 参数和 webpack 配置文件中的配置整合得到一个完整的配置对象。

webpack CLI 会通过 yargs 模块解析 CLI 参数（运行 webpack 命令时通过命令行传入的参数）

- webpack CLI 会通过 yargs 模块解析 CLI 参数（运行 webpack 命令时通过命令行传入参数）
- 通过调用 bin/utils/convert-argv.js 模块将得到的命令转换为 webpack 的配置选项对象
- 开始载入 webpack 核心模块，传入配置选项，创建 comiler 对象
  - 如果是监视模式就调用 compile 对象的 watch 方法，以监视模式启动构建但这不是主要关心的主线
  - 如果不是监视模式就调用 compiler 对象的 run 方法，开始构建整个应用
  - 具体文件在 webpack 模块下的 lib.compiler.js
- mark 阶段主体的目标
  - 根据 entry 配置找到入口模块，开始依次递归出所有依赖，形成依赖关系树，然后将递归到的每个 1 模块交给不同的 loader 处理
  - Tapable 注册方式
  - 默认使用的就是单一入口打包的方式，所以这里最终会执行其中的 SingleEntryPlugin

**make 阶段**

1. SingleEntryPlugin 中调用了 Compilation 对象的 addEntry 方法，开始解析入口
2. addEntry 方法中又调用了\_addModuleChain 方法，将入口模块添加到模块依赖列表中
3. 紧接着通过 Compilation 对象的 buildModule 方法进行模块构建
4. buildModule 方法中执行具体的 loader，处理特殊资源加载
5. build 完成过后，通过 acorn 库生成模块代码的 AST 语法树
6. 根据语法树分析这个模块是否还有依赖的模块，如果有则继续循环 build 每个依赖
7. 所有依赖解析完成，build 阶段结束
8. 最后合并生成需要输出的 bundle.js 写入 dist 目录

## 使用 DevServer 提高本地开发效率

> - 必须能够使用 HTTP 服务器运行而不是文件形式预览
> - 在我们修改完成代码之后，webpack 能够自动完成构建，然后浏览器可以即时显示最新的运行结果
> - 需要能提供 Source Map 支持。能够快速定位到源码中的位置

### webpack 自动编译

**watch 模式下**
webpack 完成初次构建过后，项目中的源文件会被监视，一旦发生任何改动，webpack 都会自动重新运行打包任务

**具体用法：**

启动 webpack 时，添加一个`--watch` 的 CLI 参数，webpack 就会以监视模式启动运行，在打包完成过后，CLI 不会立即退出，它会等待文件变化再次工作，直到我们手动结束它或是出现不可控的异常

```shell
# 可以先通过npm全局安装brower-sync模块，然后再使用这个模块
$ npm install browser-sync --global
$ browser-sync dist --watch

# 或者也可以使用npx直接使用远端模块
$ npx browser-sync dist --watch
```

这种 watch 模式+BrowserSync 虽然实现了我们的需求，但是这种方法有很多的弊端。

- 操作繁琐，我们需要同时使用两个工具，那就需要了解的内容就会更多，学习成本大大提高
- 效率低下，因为整个过程中，webpack 会将文件写盘中，BrowserSync 再进行读取过程中涉及大量磁盘读写操作，必然会导致效率低下

### Webpack Dev Server

是 webpack 官方推出的一款开发工具

它提供一个开发服务器

并且将自动编译和自动刷新浏览器等一系列对开发友好的功能全部集成在一起

推出初衷就是为了提高开发者日常开发效率，使用这个工具就可以解决我在开头提出的问题。

```shell
# 安装webpack-dev-server
$ npm install webpack-dev-server --save-dev
# 运行webpack-dev-server
$ npx webpack-dev-server
```

webpack-dev-server 相关流程：

webpack 构建 ==> 内存 ==>HTTP Server

```js
const path = require("path");
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
};
```

[更多配置](https://webpack.js.org/configuration/dev-server/#devserver)

### 静态资源访问

webpack-dev-server 默认会将构建结果和输出文件全部作为开发服务器的资源文件

只要通过 webpack 打包能够输出的文件都可以直接被访问到

但是如果还有一些没有参与打包的静态文件也需要作为开发服务器的资源访问

那就需要额外通过配置告诉 webpack-dev-server

相对应的配置是：

```js
module.exports = {
  devServer: {
    contentBase: "public",
  },
};
```

实际使用 webpack 时，一般都会把 copy-webpack-plugin 这种插件留在上线前，那一次打包中使用，而开发过程中一般不会使用它

### proxy 代理

在实际的生产环境中能够直接访问的 API，回到开发环境后，再次访问这些 API 就会产生跨域请求问题。

解决这种开发阶段跨域请求问题最好的办法，在开发服务器中配置一个后端 API 的代理服务，也就是把后端接口服务代理到本地开发服务地址

后端接口是： `https://api.github.com/users`

相关代理配置：

```js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://api.github.com",
      },
    },
  },
};
```

此时请求`http://localhost:8080/api/users`就相当于请求了`https://api.github.com/api/users`

添加一个 pathRewrite 属性来实现代理路径重写，重写规则就是把路径中开头的/api 替换掉

```js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://api.github.com",
        pathRewrite: {
          "^/api": "", //替换掉代理地址中的/api
        },
        changeOrigin: true, //确保请求github的主机名就是api.github.com
      },
    },
  },
};
```

`http://localhost:8080/api/users` ==> `https://api.github.com/users`

## sourceMap 配置

source --->source map ---> compiled

### 配置

常见的 map 转换的代码会有一个注释`//# sourceMappingURL=bundle.js.map`指向 map 文件

```js
module.exports = {
  devtool: "source-map",
};
```

下表是 devtool 取值之间的各种对比

|          devtool 取值          | 初次构建 | 重新构建 | 适合生产环境 |           品质           |
| :----------------------------: | :------: | :------: | :----------: | :----------------------: |
|             (none)             |   最快   |   最快   |      是      |            无            |
|              eval              |   最快   |   最快   |      否      |        转换后代码        |
|     cheap-eval-source-map      |    快    |   更快   |      否      | 转换后代码（只有行信息） |
|  cheap-module-eval-source-map  |    慢    |   更快   |      否      |    源码（只有行信息）    |
|        eval-source-map         |   最慢   |    慢    |      否      |        完整源代码        |
|        cheap-source-map        |    快    |    慢    |      是      | 转换后代码（只有行信息） |
|    cheap-module-source-map     |    慢    |   更慢   |      是      |   源代码（只有行信息）   |
|    inline-cheap-source-map     |    快    |    慢    |      否      | 转换后代码（只有行信息） |
| inline-cheap-module-source-map |    慢    |   更慢   |      否      |   源代码（只有行信息）   |
|           source-map           |   最慢   |   最慢   |      是      |        完整源代码        |
|       inline-source-map        |   最慢   |   最慢   |      否      |        完整源代码        |
|       hidden-source-map        |   最慢   |   最慢   |      是      |        完整源代码        |
|      nosources-source-map      |   最慢   |   最慢   |      是      | 无源码内容，只有行列信息 |

**Eval 模式**
eval 其实指的是 JavaScript 中的一个函数，可以用来运行字符串中的 JavaScript 代码

```js
const code = 'console.log("foo~")';
eval(code); //将code中的字符串作为js代码执行
```

查看更多源码部分[devtool-diff](devtool-diff)

**这里需要留意一下，进行就 js 出来的时候，安装 babel-loader 的时候，相对应的还需要安装@babel/core @babel/preset-env 进行处理**

1. 定义 devtool 属性，它就是当前所遍历的模式名称
2. 将 mode 设置为 none，确保 webpack 内部不做额外的处理
3. 设置打包入口及输出文件名称，打包输出文件名称以各个模式中的名称为主
4. 为 js 文件配置一个 babel-loader，主要目的是为了能够辨别其中一类模式的差异
5. 配置一个 html-webpack-plugin，也就是为每一个打包文件任务生成一个 html 文件，方便我们更好的观察各个模式之间的区别（可以在打包文件夹的地方起一个服务）

**js 文件添加 loader 配置的原因：**

因为这种名字中带 module 的模式，解析出来的源代码是没有经过 loader 处理过的，**而名字中不带 module 的模式，解析出来的源码是经过 loader 加工之后的结果** 也就是说如果我们想要一模一样的的源代码，就需要选择像 cheap-module-eval-source-map 之类带 module 的模式

### 不同模式对比

- inline-source-map

更普通的 source-map 效果相同，只不过这种模式下的 source-map 不是以物理文件存在，而是以 data urls 方式出现在代码中，我们之前遇到的 eval-source-map 也是这种 inline 的方式

- hidden-source-map

在这个模式下，我们在开发工具中看不到 source map 的效果，但是也确实生成 source map 文件，这就跟 jquery 一样，虽然生成了 map 文件，但是代码中没有引用对应的 source map 文件开发者依旧可以使用

- nosource-source-map

在这个模式下，我们看到错误出现的地方（包含行列位置），但是点进去却看不到源码，是为保护源码在生产环境不暴露

### 总结

**选择使用 cheap-module-eval-source-map 的原因：**

- 我们使用框架的情况可能比较多，以 react 和 vue 为例，无论是 JSX 还是 vue 单文件组件，loader 转换后差别都很大，我们需要调试 loader 转换前的源码
- 一般情况下，编写的代码一般每行不会超过 80 个字符，对于我们而言只需要找到哪一行，省略哪一列，还可以提高我们的构建速度
- 虽然在这种模式下启动打包会很慢，但是大多时间内使用 webpack-dev-server 都是监听模式下重新打包，所以重新打包的速度会很快

---

- source map 回暴露我的源代码到生产环境，如果没有控制 source map 文件访问权限的话，但凡有点技术的人很容易复原项目中的绝大数代码
- 调试应该是开发阶段的事情，你应该在开发阶段就尽可能找到所有问题及隐患，而不是到生产环境中再去全民公测。如果你对自己的代码没有信心，建议可以使用 nosource-source-map 模式
- source map 并不是 webpack 特有的功能，他们两者的关系只是： webpack 支持 source-map

## HMR 模块热替换机制

**自动刷新问题**

- 回到代码中先写死一个文本内容到编译器中，这样即便页面刷新，也不会丢失
- 通过代码将编译器中的内容及时保存到 localstorage 之类的地方，刷新过后再取回来

**模块热替换（HMR）**

全称 Hot Module Replacement，叫做模块热替换或者模块热更新

模块中提到的热和热拔插指的就是在运行过程中的即时变化

### 开启 HMR

HMR 已经集成在 webpack 模块中，所以**不需要再单独安装模块**

在运行 webpack-dev-server 命令时，通过`--hot`参数去开启这个特性

或者也可以配置文件中通过添加对应的配置来开启这个功能

这里需要配置两个地方：

- 需要将 devServer 对象中的 hot 属性设置为 true
- 需要载入一个插件，这个插件是 webpack 的内置插件，所以先导入 webpack 模块，有了这个模块过后，这里使用一个叫做 HotModuleReplacementPlugin 插件

```js
const webpack = require("webpack");
module.exports = {
  devServer: {
    hot: true,
    // 只使用HMR，不会fallback到live reloading
    // hotOnly： true
  },
  plugins: [
    // HMR特性所需要插件
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

### Q&A

> Q1: 可能你会问，为什么我们开启 HMR 过后，样式文件的修改就可以直接热更新呢？我们好像也没有手动处理样式模块更新？
>
> A1: 这是因为样式文件是经过 loader 处理的，在 style-loader 中就已经自动处理了样式文件的更新，所以就不需要我们额外手动去处理了

> Q2: 那你可能会想，凭什么样式可以自动处理，而我们的脚本就需要自己手动处理呢？
>
> A2: 这个原因也很简单，因为样式模块更新过后，只需要把更新后的 css 及时替换到页面中他就可以覆盖之前的样式，从而实现更新

> Q3: 那可能还有一段平时使用 vue-cli 或者 create-react-app 这种框架脚手架工具的人会说，“我的项目就没有手动处理，javascript 代码照样可以热替换，也没有你说的那么麻烦”
>
> A3: 这是因为你使用的是框架，使用框架开发时，我们项目中的每一个文件就有了规律，例如 react 中要求每一个模块导出的必须是一个函数或者类，那这样就可以有通用的替换方法，所以这些工具内部都已经帮你实现了通用的替换操作，自然就不需要手动处理了。

**HMR APIs**

```js
//.src/main.js
import crateEditor from "./editor";
import logo from "./icon.png";
import "./global.css";

const img = new Image();
img.src = logo;
document.body.appendChild(img);
const editor = createEditor();
document.body.appendChild(editor);
```

一旦这些模块更新了过后，在 main.js 中就必须重新使用更新后的模块

第一个参数就是 editor 模块路径，第二个参数则需要我们传入一个函数

```js
//./src/main.js
// ...原本的业务
module.hot.accept("./editor", () => {
  // 当./editor.js 更新，自动执行此函数
  console.log("editor 更新了");
});
```

HMR 处理

```js
//./src/main.js
import crateEditor from "./editor";
const editor = createEditor();
document.body.appendChild(editor);
// ...原本的业务
module.hot.accept("./editor", () => {
  document.body.removeChild(editor);
  const newEditor = createEditor();
  document.body.appendChild(newEditor);
});
```

热替换的状态保持

```js
let lastEditor = editor;
module.hot.accept("./editor", () => {
  // 临时记录更新前编译器内容
  const value = lastEditor.innerHTML;
  // 移除更新前的元素
  document.body.removeChild(lastEditor);
  // 创建新的编译器
  lastEditor = createEditor();
  // 还原编译器内容
  lastEditor.innerHTML = value;
  // 追加到页面
  document.body.appendChild(newEditor);
});
```

图片模块热替换

```js
//./src/main.js
import logo from "./icon.png";
// ...其他代码
if (module.hot) {
  //确保有HMR API 对象
  module.hot.accept("./icon.png", () => {
    img.src = logo;
  });
}
```

### 写在最后

你可能觉得 HMR 比较麻烦，需要写一些额外的代码，甚至觉得不如不用，但是个人觉得利大于弊

关于框架的 HMR，因为在大多数情况下是开箱即用的，所以这里不做过多的介绍，详情可以参考：

- [React HMR 方案](https://ahooks.js.org/zh-CN/guide/blog/hmr/)
- [Vue.js HMR 方案](https://vue-loader.vuejs.org/guide/hot-reload.html)

## webpack 高级特性及应对项目优化需求

### tree sharing

翻译即“摇树”，将没有用到的方法和变量，筛选掉

[tree-shaking](tree-shaking)

尝试使用 production 模式运行打包

```shell
$npx webpack --mode=none
```

这里打包后的结果去搜索 createElement 的时候只会发现只有一个

tree-shaking 并不是指 webpack 中的某一个配置选项，而是**一组功能搭配使用过后实现的效果**，这组功能在生产模式下都会自动启动，所以使用生产模式打包就有 tree-shaking 的效果

不开启任何内置功能和插件

```shell
$npx webpack --mode=none
```

这里即使没有使用的函数也会进行打包

```js
module.exports = {
  //.....
  optimization: {
    // 模块只导出被使用的成员，其他未使用的模块还会进行打包
    usedExports: true,
    // 压缩输出结果
    minimize: true,
  },
};
```

上面添加的配置为自动打开 tree-shaking 效果

webpack 的两个优化功能：

- userExports - 打包结果中只导出外部成员
- minimize - 压缩打包结果

如果把我们的代码看做一棵大树，那就可以这样理解

- userExports - 就是用来标记树上的枯树枝、枯树叶
- minimize - 、负责把枯树枝、枯树叶摇下来

### 合并模块

```js
module.exports = {
  //.....
  optimization: {
    // 模块只导出被使用的成员，其他未使用的模块还会进行打包
    usedExports: true,
    //尽可能合并每一个模块到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    minimize: false,
  },
};
```

下面是打包后的结果:

```js
/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  var __webpack_exports__ = {}; // CONCATENATED MODULE: ./src/components.js

  /*
   * @Author: pink
   * @Date: 2022-03-10 22:25:58
   * @LastEditors: pink
   * @LastEditTime: 2022-03-10 23:17:43
   * @Description: content
   */
  //components.js
  const Button = () => {
    return document.createElement("button");
    console.log("dead-code");
  };

  const Link = () => {
    return document.createElement("a");
  };

  const Heading = (level) => {
    return document.createElement("h" + level);
  }; // CONCATENATED MODULE: ./src/main.js
  /*
   * @Author: pink
   * @Date: 2022-03-10 22:48:51
   * @LastEditors: pink
   * @LastEditTime: 2022-03-10 23:21:18
   * @Description: content
   */

  // main.js
  document.body.appendChild(Button());
  /******/
})();
```

### babel-loader 问题

要明确一点： tree-sharking 实现的前提是 es modules ，就是说：最终交给 webpack 打包的代码，必须是使用 es modules 的方式来组织模块化的

> source --> babel-loader --> bundle

下面是引入 babel-loader 处理的 webpack 配置文件

```js
module.exports = {
  mode: "none",
  entry: "./src/main.js", //注意这里的./不能省略
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
          },
        },
      },
    ],
  },
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
  },
};
```

在 loader 源码中(源码位于@babel/preset-env 环境下的 src/index.js)

```js
supportsStaticESM: true,
supportsDynamicImport: true
```

这里标识当前环境支持 es modules

在使用`['@babel/preset-env',{modules: 'commonjs'}]`添加了 commonjs 后，之后打包的所有函数都会打包出去，相关比较可以亲自打包后进行对比

下面是打包后的文件，对比都会进行打包

```js
ar Button = function Button() {
  return document.createElement('button');
  console.log('dead-code');
};

exports.Button = Button;

var Link = function Link() {
  return document.createElement('a');
};

exports.Link = Link;

var Heading = function Heading(level) {
  return document.createElement('h' + level);
};

exports.Heading = Heading;
```

### sideEffects

查看全部代码：

[sideEffects](sideEffects)

> TIPS: 模块的副作用指的就是模块执行的时候除了导出成员，是否还做了其他事情

我们这里只进行简单的打包，在 webpack.config.js 中只添加了`sideEffect: true`配置，打包过后，未使用的模块代码，未进行导出操作，这里只导出了被使用的`Button`模块

下面我们在`package.json`文件中设置`sideEffect: false`

- webpack.config.js 中的 sideEffect 用来开启这功能
- package.json 中的 sideEffect 用来标识我们的代码没有副作用

sideEffects 特性，通过给 package.json 加入 sideEffects 声明该 包/模块 是否包含 sideEffects(副作用=> js 中引用不透明的代码，比如 objectzhongdegetter 和 setter 操作，webpack 打包时会进行保留)，从而可以为 tree-shaking 提供更大的优化空间

想使用 sideEffects，你的 webpack 的版本号要大于等于 4。那具体应该怎么用呢，如果你在写一个第三方的 npm 模块，sideEffects 支持下面两种写法：

```js
// package.json
{
    "sideEffects": false
}
// antd package.json
{
  "sideEffects": [
    "dist/*",
    "es/**/style/*",
    "lib/**/style/*"
  ]
}
```

webpack 中的两个高级特性

- tree-sharking
- sideEffects

### All in One 的弊端

webpack 实现前端项目整体模块化的优势固然重要，但是他也会存在一些弊端：**它最终会将我们所有的代码打包到一起**，如果应用非常复杂的话，模块非常多，那么 all in one 的打包方式会导致打包结果会很大。

所以这样的打包方式就不很合理，更为合理的方式是根据一定的规则分离到多个 bundle，然后根据应用的运行需要**按需加载，降低启动成本，提高响应速度**

web 应用中的资源受环境所限，**太大又不行，太碎也不行**，不将这些资源模块打包，，直接按照开发过程中互粉的模块颗粒度进行加载，那么运行一个小小的功能，就需要加载非常多的资源模块

目前主流的 HTTP1.1 本身就存在一些缺陷，比如：

- 同一个域名下的并行请求是有限制的
- 每次请求本身都会有一定延迟
- 每次请求除了传输内容，还有额外的请求头

打包后的资源，其实也是进行网络请求，大量的请求下，这些请求头加在一起也会浪费流量和带宽

**code splitting**

code splitting 通过把项目中的资源模块按照我们设计的规则打包到不同的 bundle 中。**降低应用的启动成本，提高响应速度**

webpack 实现分包的方式主要分为两种：

- 根据业务不同配置多个打包入口，输出多个打包结果
- 结合 ES Modules 的动态导入（Dynamic Imports）特性，按需加载模块

### 多入口打包

查看全部代码：

[multEntry](multEntry)

**提取公共模块**

多个入口打包存在一个小问题， 就是**不同的入口中一定会存在一些公共使用的模块**，如果按照目前这种多入口打包的方式，就会出现多个打包结果中有相同的模块的情况

webpack 提供了提取公共模块的配置

```js
optimization: {
  splitChunks: {
    chunks: 'all'//自动提取所有公共模块到单独的bundle
  }
},
```

**动态引入**

code splitting 更常见的实现方式还是结合 ES Modules 的动态导入特性，从而实现**按需加载**，这里的按需加载**指的是在应用运行过程中，需要某个资源模块时，才去加载这个模块**，极大地降低应用启动时需要加载的资源体积，提高了应用的响应速度，同时也节省了宽带和流量

查看全部代码：

[dynamic-import](dynamic-import)

**魔法注释**

```js
// 魔法注释
import(/* webpackChunkName: 'components' */ "./posts/posts").then(
  ({ default: posts }) => {
    mainElement.appendChild(posts());
  }
);
```

这个注释有一个特定的格式 `webpackChunkName: '<chunk-name>'`

> --END 完结撒花 :tada: :tada: :tada: --
>
> 从事开发工作就是，**不断“制造”问题，不断解决问题**

**相关参考**

- [md 官方文档](https://markdown.com.cn/)
- [webppack 官方文档](https://www.webpackjs.com/concepts/)
