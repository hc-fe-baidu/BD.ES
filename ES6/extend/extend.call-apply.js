// 修改 this 指向的继承方式

// 优点: 比动态添加更加简洁.并且有内部函数支持.

// 缺点: 不属于继承, 仅仅是代码重用
function Person(name = '', age = 0) {
    this.name = name;
    this.age = age;
}
Person.prototype.show = function () {
    return this;
};

function Lm(name, age, classment = null) {
    Person.call(this, name, age);
    this.classment = classment;
}


var lm = new Lm('liming', 19, new Person());

console.log(lm, lm.show);
