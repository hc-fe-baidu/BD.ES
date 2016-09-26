// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this

//TODO 实际上 this 的情况比较复杂, 好多地方还是不是很明白, 继续讨论

// 在绝大多数情况下，函数的调用方式决定了this的值。this不能在执行期间被赋值，在每次函数被调用时this的值也可能会不同。ES5引入了bind方法来设置函数的this值，而不用考虑函数如何被调用的。

// 在非严格模式中 this 在全局一般和一个宿主是重叠的. 这会造成很多困扰, 比如作用域链和原型链产生交集.
// 受 node 版本的限制, 如下代码无法出现理想的情况. this 已经是一个单独的空对象了. 想要复现可以在 node 的命令行中输入
// 函数外部 this 应该指向宿主. 但是这里 this 指向一个空对象和宿主不一样
console.log(this == global, this);

// 如下代码令我十分崩溃.
// 1. 全局定义的函数并不是宿主的成员. 不能使用 global 调用.也不在所谓的 this 上. 但在 node 命令行中this和 global是一个对象, p 是他们的成员
// 2. 既然p 不在 global 上,那么 p 中的 this 就不是 global,但是为什么global.name(global.name 和 name 还是一致的) 被赋值了. 并不是原先那种调用者的思维理解这个 this.
// 3. 有个 t6 告诉我,没有明确指定上下文的,也没有主动修改绑定上下文的,他们的 this 都指向宿主.
// 看来解释器对 this 的发生了不同. 并且很蛋疼.函数应该已经挂载到变量对象上了. 但是函数中的 this 实在是要命.还是和宿主纠缠不清. 历史包袱..
// 总而言之: 在函数内部，this的值取决于函数是如何调用的[针对 对象点 的方式, window.p 不是导致 p 中 this 指向 window 的原因.]。如果调用者不明确, 那么就是宿主辣
// 对于如下的例子而言: this的值不是由函数调用设定。因为代码不是在严格模式下执行，this 的值总是一个对象且默认为全局对象。严格模式下直接调用函数,内部的 this 指向 undefined
// 原先可能存在理解误差, 全局声明的函数调用时他的 this 指向全局对象并不是因为: window.xxx 的原因, 从匿名函数就可以看出来.他并不是因为挂到了全局对象上导致的 this 指向全局, 只是因为this 的值总是一个对象且默认为全局对象。
function p() {
    // 'use strict';
    this.name = {fir: '韦斯特', sec: '大卫', thi: '李'};
    this.age = 10
    console.log(this === global);
};

p();
// this.p();         // TypeError: global.p is not a function
// global.p();     // TypeError: global.p is not a function
console.log(p in global, p in this, name, age, this.name, this.age, global.name === name, global.age);

// 回调函数的 this
function p0 (fn) {
    fn();
}
function p01 () {
    console.log(this.name);
}

// 因为函数 this 的值总是一个对象且默认为全局对象. 没有 new 的情况下调用者和 this 无关.
p0(function pInn() {
    console.log(this === global, pInn in this);
});

// 这种方式确实存在迷惑性, 总觉得 this 是和调用者相关的. 确实如此, 但是这种方式相当于对象调用方法的方式.
// 这个 p0当直接调用时是一个函数,new p0 时是一个模板,他还是一个对象.这个 p0是 Function 函数的实例.
// p0.inn = p01;相当于我们给一个对象添加一个属性. 此时调用情况下就是对象点的讨论范畴
p0.inn = p01;
p0.inn();

// 最后, 如果注明为严格模式的话, 直接调用函数则函数中的 this 是 undefined. 如果 new 则 ok.
function p1 (ar) {
    'use strict';
    console.log(this);
    this.a = ar;
}

// p1();   // TypeError: Cannot set property 'a' of undefined
new p1();


// 对象中的 this.
// 首先要明白 this 的寻址并不同于变量解析. 他不套用静态作用域. this 的指向一定是动态确定的.
// 对象中的 this 仅和调用关系有关.
// 使用对象点的方式, 对象内的成员 this 会被绑定到对象.除非我们主动修改.
// 在何处或者如何定义调用函数完全不会影响到this的行为。
var o = {prop: 37};

