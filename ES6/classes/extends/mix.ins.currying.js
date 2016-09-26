/**
 * 官方提供的继承感觉非常糟糕. 他对类的限制特别大.几乎没法定制一个 class. 可能在继承中还需要考虑. 并且可能在继承已有类的时候往往需要一个 mix 去适配.
 */
'use strict';

class Animal{

    life() {
        console.log(this.constructor.name, ' : life...');
    }
}

/**
 * 鸟类
 */
class Birds extends Animal{
    fly() {
        console.log(this.onstructor.naem, ' : flying');
    }
    oviparity() {
        console.log(this.onstructor.naem, ' : 卵生');
    }
}

/**
 * 鱼类
 */
class Fish extends Animal {
    swim() {
        console.log(this.constructor.name, ' : swiming');
    }
}

/**
 * 如果尝试使用函数的方式调用一个类.则会抛出一个: Class constructors cannot be invoked without 'new'的错误告诉你类的构造不能通过非 new 的方式被调用.
 * 如果是用 MDN 推荐的方式则发现我们需要一个匿名类去完成链式继承的中间件.
 *
 * 期望使用特里化去完成链式继承.
 *
 *	这个思路是失败的, 原因在于比如 fish 和 birds 两个已有类是没办法改变他们的继承关系.这时候想把他们串成一个链是做不到的.必定涉及到更改某个已有类的继承结构.
 *
 */
let mix = Bases => class extends Bases {};

// function mix (...Bases) {
//     Bases.map((item, index, array) => {
//         let tempClass = class extends item{};
//     });
// }

/**
 * 企鹅
 */
class Penguin extends mix(Fish) {
    constructor(name) {
        super(name);
        this.name = name;
    }
}

var QQ = new Penguin('QQ');
QQ.swim();
