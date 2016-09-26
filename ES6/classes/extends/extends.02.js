/**
 * 不妨试试使用原生的 js 怎么去模拟这种继承
 * @method Animal
 * @param  {[type]} name [description]
 */
'use strict';

function Animal (name) {
    this.name = name;
}

Animal.prototype.speak = function () {
    console.log(this.constructor.name + ':  I\'m ' + this.name + ' makes a noise. wang! wang! wang!');
}

/**
 * 使用 function 进行继承模拟
 * 1.注册中间件
 * 2.使用中间件原型指向传入的类的原型完成原型成员继承.然后使用 this 的原型指向这个中间件的实例. 这样就绕过了传入类的构造中声明的成员.这样就避免了每次 extends 都会产生一个 super 对象实例.因为 extend执行完
 * 		这个中间件对象就会废弃掉. [思考这种方式和 直接this.prototype = supers.prototype,省掉中间件的区别]
 * 3.维护构造指向
 * 4.保存一个 super 对象的引用.用于子类去获得父类构造的成员: Dog.super.call(this, name);
 * @method Dog
 */
Function.prototype.extend = function extend (supers) {
	if(typeof supers!=='function'){		throw new error("is't function .....");			}
	var child=function(){};
	child.prototype=supers.prototype;
	this.prototype=new child();
	this.prototype.constructor=this;
	this.super=supers;

	return this;
}

/**
 * 普通继承方式
 * @method Dog
 * @param  {[type]} name [description]
 */
function Dog (name) {
    Dog.super.call(this, name);
}
Dog.extend(Animal);

var wc = new Dog('旺财')
wc.speak();


/**
 * 使用 class 类继承普通 function 创建的 animal 类.使用上无差别
 */
class Chicken extends Animal{
    speak() {
        console.log(this.constructor.name + ':  I\'m ' + this.name + '  makes a noise. ge ge da');
    }
}

let jc = new Chicken('jeck');
jc.speak();
