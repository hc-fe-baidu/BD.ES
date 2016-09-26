/**
 * 类声明
 *
 * 类声明是定义类的一种方式，就像下面这样，使用 class 关键字后跟一个类名（这里是 Polygon），就可以定义一个类.
 * 强调几个注意点:
 * 		1. 变量提升: 类声明和函数声明不同的一点是，函数声明存在变量提升现象，而类声明不会。也就是说，你必须先声明类，然后才能使用它，否则代码会抛出 ReferenceError 异常
 * 		2. 类表达式: 类表达式是定义类的另外一种方式，就像函数表达式一样，在类表达式中，类名是可有可无的。如果定义了类名，则该类名只有在类体内部才能访问到
 *   	3. 类的成员需要定义在一对花括号 {} 里，花括号里的代码和花括号本身组成了类体。类成员包括类构造器和类方法（包括静态方法和实例方法）。
 *   	4. 类体中的代码都强制在 严格模式 中执行，即便你没有写 "use strict"。
 *
 *	如果尝试使用函数的方式调用一个类.则会抛出一个: Class constructors cannot be invoked without 'new'的错误告诉你类的构造不能通过非 new 的方式被调用.
 */
'use strict';

// base demo
class Person {
    /**
     * 构造器（constructor 方法）
     * constructor 方法是一个特殊的类方法，它既不是静态方法也不是实例方法，它仅在实例化一个类的时候被调用。一个类只能拥有一个名为 constructor 的方法，否则会抛出 SyntaxError 异常。
     * 在子类的构造器中可以使用 super 关键字调用父类的构造器。
     * @method constructor
     * @param  {[type]}    name [description]
     * @param  {[type]}    age  [description]
     * @return {[type]}         [description]
     */
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    /**
     * 原型方法: 实际上这里的 class 就是一个语法糖. 普通的方式下我们使用 function 声明一个类. 这个类中进行成员属性的初始化, 我们同时在这个类的原型中定义诸多成员方法
     * 让类的实例共有.这里就是这种模式的语法糖.
     * @method showSelf
     * @return {[type]} [description]
     */
    showSelf() {
        let [name, age] = [this.name, this.age];
            //{name, age} = {name: this.name, age: this.age};
        console.log({name, age});
    }

    /**
     * 静态方法: static 关键字用来定义类的静态方法。 静态方法是指那些不需要对类进行实例化，使用类名就可以直接访问的方法。静态方法经常用来作为工具函数。
     * @method breathing
     * @return {[type]}  [description]
     */
    static breathing () {
        console.log('Perosn static method: breathing. ');
    }
}

// test....
console.log('################################### base start ######################################');

let lm = new Person('liming', 15);

lm.showSelf();
Person.breathing();

console.log('#################################### base end ########################################');
