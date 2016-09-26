//  “ES6允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构(Destructuring)”

// 解构也可以认为是: 模式匹配. .** 如果等号的右边不是数组

// 1. 简单体验
// “本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值”, 当然解构可以很复杂.
// 基本数组解构示例, 基本上是模式匹配. 可以配合剩余参数对实参进行聚合或者分解.
let [a, b, c, ...e] = [1, 2, 3, 7, 8, 9];
let [ , [[bar], baz], last] = [4, [[5], 6]];
let [f, ...g] = [...[1,2,3]]
// 模式不完全匹配
let [h, [i], j] = [10, [11], 12];
console.log(a, b, c, e, bar, baz, last, f, g, h, i, j);

// 左模式需要能接受右模式, 比如如下是成立的. 因为 q 能接受一个数组类型
// 形参可以比实参少, 比如[x] 只去接受[12, 13]的前一个数.
let [p, q, [o]] = [10, [11], [function() {return false;}, 13]];
// 但是左模式不能复杂于右模式.才能完成解构
// ********左模式 <= 右模式*********
// let [m, [n], l] = [1, 2, 3];
console.log(p, q, o);


// 2. 复杂解构也支持
let [x, y, z] = new Set(["a", "b", "c"]);
// let [i, j, k] = new Map({});
console.log(x, y, z);

// 实际上任何具有 iterator 的接口都可以使用解构去进行赋值. 生成器函数本身会实现 iterator 接口
function* fibs() {
    let fa =1, fb = 1;
    while(true){
        yield fa;
        [fa, fb] = [fb, fa + fb];
    }
}

let [f1, f2, f3, f4, f5] = fibs();
console.log(f1, f2, f3, f4, f5);


// 3. 解构的默认值
// 注意解构使用 === 做判断. 如果不是严格等于 undefined 默认值是不会生效的.
// 默认值是惰性求值的. 比如可以是一个表达式, () => {console.log('set default val'); return 'de4' }, 如果解构给值是 undefined 才会执行.
let [de1 = 'de1', [de2 = 'de2'] , de3 = 'de3', de4 = (() => {console.log('set default val'); return 'de4' })() ] = [0, [false], undefined, undefined/*null*/];
console.log(de1, de2, de3, de4);        // 0 false 'de3' null



// 4. 对象解构赋值.
// 对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名
// 实际上对象解构赋值是先寻找同名属性.然后去映射其对应的真实属性. 如果左边的解构中匹配属性和真是属性相等, 则可以省略. 对象的解构完整写法应该是: let { a: a } = { a: 1 }. 此时左边的结构可以省略掉用来映射的属性和:.
// 既然如此只要映射属性能够匹配我们就能将值赋给不同名的另外的属性, 我们会这样做: let { a: b } = { a: 1 }. 此时真正被赋值的是 b. 左边结构的 a 紧紧作为模式匹配, 他会将值映射真正的值 b 上. 所以 let 声明的是 b, typeof a 得到的是 undefined.
// let { a: b } = { a: 1 } 再这样的结构里等号右边是正常的键值对象,等号左边是 {属性匹配 : 真是赋值对象}的结构
let {ob1, ob3, ob2: two} = { ob1: 1, ob2: 2, ob3: 3 };
console.log(ob1, two, typeof ob2, ob3);

// 5. 复杂结构的模式匹配.
// 在复杂结构中对象和数组可以混合匹配, 匹配到叶子节点的才是赋值, 其余均是模式. 比如 code和 data 都是左边模式的叶子节点.
// 6. 对象解构的默认值
let {
    code, msg = code === 0 ? 'success' : 'error' , data
} = {
    code: 1,
    data: [{
        id: 10,
        text: '北京'
    }, {
        id: 20,
        text: '天津'
    }]
    // msg: 'success'
},
[ first ] = data;

// 实际上使用{}的方式对对象进行解构很容易出一个问题: 模式会被认为是代码快. 比如我们写成 :let id, text;  {id, text} = first;这样, 这是{id, text} 就会被认为是一个单独的代码快.实际上声明一个对象的时候不对其进行赋值也会被认为是代码快.
// 这时候需要将代码快进行语句化, 做法很多, 比如常见的分做操作符()
let id, text;
// {id, text} = first;         //    SyntaxError: Unexpected token =
({id, text} = first);
console.log(code, msg, data, first, id , text);

// 做常用的场景就是获取一些工具方法
let { log, sin, cos } = Math;
// 或者配合 import
// import {Component, propType} from react


// 7. 基础类型的解构, 此时包装类会登场.
// string 的解构
const [s1, s2, s3, s4 ,...s5] = 'hello word';
let { length: len } = 'this is destructuring demo';
console.log(s1, s5, len);
// 基础类型.
let {toString: s} = 123;
console.log(s);
// null 和 undefined 虽然也是基础类型,但是他们并没有对应的包装类, 所以他们俩没有任何属性用于解构, 解构的右值如果是null 和 undefined 则将报错.
// let { prop: un } = undefined;         // TypeError: Cannot match against 'undefined' or 'null'.



// 8. 函数相关的解构
let fn1 = [[1, 2], [ , 4]].map(([a = 100, b = 10]) => a + b);
console.log(fn1);
// 这样的默认值在不传任何参数的情况下会出错, 此时的解构对应的是: {x = 0, y = 0} = undefined. 上面已有分析.
function move ({x = 0, y = 0}) {
    console.log([x, y]);
}
// move(); // TypeError: Cannot match against 'undefined' or 'null'.

// 这种方式就完全没有起到默认值的作用
function move1 ({x, y} = {x: 0, y: 0}) {
    console.log([x, y]);
}
move1({});

