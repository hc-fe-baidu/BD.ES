// doc: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer

// 对象创建的三种方式.
// Object initializer

// 对象字面量

// 引入 es6新的语法
// 解构配合: Shorthand property names (ES6)
var a = "foo",
    b = 42,
    c = {};
var o = {
    a, b, c
};

// 短名称: Shorthand method names (ES6)
var o = {
    property([parameters]) {},
    get property() {},
    set property(value) {},
    * generator() {}
};

// 属性名计算: Computed property names (ES6)
var prop = "foo", index = 0;
var o = {
    [prop]: "hey",
    ["b" + "ar" + ++index]: "there",
    ["b" + "ar" + ++index]: "there"
};
console.log(o);

// getter. setter
var prop = 'property';
var o = {

  get property() {  },
  set [prop](value) {  },
};
console.log(o);


// 原型变更
// 定义属性为__proto__: 值 或 "__proto__": 值 时，不会创建名为__proto__属性, 此属性已存在, 指向对象原型。
// 如果给出的值是对象或者null，那么对象的[[Prototype]]会被设置为给出的值。（如果给出的值不是对象也不是null，那么对象的原型不会改变。）
var obj1 = {};
console.log(Object.getPrototypeOf(obj1) === Object.prototype);

var obj2 = { __proto__: null };
console.log(Object.getPrototypeOf(obj2) === null);

var protoObj = {};
var obj3 = { "__proto__": protoObj };
console.log(Object.getPrototypeOf(obj3) === protoObj);

var obj4 = { __proto__: "not an object or null" };
console.log(Object.getPrototypeOf(obj4) === Object.prototype, !obj4.hasOwnProperty("__proto__"));

// 对象字面值中，仅有一次变更原型的机会；多次变更原型，会被视为语法错误
// 允许
obj3.__proto__ = {};
obj3.__proto__ = {a: 2, a: 3};
// error: SyntaxError: Duplicate __proto__ fields are not allowed in object literals
var obj3 = {
    __proto__: protoObj,
    // __proto__: {a: 1}
};

// 不使用冒号标记的属性定义，不会变更对象的原型；而是和其他具有不同名字的属性一样是普通属性定义。
// 这个特性真是坑了爹了. 相当于添加了一个普通属性, 但是__proto__本身确实有特殊含义的
// obj5.__proto__ // { a: 1 }. 说明 js 对象并不是使用__proto__去寻找原型的.他只是个句柄.
var __proto__ = {a: 1};
var obj5 = {
    __proto__
}
console.log(obj5.a, obj5.__proto__, Object.getPrototypeOf(obj5));
// 类似的还有
var obj6 = { __proto__() { return "hello"; } };
var obj7Proto = 'proto';
var obj7 = { ['__' + obj7Proto + '__']: 10 };
console.log(obj6.__proto__, Object.getPrototypeOf(obj6), obj7.__proto__, Object.getPrototypeOf(obj7));

// 对象字面值记法和JSONEDIT
// 对象字面值记法和和 JavaScript Object Notation (JSON)是不同的。虽然他们看起来相似，不同点有：
//
// JSON 只允许"property": value syntax形式的属性定义。属性名必须用双引号括起来。且属性定义不允许使用简便写法。
// JSON中，属性的值仅允许字符串，数字，数组，true，false，或者其他JSON对象。
// JSON中，不允许将值设置为函数。
//  Date 等对象，经JSON.parse()处理后，会变成字符串。
// JSON.parse() 不会处理计算的属性名，会当做错误抛出。
