
<div align="center">
  <h1>你所不知道花式console.log</h1>
  <p style="text-indent:2em;text-align: left;">提到 `console.log` 每个前端开发人员都会表示，用它输出`hello world`比较方便，但是真的的确如你所见，它仅仅是你看到的那么简单的家伙吗？这篇文章将带你走进console.log的心里，认识到它五彩斑斓的内心。</p>
</div>


## 花式输出



这是一个心心念念的一个hello world,请记住他原来的样子。

```js
console.log('hello world')
```
<p style="text-indent:2em;text-align: left;">这里提前剧透一下，在log方法里面可以使用printf风格的占位符，像%s，%d，%i，%f，%o，%c这些,不过里面使用的占位符种类比较少，对了像下面的info、error、warn、debug输出信息的方法同样可以适用占位符，那我们接着看下去吧</p>

```js
console.log("%chello world","color: red");
```
`%c`是一个样式的占位符，这里把我们即将输出的一个带有红色的`hello world`

就像这个样子 <p style="color:red;">hello world</p>

---

所以我们可以使用这个占用符自定义一些样式，理论存在，那我们可以开始实践。

```js
console.log(`Powered by %cwebpack-principle%c\nGitHub: https://github.com/onlyLucky/webpack-principle`,
"background-color: #0078FF;padding: 7px; color:#fff;margin: 10px 0px;",
""
)

```
[![q1uBX4.jpg](https://s1.ax1x.com/2022/03/23/q1uBX4.jpg)](https://imgtu.com/i/q1uBX4)


`%c`实则就是相对位置从开始的`%c`到下一个位置的`%c`的文字填充样式
1

后面为大家准备了个练手案例，快来试试吧

[![q1dSAK.png](https://s1.ax1x.com/2022/03/23/q1dSAK.png)](https://imgtu.com/i/q1dSAK)


### 其他占位符

- 字符（%s）
- 整数（%d或%i）
- 浮点数（%f）
- 对象（%o）

```js
console.log("%d年%d月%d日",2011,3,26);
console.log("圆周率是%f",3.1415926);
var animate = {};
animate.name = "dog";
animate.type = "big";
console.log("%o", animate);
```


## 常见其他的API

1. console.table 将数据以表格的形式显示

    ```js
    // 打印一个由字符串组成的数组

    console.table(["apples", "oranges", "bananas"]);
    ```

2. console.info 用于输出提示性信息
3. console.error用于输出错误信息
4. console.warn用于输出警示信息
5. console.debug用于输出调试信息 

    目前chrome浏览器不支持使用

    ```js
    console.log('log')
    console.info('info')
    console.error('error')
    console.warn('warn')
    ```
    [![qlxx8P.jpg](https://s1.ax1x.com/2022/03/23/qlxx8P.jpg)](https://imgtu.com/i/qlxx8P)

6. console.dir 在控制台中显示指定JavaScript对象的属性，并通过类似文件树样式的交互列表显示。

    ```js
    console.dir(object);//打印出该对象的所有属性和属性值.
    ```
    [![q1pEcV.png](https://s1.ax1x.com/2022/03/23/q1pEcV.png)](https://imgtu.com/i/q1pEcV)
相关参考：

[MDN console](https://developer.mozilla.org/zh-CN/docs/Web/API/console)
