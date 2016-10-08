/**
 * 箭头函数就是个简写形式的函数表达式，并且它拥有词法作用域的this值（即不会新产生自己作用域下的this, arguments, super 和 new.target 等对象）。此外，箭头函数总是匿名的。
 *
 * (param1, param2, …, paramN) => { statements }
 * (param1, param2, …, paramN) => expression
 *          // equivalent to:  => { return expression; }
 *
 * // 如果只有一个参数，圆括号是可选的:
 * (singleParam) => { statements }
 * singleParam => { statements }
 *
 * // 无参数的函数需要使用圆括号:
 * () => { statements }
 *
 * 讲真javascript 中 this 是比较令人头痛的, 引入剪头函数之后情况也更多样, 特别是在回调中访问 this.
 *     总而言之: 箭头函数则会捕获其所在上下文的  this 值，作为自己的 this 值.
 *
 * 箭头函数的引入有两个方面的影响：一是更简短的函数书写，二是对 this 的词法解析。
 */

// 剪头函数使用简单的语法组织参数,语句和返回值. 如果只有简单的返回值,此时可以直接在剪头后写返回值表达式.
let arrow1 = (a = 1) => Math.pow(a, 2);
// 返回值如果是个对象, 则需要将其语句化. 因为大括号会被认为是语句快. 当然也可以使用{return {...};}}
let arrow2 = (a = 1) => ({a, b: arrow1(a)});

console.log(arrow1(4), arrow2(5));

/**
 * 箭头函数有几个使用注意点。
 *  （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
 *  （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
 *  （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。
 *  （4）不可以使用yield命令，因此箭头函数不能用作Generator函数。
 */

let arrow3 = (a = 1) => ({
  thisV: this,
    argument: arguments
});

let {thisV, argument} = arrow3();
console.log(thisV === this, argument[0] === this, argument[1] === global, argument === arguments);

/**
 * 实际上可以看出来这里访问的 arguments 就是 node 对代码的一层包装的参数: this, require, Module, file, filePath
 *  argument[0]
 *     #<Object>
 *  argument[0] === this
 *     true
 *  argument[1]
 *     function require(path) { try { exports.requireDepth += 1; return self.require(path); } finally { exports.requireDepth -= 1; } }
 *  argument[2]
 *     #<Module>
 *  argument[3]
 *     /Users/baidu/baidulib/git/baidu/fe/BD.ES/ES6/newSyntax/Arrow.js
 *  argument[4]
 *     /Users/baidu/baidulib/git/baidu/fe/BD.ES/ES6/newSyntax
 */

let nodeArgument = arguments,
    globalThis= this;
// 剪头函数中访问 arguments 将会拿到完外层的参数集 .也就是最外层包装的 defined 函数的参数
[1].map((item, index) => {
    console.log(arguments === nodeArgument);
});


// 剪头函数没有自己的 argument 和 this , 剪头函数拿到的是外层的arguments 和 this
// argument: 剪头函数拿到的是外部函数的 arguments.(注: 函数的 arguments 是不包含被默认参数初始化的形参.
// this: this 的规则很有意思: 没有明确指定 this 的值的时候他都指向 global
(function (a, b = 'default b', c = 'C') {
    console.log(arguments);
    return (a, b) => {
        console.log(a, b, arguments === nodeArgument, arguments, this === globalThis, this === global);
    }
})('of A value', 'b')(2);

// 剪头函数的 this 是不随调用方式改变的.
this.a = 10;
let arrow4 = () => console.log(this.a);
let arrow5 = function () {
    console.log(this.a);
};
let arrowObj = {
    a: 7,
    op1: arrow4,
    op2: arrow5
}
arrow4.call({a: 8});
arrowObj.op1();
arrow5.call({a: 9});
arrowObj.op2();

// 剪头函数的 this 与普通函数不同.
this.id = 11;
+function foo() {
    setTimeout(() => {
        console.log(this.id);   // 100 . 剪头函数的this是不会动态
    }, 2);
}.call({id: 100});

+function foo() {
    setTimeout(function () {
        console.log(this.id, this);     // undefined 或者 11 .  ndoe 环境下 settimeout 中的this 指向 Timeout 的一个对象. 在浏览器环境中没有显示指明 this 的, 都指向宿主.
    }, 2);
}.call({id: 100});

// 剪头函数没有自己的 this . 他是引用外层的 this.
// 另一个方面剪头函数能够保留最初的 this 指向.
// 由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。
// 剪头函数内的 this 指向外部函数.
// 如果最外层还是剪头函数则结果是11 . 因为他 自身没有 this 还会向外捕获 this
// let foo = () => {
function foo () {
    return () => {
        return () => {
            return () => {
                console.log('id:', this.id);
            };
        };
    };
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1

// 剪头函数嵌套: 上述例子可以改成
let foos = function () {
    return () => () => () => {console.log(this.id)};
};

f = foos.call({id: 2});

t1 = f.call({id: 2})()(); // id: 1
t2 = f().call({id: 3})(); // id: 1
t3 = f()().call({id: 4}); // id: 1

// 模拟简单的管道机制: 前一个函数的输出是后一个函数的输入.
// arr.reduce(callback,[initialValue])
// 提供 operate 给 reduce 作为初始值,之后每次 reduce 时操作上一个参数然后结果返回给下个函数.
// 因此 reduce 的两个参数依次是: 初试参数/fn1 => fn1(operate) . fn1(operate)/fn2 => fn2(fn1(operate)) ....
// 由于参数需要统一传递所以每个传入管道的函数必须要给出一个数组类型的返回值.以保持 pipeline 的灵活性.
// (pre, curr) => curr(...pre):这个函数是一个尾调用函数
const pipeline = (...fn) => (...operate) => fn.reduce((pre, curr) => curr(...pre), operate); // curr(pre(...operate))
const pow = (a = 0, b = 0) => [Math.pow(a, 2), Math.pow(b, 2)];
const add = (a = 0, b = 0) => [a + b];
const dePow = (a = 1) => Math.pow(a, 0.5);
const piple = pipeline(pow, add, dePow);
const resByPiple = piple(5, 12);

console.log(resByPiple);

// 箭头函数还有一个功能，就是可以很方便地改写λ演算。
// λ演算的写法
fix = λf.(λx.f(λv.x(x)(v)))(λx.f(λv.x(x)(v)))

// ES6的写法
var fix = f => (x => f(v => x(x)(v)))
               (x => f(v => x(x)(v)));
// 上面两种写法，几乎是一一对应的。由于λ演算对于计算机科学非常重要，这使得我们可以用ES6作为替代工具，探索计算机科学。”


// 关于剪头函数对 this 词法解析的影响和更详细的说明. 可以参考 ES6/diff/this.js