// 最佳方式, 做了默认值的兼容和默认值内属性默认值的兼容.
function move ({x = 0, y = 0} = {}) {
    console.log([x, y]);
}

function drawES6Chart({size = 'big', cords = { x: 0, y: 0 }, radius = 25} = {})
{
  console.log(size, cords, radius);
  // do some chart drawing
}

drawES6Chart({
  cords: { x: 18, y: 30 },
  radius: 30
});


// 9. 解构中()的使用
// 解构赋值虽然很方便，但是解析起来并不容易。对于编译器来说，一个式子到底是模式，还是表达式，没有办法从一开始就知道，必须解析到（或解析不到）等号才能知道。
// 由此带来的问题是，如果模式中出现圆括号怎么处理。ES6的规则是，只要有可能导致解构的歧义，就不得使用圆括号。
// 但是，这条规则实际上不那么容易辨别，处理起来相当麻烦。因此，建议只要有可能，就不要在模式中放置圆括号。

// 情况一: 声明类型的模式不要带括号. 如下. 包括函数参数声明
// var [(a)] = [1];
// var {x: (c)} = {};
// var ({x: c}) = {};
// var {(x: c)} = {};
// var {(x): c} = {};}
// var { o: ({ p: p }) } = { o: { p: 2 } };

// function f([(z)]) { return z; }

// 情况二: 模式赋值, 其实和上述情况是一样的. 赋值语句中，不能将整个模式，或嵌套模式中的一层，放在圆括号之中。
// MOZ: {a, b} = {a:1, b:2} is not valid stand-alone syntax[无效的独立语法], as the {a, b} on the left-hand side is considered a block and not an object literal[左边部分被视为代码快而不是对象常量].
// ({ p: a }) = { p: 42 };
// ([a]) = [5];

// 总结: 个人理解, 模式是以大括号为边界的一类特殊语法糖. 他和普通代码快不同, 不属于声明(可能包含声明)和静态语法, 仅仅是一个结构组织的语法糖. 在模式上进行任何分组操作都是语法之外的. 模式也不能被语句话. 他没有实际的语句含义.仅仅是一个结构.
// 那模式中有拥有实际含义的部分么? 是有的. 比如模式中有真实的变量声明,这部分是有确定含义的,允许使用分组.
// 但是分组操作符只能接受已声明变量, 变量为声明,或者声明的同时是不能存在分组操作符.在声明操作中不能出现分组操作.
// 综上所述: 在解构的模式中,非模式允许使用分组, 但要注意分组和声明语法互斥
// let ap, (bp); // SyntaxError: Unexpected token ( .   声明操作不能和分组操作并存
let m0, m1, m2;
[(m0)] = [10];
// 模式拥有声明效果.m 变量是没有显示声明的 . (最外层的括号是避免将{}理解为语句快.)
({m1: (m), m2: (m2)} = {m1: 10, m2: 11});
console.log(m0, m, m2, this.m);

// 被模式声明的变量比较特殊, 不同于 let 和 var . 这二者在严格模式下是 delete 不了的.
// TODO 推测: 模式声明的变量是类似变量对象的特殊对象的属性. es6的实现中全局的成员已经不是宿主对象的成员了.但他们必定属于某个替代对象. 暂时没看到类似的说明.待验证.
// 推测2: 模式定义的属性并没有去设定变量的属性描述符: configurable.
var mv = 1;
delete m, m2, mv;
console.log(typeof m, typeof m2, typeof mv, this.m, this.m2, this.mv);



// 10 使用场景
// a. 交换两个值, 不需要声明多个变量过着做一个运算了.
let [ten1, ten2] = [2, 3];
[ten1, ten2] = [ten2, ten1];
console.log(ten1, ten2);

// b. 多返回, 这个有点牵强, 只不过是返回数组或者对象,接受的时候进行解构匹配而已.
let [ten3, ten4, {a: ten5, b:ten6}] = function () {
    let {a, b} = {a: 3, b: 4};
    return [1, 2, {a, b}];
}();

console.log(ten3, ten4, ten5, ten6);

// c. 处理 json啊, url 参数默认值之类的略显牵强. 处理存在循环结构的 json 作用其实没有想象的那么大.不过辅助可迭代对象迭代还是蛮不错的.
let tenMap = new Map();
tenMap.set('0', 1);
tenMap.set('1', 2);
tenMap.set('2', 4);

for(let [key, value] of tenMap) {
    console.log(key, ' > ', value);
}

// d. 最实用的是模块加载
// import React, { Component, PropType } from 'react';


// 11 . 更多特性
// 计算属性名，如object literals，也可以被解构

var expr = "foo";

var obj = {
  get [expr]() { return "bar"; }
};

console.log(obj.foo); // "bar"

let [v1, v2, v3] = ['v2', 'id', 'name'];
let { [v2]: oId, [v3]: oName } = {
    id: 1001,
    name: 'bj',
    children: [{
        id: 1001001,
        name: 'hd',
    }]
};

console.log(oId, oName);


// 注意点:
// 函数使用默认值参数会导致函数 length 失真.
let len1 = (function (a) {}).length,
    len2 = (function (a = 5) {}).length,
    len3 = (function ({a, b, c = 5}) {}).length,
    // 剩余参数也会导致这个问题. 其实看看编译后的代码就就不难发现,都是针对 arguments 的处理.
    len4 = (function (...arg) {}).length,
    // 默认参数以及其后的参数都不计入 length.
    len5 = (function (a=1, b, c, d) {}).length;
console.log(len1, len2, len3, len4, len5);  // 1, 0, 1, 0, 0
