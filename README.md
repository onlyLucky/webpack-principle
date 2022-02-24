# webpack

> 对webpack打包工具的个人理解

## webpack 解决问题

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


**相关参考**

<!-- 拉钩-汪磊老师课程 -->

[md官方文档](https://markdown.com.cn/)