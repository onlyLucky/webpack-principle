<div align="center">
  <h1>less</h1>
  <p>less,简单使用部分实践，主要为了减少样式代码的重复编码</p>
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

1. [基本使用](#基本使用)
2. [less 内置函数](#less内置函数)
3. [进阶使用](#进阶使用)

> 基础目标：
>
> 1.  基础语法使用
> 2.  日常生产中减少重复代码，灵活使用
> 3.  提取公共样式代码库
> 4.  适应 eslint 代码格式

## 基本使用

Less 仅对 CSS 语言增加了少许方便的扩展

详细代码参考： [base](../less-use/base/)

- [变量（Variables）](../less-use/base/style/variables.less)
- [混合（Mixins）](../less-use/base/style/mixins.less)
- [嵌套（Nesting）](../less-use/base/style/nesting.less)
- [运算（Operations）](../less-use/base/style/operations.less)
- [转义（Escaping）](../less-use/base/style/escaping.less)
- [函数（Functions）](../less-use/base/style/function.less)
- [命名空间和访问符](../less-use/base/style/namespace.less)
- [映射（Maps）](../less-use/base/style/maps.less)
- [作用域（Scope）](../less-use/base/style/scope.less)
- [注释（Comments）](../less-use/base/style/comments.less)
- [导入（Importing）](../less-use/base/style/importing.less)

## less 内置函数

less 基本的内置操作函数的使用

- [逻辑判断（Logical Functions）](../less-use/function/style/logical.less)
- [字符串操作（String Functions）](../less-use/function/style/string.less)
- [列表数组（List Functions）](../less-use/function/style/list.less)
- [数学操作（Math Functions）](../less-use/function/style/math.less)
- [类型判断（Type Functions）](../less-use/function/style/type.less)
- [其他函数（Misc Functions）](../less-use/function/style/misc.less)
- [颜色定义（Color Definition）](../less-use/function/style/color-definition.less)
- [颜色通道（Color Channel ）](../less-use/function/style/color-channel.less)
- [颜色操作（Color Operation ）](../less-use/function/style/color-operation.less)

## 进阶使用

- Import

  导入样式可以使用 不带 less 后缀

  **Options**

  `@import (keyword) "filename";`

  下面是使用一些参数进行操作

  - reference: 使用 less 文件但不导出
  - inline: 在输出中包含源文件，但不进行编译
  - less: 不管文件扩展名是什么，都要将文件视为 Less 文件
  - css: 不管文件扩展名是什么，都要将文件视为 css 文件
  - once: 只引入一次（默认）
  - multiple: 多次引入文件
  - optional: 找不到文件会进行继续编译

- Plugin

  引入 javascript 插件用来扩展 less 的属性和特性

  使用`@plugin`类似于在 less 文件中使用`@import`

  **my-plugin.js**

  ```js
  registerPlugin({
    install: function (less, pluginManager, functions) {
      functions.add("pi", function () {
        return Math.PI;
      });
    },
  });
  ```

  可以使用以上的方式引入，在 less 中使用 pi()去调用，也可以使用以下方式编写 plugin

  ```js
  module.exports = {
    install: function (less, pluginManager, functions) {
      functions.add("pi", function () {
        return Math.PI;
      });
    },
  };
  ```

  内部可以注册多个插件函数，我们可以在 less 函数中引入多个 plugin，每个 plugin 在不同的函数中，有不同的作用域，引入之后作用域也会有所不一样

  - 如果你不想返回一个输出的话只是用来处理逻辑，只需要你`return false`

  - less plugin 除了 install 还有其他操作项

    ```js
    {
      /* 插件文件被调用之后会被立即执行  初次引入，只加载一次 */
      install: function(less, pluginManager, functions) { },
      /* 为@plugin的每一个实例调用 */
      use: function(context) { },
      /* 为@plugin的每一个实例调用,当规则被计算求值得时候，会进行这个计算求值得生命周期*/
      eval: function(context) { },

      /* Passes an arbitrary string to your plugin
      * e.g. @plugin (args) "file";
      * This string is not parsed for you,
      * so it can contain (almost) anything */
      setOptions: function(argumentString) { },

      /* Set a minimum Less compatibility string
      * You can also use an array, as in [3, 0] */
      minVersion: ['3.0'],

      /* Used for lessc only, to explain
      * options in a Terminal */
      printUsage: function() { },

    }
    ```
