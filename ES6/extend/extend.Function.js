// 封装优化的继承方式

// 优点:
//  细节封装
//  使用简洁
//  仅仅一个空内部对象
//  父类不需要维护构造成员.子类也不能访问父类构造的成员.

// 缺点:
//  让需要维护一个对象
//  单集成
Reflect.defineProperty(Reflect.getPrototypeOf(Function), 'extend', {
    value(base) {
        if (typeof base !== 'function') {
            throw new TypeError("is't function .....");
        }

        let child = function child() {};

        // 不维护父类构造. 只关心原型
        child.prototype = base.prototype;
        this.prototype = new child();
        // 维护构造指的是维护原型的构造, 如果写成this.constructor = this就成了动态添加了.
        this.prototype.constructor = this;

        // 维护 super.
        this.super = base;
        return this;
    }
});


function Person(name = '', age = 0) {
    this.name = name;
    this.age = age;
}
Person.prototype.show = function () {
    return [this.name, this.age];
};

function Lm(name, age, classment = null) {
    // 强依赖
    Lm.super.call(this, name, age);
    this.classment = classment;
}

// 继承细节封装
Lm.extend(Person);

var lm = new Lm('liming', 19, new Person());
console.log(lm, lm.show(), lm.constructor.name);