function independent() {
  return this;
}

o.f = independent;

console.log(o.f()); // logs 37

// 实际上还存在一个多级问题. 我们的标准是直接用有的就是 this.
o.b = {
    g: independent,
    prop: 42
};
console.log(o.b.g()); // logs 42

// JavaScript的原型继承中的一个有趣的特性: 从父类检索到的操作中的 this 会指向直接调用者.
var o1 = {
    f: function() {
        return this.a + this.b;
    }
};
var p = Object.create(o1);
p.a = 1;
p.b = 4;

console.log(p.f(), p.__proto__ === o1); // 5

// getter 与 setter 中的 this
// 再次，相同的概念也适用时的函数作为一个 getter 或者 一个setter调用。作为getter或setter函数都会绑定 this 到从设置属性或得到属性的那个对象。
function modulus() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
}

var o = {
    re: 3,
    im: 4,
    get phase() {
        return Math.pow(this.im, this.re);
    }
};

Object.defineProperty(o, 'modulus', {
    get: modulus,
    enumerable: true,
    configurable: true
});

console.log(o.phase, o.modulus); // logs -0.78 1.4142


// 构造函数中的 this
// 当一个函数被作为一个构造函数来使用（使用new关键字），它的this与即将被创建的新对象绑定。

// 需要注意的是: While the default for a constructor is to return the object referenced by this, it can instead return some other object (if the return value isn't an object, then the this object is returned).
// 构造器返回的默认值是一个this引用的对象，这时可以手动设置返回其他的对象，如果返回值不是一个对象，返回this。  大致理解就是: 构造默认返回的是一个 this 的引用, 你也可以手动指定一个返回值,当你制定的是对象才能生效,否则依旧返回 this
/*
 * Constructors work like this:
 *
 * function MyConstructor(){
 *   // Actual function body code goes here.
 *   // Create properties on |this| as
 *   // desired by assigning to them.  E.g.,
 *   this.fum = "nom";
 *   // et cetera...
 *
 *   // If the function has a return statement that
 *   // returns an object, that object will be the
 *   // result of the |new| expression.  Otherwise,
 *   // the result of the expression is the object
 *   // currently bound to |this|
 *   // (i.e., the common case most usually seen).
 * }
 */
function C(){
  this.a = 37;
}

var o2 = new C();
console.log(o2.a); // logs 37

function C2() {
    this.a = 37;
    return {
        a: 38
    };
}

o2 = new C2();
console.log(o2.a); // logs 38


// 关于 call / apply / bind /
// 基本上就是绑定一个上下文的操作
function add(c, d) {
    return this.a + this.b + c + d;
}

var o3 = {
    a: 1,
    b: 3
};

// The first parameter is the object to use as 'this', subsequent parameters are passed as
// arguments in the function call
// call 和 apply 会使用 object 将第一个参数进行对象包装.
let re1 = add.call(o3, 5, 7); // 1 + 3 + 5 + 7 = 16

// The first parameter is the object to use as 'this', the second is an array whose
// members are used as the arguments in the function call
let re2 = add.apply(o3, [10, 20]); // 1 + 3 + 10 + 20 = 34
console.log(re1, re2);

// bind: 永久绑定. 调用f.bind(someObject)会创建一个与f具有相同函数体和作用域的函数，但是在这个新函数中，this将永久地被绑定到了bind的第一个参数，无论这个函数是如何被调用的。
function fn(){
  return this.a;
}

var g = fn.bind({a:"azerty"});
console.log(g()); // azerty

var o = {a: 37, f: fn, g: g};
console.log(o.f(), o.g()); // 37, azerty


// dom 事件中的 this
// 当函数被用作事件处理函数时，它的this指向触发事件的元素

// 内联事件处理函数中的 this
// 当代码被内联处理函数调用时，它的this指向监听器所在的DOM元素：


