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

1. [webpack解决问题](#webpack解决问题)
2. [使用webpack实现模块化打包](#使用webpack实现模块化打包)
3. [loader实现特殊资源的加载](#loader实现特殊资源的加载)
4. [plugin插件机制](#plugin插件机制)



## webpack解决问题

如何在前端项目中更高效的管理和维护项目中的每一个资源，想要理解webpack，就要先对它想要解决的问题或者目标有一个充分认识

webpack的产生是由前端模块化演化进程相关的，下面会介绍前端模块化的过程

### 模块化过程

[js模块化详细文档](doc/js模块化.md)

> 早期的前端技术标准根本没有预料到前端行业会有今天这个规模，所以在设计上存在很多缺陷

1. 文件划分方式

[![bPU6PO.png](https://s4.ax1x.com/2022/02/23/bPU6PO.png)](https://imgtu.com/i/bPU6PO)

这种相对简单粗暴的文件划分，只是简单的解决了模块划分，但是同时还是带来了很多问题

> **缺点：**
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
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="module-a.js"></script>
  <script src="module-b.js"></script>
  <script>
    moduleA.method1()
    moduleB.method1()
    // 模块成员依旧可以修改
    moduleB.data = 'foo'
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

4. IIFE依赖参数

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

更为理想的方式是在页面中引入一个JS入口文件，其余用到的模块可以通过代码控制，能够按需加载，随之后面就出现了模块化规范

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

#### CommonJS规范

是nodejs中所遵循的模块规范

该规范约定一个文件就是一个模块，每个模块都有单独的作用域，通过module。exports导出成员，在通过require函数载入模块


早期制定前端模块化标准时，并没有直接选择CommonJS规范，而是选择专门为浏览器端重新设计了一个规范`AMD`，即异步模块定义规范，同期推出`Require.js`,除了实现AMD模块化规范，本身也是一个非常强大的模块加载器

随着前端模块化标准日渐完善，ES6推出了ES Modules规范

前端模块化规范最佳实践方式也基本实现统一
- 在node环境中，遵循CommonJS规范
- 在浏览器环境中，遵循ES Modules规范


#### ES Modules

随着webpack等一系列打包工具的流行，这一个规范开始逐渐被普及，经过多年的迭代，ES Modules已发展成为现今最主流的前端模块化标准

下面是ES Modules参考链接，本身特性就不多做赘述了，也可以参考上面提供的文档：

- [MDN ES Module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)



### 模块打包工具

为什么会出现模块打包工具

- 我们所使用的 ES Modules模块本身就**存在环境兼容问题**，尽管主流浏览器最新版本都支持这一特性，但是你无法确保用户的浏览器版本
- 模块化的方式划分出来的模块文件过多，但是前段应用又运行在浏览器中，每个文件都需要发送请求，**频繁发送网络请求，影响应用工作效率**
- 前端应用日益复杂，不仅仅只用JavaScript代码需要模块化，html和css等这些**资源文件也有模块化问题**

[![biuk80.png](https://s4.ax1x.com/2022/02/24/biuk80.png)](https://imgtu.com/i/biuk80)

> 前端模块化进程，是我们深入学习webpack前必须要掌握的内容，也是前端开发者必不可少的基础储备
>
>webpack 从一个打包工具，发展成为前端项目构建系统，虽然表面上只是发生了名称上的变化，但是背后透露出来的是：模块化思想的伟大，可以帮助你统治前端整个项目


## 使用webpack实现模块化打包

- 能够将散落的模块打包在一起
- 能够编译代码中的新特性
- 能够支持不同种类的前端资源模块

其中最主流的就是webpack、parcel、和rollup


下面以webpack为例：

- webpack作为一个模块打包工具，本身就可以实现模块化代码打包问题，通过webpack可以将零散的js代码打包到一个js文件中
- 对于有环境兼容问题的代码。webpack可以在打包过程中通过loader机制对其实现编译转换，然后在进行打包
- 对于不同类型的前端模块，webpack支持在js中以模块化的方式载入任意类型的资源文件
- 具备代码拆分的能力，能够将应用中心所有的模块按需进行分包，去除了单个文件过大，导致加载慢的问题


### webpack快速上手

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
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack-快速上手</title>
</head>
<body>
  <script type="module" src="./src/index.js"></script>
</body>
</html>
```
这里 `type="module"` 这种用法是ES Modules中提到的标准，用来区分加载的是一个普通的js脚本，还是一个模块


```shell
npm init --yes
npm i webpack webpack-cli --save-dev
```
webpack 是webpack的核心模块
webpack-cli 是webpack的CLI程序，用来命令行中调用webpack

```shell
npx webpack --version
```
npx 是npm 5.2 以后新增的一个命令，可以更方便的执行远程模块或项目node_modules中的CLI程序


```shell
npx webpack
```
在执行的过程中，webpack默认会自动从`src/index.js`文件开始打包

> webpack4以后的版本支持零配置方式直接启动打包
>
> 整个过程会按照约定将`src/index.js`作为打包入口
>
>最终打包入口会存放到`dist/main.js`中

下面是webpack相关配置，不再进行过多赘述，详情可以参考webpack官网文档
```js
const path = require('path')
// 这里处于node环境遵循的是CommonJS规范
module.exports = {
  entry: './src/index.js', //注意这里的./不能省略
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'output')
  }
}
```
在这里`webpack.config.js`是运行在node环境中的，模块化规范使用CommonJS规范，也可以使用node内置模块

#### 配置文件添加智能提示

webpack的配置项较多，很多选项支持不同类型的配置方式，特别是刚刚接触webpack的配置

下面的方式提供一种方式方便配置
```js
// 一定记得运行webpack前记得注释掉这里
import {Configuration} from 'webpack'

/** 
*@type {Configuration} 
*/

// 这里处于node环境遵循的是CommonJS规范
const config = {
  entry: './src/index.js', //注意这里的./不能省略
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'output')
  }
}

module.exports = config
```
添加import语句，只是为了导入webpack配置对象的类型，目的是为了标注config对象的类型

最后一定记得运行webpack前记得注释掉这里，因为import引入的配置项不符合node环境模块化规范

#### webpack工作模式

webpack 针对不同环境的三组预设配置：

- production模式

  启动内置优化插件，自动优化打包结果，打包速度偏慢

- development 模式

  自动优化打包速度，添加一些调试过程中的辅助插件以便于更好的调试错误

- none模式

  运行最原始的打包，不做任何处理，这种模式一般需要分析我们模块的打包结果时会用到

想要修改webpack的工作模式方式有两种：

- 通过CLI--mode 参数掺入

- 通过配置文件中设置mode属性

#### 打包结果运行原理

推荐使用mode模式为none，打包结果原理可见

[![bE4CHs.png](https://s4.ax1x.com/2022/02/25/bE4CHs.png)](https://imgtu.com/i/bE4CHs)

执行完打包后的文件，其实是一个立即执行函数（[IIFE](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)）

> VScode 中折叠的快捷键是Ctrl+K,Ctrl+0  （macOS： Command+K，Command+0）方便快速折叠展示

[![bEHgMV.png](https://s4.ax1x.com/2022/02/25/bEHgMV.png)](https://imgtu.com/i/bEHgMV)

后面可以使用debug的方式，一步一步的走下去

> webpack的基本使用并不复杂，特别是最新版本进行了配置简化，在这种不复杂的配置下，开发人员对他的掌握能力，主要体现在是否**能够理解工作机制和原理上面**

## loader实现特殊资源的加载

详细代码参考[webpack-loader](webpack-loader)

webpack 不仅是javascript模块打包工具，还是整个前端项目（前端工程）的模块打包工具，可以**通过webpack去管理前端项目中的任意类型的资源文件**

单方面直接使用配置打包，特殊资源是不可取的。下图介绍了如何加载资源模块的

[![beZVzR.jpg](https://s4.ax1x.com/2022/02/26/beZVzR.jpg)](https://imgtu.com/i/beZVzR)

可见不同类型文件有不同类型的加载器：

我们可以通过npm先去安装这个loader，到配置文件中添加对应的配置
```shell
$ npm install css-loader --save-dev

# or yarn add css-loader --dev
```
下面是webpack.config.js配置
```js
module.exports = {
  //样式文件路径
  entry: './src/main.css',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.css$/,//根据打包过程中所遇到的文件路径匹配是否使用该loader
        use: ['style-loader','css-loader'],//指具体的loader
      }
    ]
  }
}
```
下图大致介绍了加载器的使用过程
[![beZEW9.jpg](https://s4.ax1x.com/2022/02/26/beZEW9.jpg)](https://imgtu.com/i/beZEW9)

如果你尝试的页面中使用这里输出的bundle.js文件，会发现刚刚的这个main.css模块并没用工作，解决的方案只需要像上面一样添加一个style-loader。

[![beKZbq.png](https://s4.ax1x.com/2022/02/26/beKZbq.png)](https://imgtu.com/i/beKZbq)

上面在只使用css-loader的时候，**css-loader只会把打包遇到的css模块加载到js代码中，而并不会使用这个模块**


#### 通过js加载资源模块
[![beZAJJ.jpg](https://s4.ax1x.com/2022/02/26/beZAJJ.jpg)](https://imgtu.com/i/beZAJJ)
**为什么要在js中加载其他资源**
>首先如果不在js中引入类似样式模块，图片文件之类的，就需要你单独将这些资源文件引入到html文件中，再通过js添加相应的逻辑代码，后期资源文件调整，就需要你去**同时维护html和js这两条线**了
>
>遵循webpack的设计，所有资源加载都是由js控制，后期只需要维护js代码这一条线了
>
>1. 逻辑上比较合理，因为js确实需要这些资源文件配合才能实现整体功能
>2. 配合webpack这类的工具的打包，能确保在上线时，资源不会丢失，而且都是必要的
>
下面是常用的loader，我就不单独进行讲述了，官方文档中都有讲述

- [file-loader](https://www.webpackjs.com/loaders/file-loader/)
- [url-loader](https://www.webpackjs.com/loaders/url-loader/)
- [babel-loader](https://www.webpackjs.com/loaders/babel-loader/)
- [style-loader](https://www.webpackjs.com/loaders/style-loader/)
- [eslint-loader](https://www.webpackjs.com/loaders/eslint-loader/)
- [css-loader](https://www.webpackjs.com/loaders/css-loader/)
- [sass-loader](https://www.webpackjs.com/loaders/sass-loader/)
- [postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)
- [vue-loader](https://www.webpackjs.com/loaders/vue-loader/)


#### 开发一个loader

详细代码参考[md-loader](md-loader)

下面将手动开发一个解析markdown语法的md-loader，下图是具体实现的原理

[![beZki4.jpg](https://s4.ax1x.com/2022/02/26/beZki4.jpg)](https://imgtu.com/i/beZki4)

- 添加md文件loader处理文件(markdown-loader.js)添加

```js
module.exports = source => {
  // 加载到的模块内容 => '#About\n\nthis is a makedown file.'
  console.log(source)
  // 返回值就是最终被打包内容
  return 'hello loader'
}
```
- 将上面loader绑定wepack配置文件，处理md后缀文件

```js
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /.md$/,
        // 直接使用相对路径
        use: './markdown-loader.js'
      }
    ]
  }
}
```
执行`npm run build`之后直接执行获取结果

[![bnGR74.png](https://s4.ax1x.com/2022/02/27/bnGR74.png)](https://imgtu.com/i/bnGR74)

> Any Source ==> loader1 ==> loader2 ==> loader3 ==> JavaScript Code
>
> 解决方法：
>- 直接在这个loader的最后返回一段js代码字符串
>- 再找一个合适的加载器，在后面接着处理我们得到的结果

上面报了个错，是因为我们自己编写的loader return 返回的是js代码字符串，修改为`console.log("hello loader~")`,然后再次运行打包

```js
module.exports = source => {
  // 加载到的模块内容 => '#About\n\nthis is a makedown file.'
  console.log(source)
  // 返回值就是最终被打包内容
  return 'console.log("hello loader~")'
}
```
下图是打包后的结果：
[![bnUKJJ.png](https://s4.ax1x.com/2022/02/27/bnUKJJ.png)](https://imgtu.com/i/bnUKJJ)

> **实现loader逻辑**
> - 需要安装一个能够将markdown解析为html的模块 -- marked
> - 安装完成之后，在markdown-loader.js中导入
> - 使用这个模块解析source

最后实现loader，也很简单
```js
const marked = require('marked')

