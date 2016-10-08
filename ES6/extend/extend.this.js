// 利用修改 this 指向,给子类动态添加的方式模拟继承

// 优点: 逻辑简单, 不需要维护更多的东西. 轻便.

// 缺点: 只能复制出构造的成员,拿不到父类的原型, 不属于继承, 仅仅是简单的代码复用.
function Person(name = '', age = 0) {
    this.name = name;
    this.age = age;

    this.show = function show() {
        return this.name + ', ' + this.age;
    }
}

function Lm(name, age, classment = null) {
    this.Person = Person;
    this.Person(name, age);
    delete this.Person;

    this.classment = classment;
}

var lm = new Lm('liming', 19, new Person());

console.log(lm);
