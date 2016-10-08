/**
 * 该特性是非标准的，请尽量不要在生产环境中使用它！
 *
 * 当一个对象被创建时,它的 __proto__ 属性和内部属性[[Prototype]]指向了相同的对象 (也就是它的构造函数的prototype属性).改变__proto__
 * 属性的值同时也会改变内部属性[[Prototype]]的值,除非该对象是不可扩展的.
 * 如果需要访问一个对象的原型,应该使用方法Object.getPrototypeOf.
 *
 */

// polyfill
Object.defineProperty(Object.prototype, '__Proto__', {
    get() {
        let _thisObj = Object(this);
        return Object.getPrototypeOf(_thisObj);
    },
    set(proto) {
        if (this === undefined || this === null) {
            throw new TypeError();
        }
        if (!isObject(this)) {
            return undefined;
        }
        if (!isObject(proto)) {
            return undefined;
        }
        let status = Reflect.setPrototypeOf(this, proto);
        if (!status) {
            throw new TypeError();
        }
    }
});
function isObject(value) {
    // 巧妙的对象类型判断.
    return Object(value) === value;
}

function Person(name) {
    this.name = name;
}

Person.prototype = {
    id: 1000
};

const lm = new Person('liming'),
    proto = lm.__Proto__ === Person.prototype,
    protoR = lm.__Proto__ === lm.__proto__;

console.log(lm, proto, protoR, lm.__Proto__);


// setPrototypeOf and getPrototypeOf
Object.setPrototypeOf(lm, {id: 1});
console.log(Object.getPrototypeOf(lm), Object.getPrototypeOf(new Person('danni')));
