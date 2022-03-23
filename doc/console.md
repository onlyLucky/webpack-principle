
<div align="center">
  <h1>你所不知道花式console.log</h1>
  <p style="text-indent:2em;text-align: left;">提到 `console.log` 每个前端开发人员都会表示，用它输出`hello world`比较方便，但是真的的确如你所见，它仅仅是你看到的那么简单的家伙吗？这篇文章将带你走进console.log的心里，认识到它五彩斑斓的内心。</p>
</div>


## 花式输出






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
