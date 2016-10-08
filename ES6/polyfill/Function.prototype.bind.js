/**
 * bind()方法会创建一个新函数，当这个新函数被调用时，它的this值是传递给bind()的第一个参数, 它的参数是bind()的其他参数和其原本的参数.
 *  fun.bind(thisArg[, arg1[, arg2[, ...]]])
 *  参数
 *      thisArg: 当绑定函数被调用时，该参数会作为原函数运行时的 this 指向。当使用new 操作符调用绑定函数时，该参数无效。
 *      arg1, arg2, ...: 当绑定函数被调用时，这些参数加上绑定函数本身的参数会按照顺序作为原函数运行时的参数。
 *  返回值
 *      返回由指定的this值和初始化参数改造的原函数拷贝
 *
 *  bind() 函数会创建一个新函数（称为绑定函数），新函数与被调函数（绑定函数的目标函数）具有相同的函数体（在 ECMAScript 5 规范中内置的call属性）。
 *  当目标函数被调用时 this 值绑定到 bind() 的第一个参数，该参数不能被重写。绑定函数被调用时，bind() 也接受预设的参数提供给原函数。
 *  一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的this 值被忽略，同时调用时的参数被提供给模拟函数。
 *
 */
let obj = {
        age: 10,
    },
    Person = {
        age: 20,
        showAge() {
            console.log(this.age);
        }
    };
const showAge = Person.showAge.bind(obj);
showAge();
showAge.call(Person);   // bind 做的是词法绑定. call 不能进行
Person.showAge.call(Person);


// 作为构造函数使用的绑定函数
// 自然而然地，绑定函数适用于用new操作符 new 去构造一个由目标函数创建的新的实例。当一个绑定函数是用来构建一个值的，原来提供的
// this 就会被忽略。然而, 原先提供的那些参数仍然会被前置到构造函数调用的前面。
// TODO
function Point(x, y) {
  this.x = x;
  this.y = y;
  this.z = 'z';
}

Point.prototype.toString = function() {
  return this.x + ',' + this.y;
};

var p = new Point(1, 2);
p.toString(); // '1,2'

var emptyObj = {
    z: 'nu'
};
var YAxisPoint = Point.bind(emptyObj, 0/*x*/);
// 以下这行代码在 polyfill 不支持,
// 在原生的bind方法运行没问题:
//(译注：polyfill的bind方法如果加上把bind的第一个参数，即新绑定的this执行Object()来包装为对象，Object(null)则是{}，那么也可以支持)
// var YAxisPoint = Point.bind(null, 0/*x*/);

var axisPoint = new YAxisPoint(5);
let po1 = axisPoint.toString(); // '0,5'

let po2 = axisPoint instanceof Point; // true
let po3 = axisPoint instanceof YAxisPoint; // true
let po4 = new Point(17, 42) instanceof YAxisPoint; // true
console.log(YAxisPoint.toString(), axisPoint, po1, po2, po3, po4);


/**
 * polyfill: curring
 * 兴许你看到 bind 的描述中有这么一句话: 当目标函数被调用时 this 值绑定到 bind() 的第一个参数. 时会有些好奇,
 * bind 函数怎么做到调用时完成某个功能的. 这种延迟绑定恰恰使用的柯里化
 */
