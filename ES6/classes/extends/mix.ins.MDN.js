/**
 * 如下例子并不是很恰当.权且当做多继承实例
 *
 *  注意:
 * 		1. 父类的构造可以被子类继承到,所以子类如果和父类构造执行一样的代码可以省略子类构造. 但是子类一旦有构造将会覆盖父类构造
 * 		2. 如果子类存在构造必须显示的调用super(). 否则将的到'this' is not allowed before super()的错误.
 * 		3. 子类没有自己的 this. 如果子类没有构造则将继承父类构造.若子类有,子类必须在constructor方法中调用super方法，否则新建实例时会报错。
 * 			这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。
 *
 * 	TODO [http://es6.ruanyifeng.com/#docs/class]
 */
'use strict';


/**
 *  使用如下机制模拟多继承. 实际上就是形成一个继承链. extends的值居然可以动态传入,太 bug 了. 不过这也限制了类的写法. 真心感觉不是很好
 */

var CalculatorMixin = Base => class extends Base {
    calc() {
        console.log(this.constructor.name, ': calc');
    }
};

var RandomizerMixin = Base => class extends Base {
    randomize() {
        console.log(this.constructor.name, ': randomize');
    }
};


class Foo {
    foo(){
        console.log(this.constructor.name, ': foo');
    }
}
class Bar extends CalculatorMixin(RandomizerMixin(Foo)) {}

let bar = new Bar();

console.log(bar);
bar.calc();
bar.randomize();
bar.foo();