module.exports = source => {
  // 转换markdown语法为html
  const html = marked(source)
  // const code = `module.exports = ${JSON.stringify(html)}`
  const code = `export default ${JSON.stringify(html)}`
  return code
}
```

**多个loader配合使用**

我们现在可以更改loader，只返回转义后的html文件字符串，再使用html-loader处理html文件，安装依赖，再将webpack md 文件loader ，将use属性更改为数组，依次引入多个loader， **这里注意一点，loader的加载顺序是从右向左执行处理的**

> 总结：
>
>loader机制是webpack最核心的机制，正因为有loader机制，webpack才能足以支持整个前端项目模块化的大梁，实现通过webpack去加载任何你想加载的资源

---
## plugin插件机制

上一次讲的是loader，这里当前主要目的是了解plugin插件机制如何横向扩展webpack的构建能力

> webpack的插件机制其目的是为了增强webpack在项目自动化构建方面的能力

**插件最常见的应用场景：**
  - 实现自动在打包之前清楚dist目录（上一次的打包能力）
  - 自动生成应用所需要的html文件
  - 根据不同环境为代码注入类似api地址这种可能变化的部分
  - 拷贝不需要参与打包的资源文件到输出目录
  - 压缩webpack打包完成后输出的文件
  - 自动发布打包结果到服务器实现自动部署


### 体验插件机制

> webpack 每次打包的结果直接覆盖到dist目录，**打包前，dist目录中就有可能已经存入了一些在上次打包操作时遗留的文件**，再次打包，**只能覆盖同名的文件**。已经移除的资源文件就会一直累积，最终导致部署上线出现多余文件
>
> 这个合理 :joy_cat: 吗？ 显而易见不是河狸
>
> 所以，在每次完整打包之前，自动清理dist目录，每次打包后，dist目录中就只会存在那些必要的文件


- 安装相应插件依赖

```shell
$ npm install html-webpack-plugin clean-webpack-plugin --save-dev
```
安装完成后会到配置文件，载入这个模块。 不同`clean-webpack-plugin`，`html-webpack-plugin`插件默认导出为插件类型，不需要结构内部成员

- webpack配置文件引用

```js
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const config = {
  entry: './src/index.js', //注意这里的./不能省略
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'dist')
  },
  mode: 'none',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack plugins add',
      meta: {
        viewport: 'width=device-width'
      }
    })
  ]
}

module.exports = config
```
对于生成的html文件，如果title需要修改，还有一些自定义meta标签和一些基础的DOM结构，可以对htmlWebpackPlugin进行添加配置

- 打包后结果
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>webpack plugins add</title>
  <meta name="viewport" content="width=device-width"><script defer src="bundle.js"></script></head>
  <body>
  </body>
</html>
```

html-webpack-plugin插件除了自定义输出文件内容，可以同时添加多个html文件。
```js
plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack plugins add',
      meta: {
        viewport: 'width=device-width'
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html'
    })
  ]
```

- 用于复制文件的插件

项目中一般还有些不需要参与构建的静态文件，最终也需要发布到线上，我们可以使用copy-webpack-plugin

```js
plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack plugins add',
      meta: {
        viewport: 'width=device-width'
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname,'public'),to: 'public'}
      ],
    })
  ]
```

















**相关参考**

<!-- 拉钩-汪磊老师课程 -->

- [md官方文档](https://markdown.com.cn/)
- [webppack官方文档](https://www.webpackjs.com/concepts/)