// 原型链维护 + 修改 this 指向的继承方式

// 优点: 能够拥有比较优良的设计: 属性私有, 操作共有. 具体来讲就是类的操作放在原型中, 为所有对象共有, 属性放在构造中, 实例化的时候各个对象私有.
// 配合修改 this 指向获取构造成员.
// 已经是基本的继承了. 操作共享.

// 缺点: 需要维护比较多的依赖, 需要维护一个多余的父类对象
// 需要配合 call 或者 apply 去获取构造成员. 否则只能把属性也提到原型级别[不可取].
// 操作繁琐: 细节暴露.
// 子类强依赖父类.
// 父类构造里维护了一套和子类相同的属性
function Person(name = '', age = 0) {
    this.name = name;
    this.age = age;
}
Person.prototype.show = function () {
    return [this.name, this.age];
};

function Lm(name, age, classment = null) {
    // 强依赖
    Person.call(this, name, age);
    this.classment = classment;
}

// 操作暴露
Lm.prototype = new Person();
Lm.constructor = Lm;
var lm = new Lm('liming', 19, new Person());

console.log(lm, lm.show(), lm.constructor.name);
