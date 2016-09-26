// 除了主流的三种方式之外, ES6添加了新的方式去创建对象.
// 首先我们了解一下; reflect
// Reflect 对象提供了若干个能对任意对象进行某种特定的可拦截操作（interceptable operation）的方法。
// 和其他大多数全局对象不同的是，Reflect 并不是一个构造函数，你不需要使用 new 运算符来构造它的实例。下面的所有方法都是它的静态方法（就和 Math 对象身上的一样）。

// doc: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct
// Reflect.construct() 方法的行为有点像 new 操作符 构造函数 ， 相当于运行 new target(...args).
function Foo () {}

let args = [1,2,3,4];
var obj1 = new Foo(...args);
var obj2 = Reflect.construct(Foo, args);
console.log(obj1, obj2);

// 使用 newTarget 参数
function someConstructor() {}
var result = Reflect.construct(Array, [], someConstructor);

Reflect.getPrototypeOf(result); // 输出：someConstructor.prototype
Array.isArray(result); // true
