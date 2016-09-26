// doc: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create

// 对象创建的三种方式.
// object.create

// Object.create(proto, [ propertiesObject ])
// proto
// 一个对象，作为新创建对象的原型。如果 proto 参数不是 null 或一个对象值，则抛出一个 TypeError 异常。
// propertiesObject
// 可选。该参数对象是一组属性与值，该对象的属性名称将是新创建的对象的属性名称，值是属性描述符（这些属性描述符的结构与Object.defineProperties()的第二个参数一样）。注意：该参数对象不能是 undefined，另外只有该对象中自身拥有的可枚举的属性才有效，
// 也就是说该对象的原型链上属性是无效的。

// 简单使用
let cr1 = Object.create({
    show() {
        console.log(this);
    }
}, {
    id: {
        value: 1001,
        enumerable: true,
        configurable: false
    },

    name: {
        value: true,
        enumerable: true,
        writable: true
    },

    salary: {
        value: 10000
    }
});

// 写入失败
cr1.id = 10;
cr1.name='lm';
console.log(cr1, 'salary' in cr1);
cr1.show();

// 实现继承
//Shape - superclass
function Shape() {
    this.x = 0;
    this.y = 0;
}

Shape.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    console.info("Shape moved.");
};

// Rectangle - subclass
function Rectangle() {
    Shape.call(this); //call super constructor.
}

Rectangle.prototype = Object.create(Shape.prototype);

var rect = new Rectangle();

rect instanceof Rectangle //true.
rect instanceof Shape //true.

rect.move(4, 6); //Outputs, "Shape moved."
console.log(rect);

// other
// 创建一个原型为null的空对象
let cr2 = Object.create(null);

// 等价操作, 如下三种方式是等价的
var cr3 = {};

function Constructor(){}
cr3 = new Constructor();

cr3 = Object.create(Constructor.prototype);


// polyfill
// 参考 ES6/polyfill/Object.create.method.es5
