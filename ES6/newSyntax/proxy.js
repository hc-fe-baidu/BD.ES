'use strict';

/**
 * Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程
 * Proxy 用于给基础操作定义用户自定义行为.可定义的基础操作包含: 属性检索, 赋值, 枚举, 调用等.
 * 简而言之就是 '代理' 你做某件事.
 * 通用语法是:
 *      var proxy = new Proxy(target, handler);
 *      target
 *          目标对象，可以是任意类型的对象，比如数组，函数，甚至是另外一个代理对象。
 *      handler
 *          处理器对象，包含了一组代理方法，分别控制所生成代理对象的各种行为。handler 是占位符对象，它包含代理的 traps(提供访问属性的途径，与操作系统中的 traps 定义相似)。
 */

// 基础使用
// let setV, getV;
let count = 0,
    proObj = {
        id: 1
    };
const pro1 = new Proxy(proObj, {
    get(target, key, receiver) {
        // get 会被多次调用, 如果在 get 中触发了对象本身的 get, 比如 console.log / assign 输出对象本身( target )或者包含对象本身的操作,将会形成死递归.
        count++;
        return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
        // 同理 set 中如果 set 了对象自身,也会形成死递归
        console.log(target, key, value, receiver, typeof key);
        // reflect.set 用于给一个对象设置属性, 返回值是 bool ,表示设置设置的结果
        return Reflect.set(target, '__' + key, '>> ' + value, receiver);
    }
});

pro1.name = '代理';

console.log(pro1, count, proObj);

// 针对对象的代理
let pro3 = {
    // proxy: new Proxy(target, handler)
};

// proxy 也可以作为其他对象的原型.
let pro4 = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

let obj = Object.create(pro4);
console.log(obj.time); // 35

// 代理操作允许在同一个对象上进行多次代理. 但并非每个操作都可以代理.
// 可代理的操作即 handler 对象的属性枚举如下:
// eg: get(target, propKey, receiver)
//  针对 a.b 或者 a['b'] 的访问方式, 返回值类型不限制, 最后一个参数receiver可选，当target对象设置了propKey属性的get函数时，receiver对象会绑定get函数的this对象

// 完整的 handler 对象如下(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)
// handler.getPrototypeOf()
// A trap for Object.getPrototypeOf.
// handler.setPrototypeOf()
// A trap for Object.setPrototypeOf.
// handler.isExtensible()
// A trap for Object.isExtensible.
// handler.preventExtensions()
// A trap for Object.preventExtensions.
// handler.getOwnPropertyDescriptor()
// A trap for Object.getOwnPropertyDescriptor.
// handler.defineProperty()
// A trap for Object.defineProperty.
// handler.has()
// A trap for the in operator.
// handler.get()
// A trap for getting property values.
// handler.set()
// A trap for setting property values.
// handler.deleteProperty()
// A trap for the delete operator.
// handler.ownKeys()
// A trap for Object.getOwnPropertyNames.
// handler.apply()
// A trap for a function call.
// handler.construct()
// A trap for the new operator.
// eg: constructor
function Person (name = '', age = 0){
    this.name = name;
    this.age = age;
}
Person.prototype.showMe = function shouMe() {
    console.log(this.name, this.age);
};

const PersonProxy = new Proxy(Person, {
    construct(target, argumentsList, newTarget) {
        console.log('--->', target.name, ...argumentsList, newTarget.name);
        return Reflect.construct(target, argumentsList, newTarget);
    }
});
let lm = new PersonProxy('liming', 19);
console.log(lm);


// 场景
// 1. 避免特殊值 undefined, 并给予默认值
const pro2 = new Proxy({
    age: 30
}, {
    get(target, property) {
        if (property in target) {
            return Reflect.get(target, property);
        }
        return 'default value';
    }
});

console.log(pro2.name, pro2.age);

// 2. 检查赋值合法性
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // The default behavior to store the value
    return Reflect.set(obj, prop, value);
  }
};

let person = new Proxy({}, validator);

person.age = 100;
console.log(person.age); // 100
// person.age = 'young'; // 抛出异常
// person.age = 300; // 抛出异常

// 3. 构造扩展, 代理的继承.
// 参考ES6/extend/extend.proxy.js

// 4. dom 代理 [数据代理和 dom 代理的实现是现代框架数据驱动的两个基础落脚点].
// 参考: /BD.ES/webModule/data-driven

// 5.附加属性
