// “ES5只有两种声明变量的方法：var命令和function命令。ES6除了添加let和const命令，后面章节还会提到，另外两种声明变量的方法：import命令和class命令。所以，ES6一共有6种声明变量的方法。”

// var  pk  let .

// ********************************************************************************************************************************************************************************************************


// 1. 级块作用
    //  a): let声明的变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6。
// var声明的变量则因为全局有效每次都会被覆盖
var a = [], j;
for (let i = j = 0; i < 10; i++, j++) {
  a[i] = function () {
    console.log(i, j);
  };
}
a[6]();   // 6  10

    //  b): 暂时性死区: 实际上这个问题和上面是一致的, 高级语言的作用域通常以{}为起始和结束的标志. 脚本语言通常没有级块这个概念.但javascript为了贴近高级语言的语法,在形式上支持了这种写法,但是他的作用域还是和大多数脚本语言类似,
// 只有特殊的几种语法现象才能产生作用域. 比如 eval, global, function . 但不包括 if/ for /while 等
// let 是一个支持级块的变量声明语法. let 声明的变量支持级块
// 支持级块的原因可以认为是: es6 提供了以{}为作用域边界的作用域规则.
var tmp = 123;
if(true){
    // tmp = 10; //  ReferenceError: tmp is not defined
    let tmp;
}

    // C): {}作为作用域的边界
// 可以套用函数级块初始化时的变量初始化规则: 首先获取几块内部所有的变量声明, 缀加到一个类似活动对象/变量对象的对象上(一定是存在变量提升的, 否则在 let 之前输出 c 不会报错. 但是 let 和 var 的变量提升存在区别. var 的变量提升了是可以被访问的.),
// 上述是现象, “ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。甚至对其类型判断都会出错. typeof 已经不是一个绝对安全的操作了.”
// 这就是有的人说的暂时性死区.
// 用 let 定义的变量的作用域是定义它们的块内，以及包含在这个块中的子块 ，这一点有点象var,只是var 定义的变量的作用域是定义它们的函数内. var 和 let 声明的变量拥有不同的处理规则.
// mozilla官方解释: In ECMAScript 2015, let will hoist the variable to the top of the block. However, referencing the variable in the block before the variable declaration results in a ReferenceError.
// 说不存在不存在变量提升的,都是不经思考的说法.
{
    let c = 10;
    {
        // console.log(typeof c); // ReferenceError: c is not defined
        let c = 10;
    }
    console.log(c);  // 10
}
// console.log(c); // ReferenceError: c is not defined

    // d): 另一些佐证:
// switch 中仅有一个作用域
switch (tmp) {
  case 0:
    let foo;
    break;

  case 1:
    // let foo; // TypeError for redeclaration. : Duplicate declaration "foo"
    break;
}
// for 是比较特殊的, 循环体中是可以引用在for申明时用let定义的变量，尽管let不是出现在大括号之间.
for(let i = 0; i < 10; i ++){
    console.log(i, ' > ');
}
// ********************************************************************************************************************************************************************************************************


// 2. 变量提升
// var : 提升
// let : 不提升
console.log(foo); // 输出undefined
// console.log(bar); // 报错 ReferenceError: bar is not defined

var foo = 2;
let bar = 2;


// 3. 不允许重复声明.
    //  其实这点没什么好提的, es 越加规范导致去解决历史遗留的很多问题. 比如多次声明. 在提供了 let 之后,我们发现js 本身的实现上出了很多改变. 比如函数的参数.
(function (arg) {
    // let arg;        // Duplicate declaration "arg"
})();


// 4. 改变
    // a): 一些滑稽的错误得意修正, 如下由于 js 没有级块作用域, 导致 if 快中的变量声明总被提升到函数的活动对象中.尽管这个 if 块存在逻辑判断.但是并没有什么卵用.级块中声明函数更是坑.
var tmp = new Date();
function f() {
    console.log(tmp);
    if (false) {
        var tmp = "hello world";
    }
}

f(); // undefined”

    // b): “块级作用域的出现，实际上使得获得广泛应用的立即执行匿名函数（IIFE）不再必要了”
