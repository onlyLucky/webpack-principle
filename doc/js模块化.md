# js模块化(Module)

​		将一个复杂的程序，依据一定的规则(规范)封装成一个或多个块(文件), 并进行组合在一起（拆分细化每个功能元组，像搭建积木一样组合起来）；

​		块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信（只暴露相关使用方法）



---



## 发展历程

从**无模块时代**（引入各种js，又很多弊端，比如全局变量污染，js引入顺序，函数命名冲突)

**namespace模式**（引入命名空间，虽然减少了命名冲突的问题，但是数据不安全(外部可以直接修改模块内部的数据)，模块名称会暴露在全局，存在命名冲突，依赖顺序问题还是依旧存在）

```js
var myModule = {
	name:'tony',
	getName: function() {
		return this.name;
	}
}

//调用js
console.log(myModule.getName());
myModule.name = 'bob';
console.log(myModule.getName());
```

**自执行匿名函数（闭包）模式**  

```js
//模块js
(function (window) {
    let _name = 'tony';
    function setName(name) {
        _name = name;
    }
    function getName() {
        return _name;
    }
    window.moduleA = { setName, getName }
})(window)

//调用js
moduleA.setName('bob');
console.log(moduleA.getName());
console.log(moduleA._name);//模块不暴露，无法访问模块内属性方法
```

虽然解决了变量、方法全局隐藏，模块私有化，但是模块名称会暴露在全局，存在命名冲突，依赖顺序问题



## 模块化的规范



### CommonJS

- **每个文件都是一个模块实例**，代码运行在**模块作用域**，不会**污染全局作用域**。
- 文件内通过require对象引入指定模块，通过exports对象来向往暴漏API，**文件内定义的变量、函数，都是私有的**，对其他文件不可见。
- 每个模块加载一次之后就会被**缓存**。
- 所有文件加载均是**同步完成**，加载的顺序，按照其在代码中出现的顺序。(资源消耗和等待时间)
- 模块输出的是一个值的拷贝，模块内部的变化不会影响该值。(封闭性)

```js
//模块js
let _name = 'tony';
function setName(name) {
    _name = name;
}
function getName() {
    return _name ;
}
module.exports = { setName, getName }

//引入
let module = require( "./test" )
console.log(module.getName())
```





### AMD/RequireJS

​			采用**异步方式加载模块**，模块的加载不影响它后面语句的运行。**所有依赖这个模块的语句，都定义在一个回调函数中**，等到所有**依赖加载完成之后**（依赖前置），这个**回调函数才会运行**。

RequireJS是一个工具库，主要用于客户端的模块管理。它的模块管理遵守**AMD**规范，RequireJS的基本思想是，通过**define**方法将代码**定义为模块**，通过**require**方法实现代码的**模块加载**。

```js
//定义模块
define({
    color: "black",
    size: "unisize"
});

//定义函数

define(function () {
    return {
        color: "black",
        size: "unisize"
    }
});

//定义依赖模块
define(["./cart", "./inventory"], function(cart, inventory) {
        //return an object to define the "my/shirt"module.
        return {
            color: "blue",
            size: "large",
            addToCart: function() {
                inventory.decrement(this);
                cart.add(this);
            }
        }
    }
);

//文件目录
my/cart.js
my/inventory.js
my/shirt.js


<script src="scripts/require.js"></script>
<script>
  require.config({
    baseUrl: "/another/path",
    paths: {
        "some": "some/v1.0"
    },
    waitSeconds: 15
  });
  require( ["some/module", "my/module", "a.js", "b.js"],
    function(someModule,    myModule) {
        //This function will be called when all the dependencies
        //listed above are loaded. Note that this function could
        //be called before the page is loaded.
        //This callback is optional.
    }
  );
</script>
```



### CMD/SeaJS



CMD规范专门用于浏览器端，同样是受到Commonjs的启发，国内（阿里）诞生了一个CMD（Common Module Definition）规范。该规范借鉴了Commonjs的规范与AMD规范，在两者基础上做了改进。



其中SeaJs是CMD规范的实现，跟RequireJs类似，CMD是SeaJs推广过程中诞生的规范。CMD借鉴了很多AMD和Commonjs优点。

- **define定义模块，require加载模块，exports暴露变量。**
- 不同于AMD的依赖前置，**CMD推崇依赖就近（需要的时候再加载）**
- 推崇api**功能单一**，一个模块干一件事。

```js
//module.1
define(function (require, exports, module) {
  module.exports = {
    msg: 'I am module1'
  }
})
```



```js
//module.2
define(function (require, exports, module) {
	var module2 = require('./module1')
    function show() {
        console.log('同步引入依赖模块1 ' + module2.msg)
    }
    exports.showModule = show
})
```

```js
//main.js
define(function (require) {
  var m2 = require('./modules/module2')
  m2.showModule();
})
```

```html
//html中引入工具库，并定义js主文件
<script type="text/javascript" src="./libs/sea.js"></script>
<script type="text/javascript">
  seajs.use('./main')
</script>
```

**AMD、CMD区别**

- AMD 推崇依赖前置
- CMD 推崇依赖就近



```js
//AMD
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
	a.doSomething()
	...
	// 此处略去 100 行
	b.doSomething()
	...
})
```

```js
//CMD
define(function(require, exports, module) {
	var a = require('./a')
	a.doSomething()
	...
	// 此处略去 100 行
	var b = require('./b') // 依赖可以就近书写
	b.doSomething()
	...
}
```



### es6

2015年，ES6规范中，将模块化纳入JavaScript标准, 关键字有import，export，default，as，from。



```js
//模块js
let _name = 'tony';
function setName(name) {
    _name = name;
}
function getName() {
    return _name;
}
export { setName, getName }

/调用js
import { getName,setName } from './es6.module';
setName("bob");
console.log(getName());

```

**CommonJS和ES6区别**

- CommonJS 模块**输出的是一个值的拷贝**，即原来模块中的值改变不会影响已经加载的该值。
  ES6 模块输出的是**值的只读引用**，模块内值改变，引用也改变。
- CommonJS 模块是**运行时加载**，加载的是整个模块，即将**所有的接口全部加载进来**。
  ES6 模块是**编译时输出接口**，可以单独加载其中的某个接口。





## 总结
- **CommonJS规范主要用于服务端编程，加载模块是同步的，不适合在浏览器环境**，存在阻塞加载，浏览器资源是异步加载的，因此有了AMD、CMD解决方案。
- **AMD规范在浏览器环境中异步加载模块**，而且可以并行加载多个模块。
- CMD规范与AMD规范很相似，都**用于浏览器编程**，**依赖就近，代码更简单**。
- ES6 在语言标准的层面上，实现了模块功能，而且**实现得相当简单**，完全可以取代 CommonJS 和 AMD 规范，**成为浏览器和服务器通用的模块解决方案**。



## 参考链接

[RequireJS](https://www.requirejs-cn.cn/)

[SeaJS](https://seajs.github.io/seajs/docs/)