/**
 * 剪头函数中的 this
 *
 *  在箭头函数出现之前，每个新定义的函数都有其自己的  this 值（例如，构造函数的 this 指向了一个新的对象；严格模式下的函数的 this 值为 undefined；如果函数是作为对象的方法被调用的，则其 this 指向了那个调用它的对象）。
 *  在面向对象风格的编程中，这被证明是非常恼人的事情。
 */

 // ECMAScript 3/5 中，可以通过新增一个变量来指向期望的 this 对象，然后将该变量放到闭包中来解决。
 // bind 是更好的选择.
let globalThis = this;
function Person() {
    var self = this; // 也有人选择使用 `that` 而非 `self`.

    setTimeout(function growUp() {
        // 回调里面的 `self` 变量就指向了期望的那个对象了
        self.age ++;
        this.age ++;
        console.log('timeout: ',self.age, this.age, global === self, this);
    }.bind({age: 10}), 10);
}
// 直接调用在严格模式下 this 为 undefined. 非严格模式下 this 由于没有显示指定因此是宿主 global
global.age = 1;
Person();   // timeout:  2 11 true { age: 11 }

// 箭头函数则会捕获其所在上下文的  this 值，作为自己的 this 值
function Person1() {
    this.age = 0;

    setTimeout(() => {
        this.age++; // |this| 正确地指向了 person 对象
        console.log(this.age);
    }, 10);
    // }.bind({age: 10}), 10);     // error SyntaxError: missing ) after argument list
}

var p = new Person1();

// 由于 this 已经在词法层面完成了绑定，通过 call() 或 apply() 方法调用一个函数时，只是传入了参数而已，对 this 并没有什么影响：
let PersonOwn = {
    age: 100,
    op: Person
};
PersonOwn.op();     // 101  11 false
// Person.call(PersonOwn);  同上

// 如下例子可以说明: 剪头函数的 this 被词法绑定为上下文的 this. 使用 call 不能改变剪头函数的 this.
// 想要改变剪头函数的 this 也不是没有办法, 你可以改变剪头函数的上下文的 this 即可达到目的.
var adder = {
    base: 1,
    addThruCall: function(a) {
        var f = v => v + this.base;
        var b = {
            base: 2
        };

        return f.call(b, a);
    }
};

console.log(adder.addThruCall(1));  // 仍然输出 2（而不是3 ——译者注）
console.log(adder.addThruCall.call({base: 101}, 1));

// 严格模式
// 不是很明白这个描述: 考虑到 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略。
// 把严格模式声明在函数内, 则剩余参/函数默认值等特性数将抛出: SyntaxError: Illegal 'use strict' directive in function with non-simple parameter list
// 如果把严格模式放在函数之外则函数可以使用剩余参数等新特性.
let [strictThis, strictArg] = ((a, b) => {
    'use strict';
    return [this, [a, b]];
})(1,2);
console.log(strictThis === this, strictArg);

// 同样的箭头函数不会在其内部暴露出  arguments不会指向箭头函数的 参数集，而是指向了箭头函数所在作用域的一个名为 arguments 的值（如果有的话，否则，就是 undefined）。
// arguments 也是在所在作用域捕获的.
// 剩余参数可以弥补 arguments.
var arguments = 42;
var arr = () => arguments;

function foo() {
  var f = () => arguments[0]; // foo's implicit arguments binding
  return f(2);
}

console.log(arr(), foo(1)); // 1

// 看看 ES6 中class 下的方法和对象声明中的短方法是否遵循剪头函数的规律
class Arrow1 {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    showSelf() {
        return this;
    }
}

let Arrow2 = {
    id: 1010,
    showId() {
        return this.id;
    }
}

let arrowByClass = new Arrow1('1000', 'lm');
arrowByClass.__proto__.showId =  Arrow2.showId;
let [res1, res2, res3, res4] = [arrowByClass.showSelf(), arrowByClass.showSelf.call({id: 10}), arrowByClass.showId(),  Arrow2.showId.call({id: 10})];

// 看来不是的. 短方法依旧是传统的方法. 他们能够通过call , apple , bind 来改变 this 指向
console.log(res1, res2, res3, res4);      // Arrow1 {1000, 'lm'} . {10} . 1000 . 10