// IIFE写法
(function () {
  var tmp = '...';
  // ...
}());

// 块级作用域写法
{
  let tmp = '...';
  // ...
}

    // c): 函数同样拥有级块的特性,真是大快人心. 实际上可以认为是任何以{}为边界的代码块都拥有了自己的变量对象, 函数,变量都遵循这一特性. 其实函数也是一个特殊的变量赋值语法.
// 当函数不进入某个代码快, 就不回去初始化这个块内部的所有成员.
// 看如下代码你会不会想过到底是级块扩充了作用域还是, 还是函数声明沿袭了 let 的规则呢?
if(false){
    function fun() {return 'f function '}
}
// fun();      // TypeError: fun is not a function
console.log(fun);  // undefined

    // d): TODO 实际上这块的处理规则还真是琢磨不透, 比如声明两个同名函数实际上没有问题, 但是函数和变量声明就会: Duplicate declaration "t" . 还真是看不太明白. 待研究.
// 实际上使用严格模式函数也是不能多次声明的, 非严格模式为了兼容一种情况并没有将函数let 化.
// 实际上 let 和 var 声明方式还存在一种区别: 在全局情况下.let 声明的变量是不属于全局对象的. 但原本的模式下 var 和 function 都有这样的特性, 并且为了兼容过度依旧保留
{
    function g () {}
    // function g () {}

    // let t ;
    function t () {}
}


// 5. “ES5的严格模式规定，函数只能在顶层作用域和函数内声明，其他情况（比如if代码块、循环代码块）的声明都会报错。”
//  “ES6由于引入了块级作用域，这种情况可以理解成函数在块级作用域内声明，因此不报错，但是构成区块的大括号不能少，否则还是会报错。”
//  这也佐证了级块作用域是以{}为边界的推测
// 不报错
'use strict';
if (true) {
  function f() {}
}

// 报错
'use strict';
// if (true)
  // function f() {}


// 6. const, 常量声明, 可以类比 let.
// const和 let var命名同名变量都是不相互兼容的
let cl;
// const cl = '';           // Duplicate declaration "cl"
// var cl;         // Duplicate declaration "cl"


// 7): “对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。const命令只是保证变量名指向的地址不变，并不保证该地址的数据不变，所以将一个对象声明为常量必须非常小心。”
// 可以配合一个 freeze 来完成深度冻结
function deepFreeze(o) {
    var prop, propKey;
    Object.freeze(o); // 首先冻结第一层对象.
    for (propKey in o) {
        prop = o[propKey];
        if (!o.hasOwnProperty(propKey) || !(typeof prop === "object") || Object.isFrozen(prop)) {
            // 跳过原型链上的属性和已冻结的对象.
            continue;
        }

        deepFreeze(prop); //递归调用.
    }
}


// 8): 全局对象不再是垃圾堆
// “为了保持兼容性，var命令和function命令声明的全局变量，依旧是全局对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于全局对象的属性。也就是说，从ES6开始，全局变量将逐步与全局对象的属性脱钩。”
global_none = 1;
var global_val = 10;
this.global_this = 20;
let global_let = 30;
function global_function () {}
// 实际上这里都是undefined原因是严格模式, 你可以使用 node 的 REPL 环境去执行.
// 1. 允许没有声明关键字声明变量, 此时得到的变量是全局对象的属性, 其余都不是全局对象成员.
// 2. 在全局 this 和 全局对象不再有交集. 这是和浏览器非常大的差别, 如下 : chrome : 版本 52.0.2743.116 (64-bit)
//     var a = 10; b = 20;
//     20
//     window === this
//     true
//     window.a + window.b
//     30
//     this.a + this.b
//     30
//   在 node --harmony下
//      global === this // false
// 3.弱化了对宿主对象的依赖. 宿主也得以更加纯净.
console.log(global === this, this);
console.log(global_none, global.global_none, global.global_this, global.global_val, global.global_let, global.global_function);
console.log(this.global_none, this.global_this, this.global_val, this.global_let, this.global_function);
