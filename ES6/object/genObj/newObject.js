// doc: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer

// 对象创建的三种方式.
// new object

// new constructor[([arguments])]
// 构造函数(constructor)
// 一个指明了对象类型的函数。
// 传参(arguments)
// 一个用来被构造函数调用的参数列表。

// Object函数提供了 new 的方式利用已有函数模板进行对象创建,
// object 接受一个基础类型和对象, 输出一定是个对象, 如果输出是对象,则不做处理直接返回
function Dog (name, age) {
    this.name = name;
    this.age = age;
}

let dh = new Dog('dahuang', 12),
    wc = Object(dh);
console.log(dh, wc, dh === wc); // true

// 实际上给 object 传入一个对象也能得到一个包装后的对象,传入 null/ undefined 将会得到一个空对象.
// 所以我们经常可以看见有的库里面如果期望某个参数是对象类型的,他不会做类型判断,而是直接将其传递给 object: (create 的 polyfill 中 : var Properties = Object(arguments[1])). 这样能确保一定有一个对象被操作
let o1 = new Object(),
    o2 = Object(),
    o3 = new Object(undefined),
    o4 = Object(undefined),
    o5 = new Object(null),
    o6 = Object(null),
    o7 = new Object(1),
    o8 = Object(1),
    o9 = new Object(true),
    o10 = Object(true),
    o11 = new Object('dx'),
    o12 = Object('dx'),
    i = 1;

console.log(o1, o2, o3, o4, o5, o6, o7, o8, o9, o10, o11, o12);
console.log(o1 === o2, o3 === o4, o5 === o6, o7 === o8, o9 === o10, o11 === o12);


// 当代码 new foo(...) 执行时：
//
// 1. 一个新对象被创建。它继承自foo.prototype.
// 2. 构造函数 foo 被执行。执行的时候，相应的传参会被传入，同时上下文(this)会被指定为这个新实例。new foo 等同于 new foo(), 只能用在不传递任何参数的情况。
// 3. 如果构造函数返回了一个“对象”，那么这个对象会取代整个new出来的结果。如果构造函数没有返回对象，那么new出来的结果为步骤1创建的对象，ps：一般情况下构造函数不返回任何值，
// 不过用户如果想覆盖这个返回值，可以自己选择返回一个普通对象来覆盖。当然，返回数组也会覆盖，因为数组也是对象。

// var one={};  
// one.__proto__=Person.prototype; 
// Person.call(one,'js');
// return this;

// 如下代码模拟 new 的过程. 实际上 new + 函数, 是一个语法糖, 语法糖我们没法模拟. 但是大致过程如此
Function.prototype.new = (function () {

    var Temp = function () {};

    return function () {
        if(typeof this != 'function') {
            throw '请使用函数调用';
        }

        let __inner = new Temp(),
            {id, name, age} = Object(arguments[0]);

        // 获取原型成员, 维护构造
        __inner.__proto__ = this.prototype;

        Object.defineProperty(__inner, "constructor", {
            writable: true,
            value: this
        });

        // 获取自身属性
        this.call(__inner, id, name, age);

        return __inner;
    };
})();

function Person (id, name, age) {
    this.id = id;
    this.name = name;
    this.age = age;
}

Person.prototype = {
    show() {
        console.log(this);
    }
};

let lm = Person.new ( {
    id: 1,
    name: 'sb',
    age: 32
});

lm.show();
console.log(lm.__proto__, Object.getPrototypeOf(lm) === Person.prototype);
console.log(lm instanceof Person, lm.constructor.toString());
