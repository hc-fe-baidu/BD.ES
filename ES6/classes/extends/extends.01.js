/**
 * Sub classing with extendsEDIT
 * The extends keyword is used in class declarations or class expressions to create a class as a child of another class.
 *
 * ES6支持的类声明和继承.
 *
 * 可使用 babel-node 或者 node --harmony 启动
 * 可使用 bode-debug(babel-node-debug) file 来进行调试. 调试器不是很完善,需要注意:
 * 	1.默认端口 + 路径: http://127.0.0.1:8080/?port=5858, 没有打开自己输入.
 * 	2. 要是没有执行断点,需要手动点击右边面板的双数线进入执行
 */
'use strict';
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(this.name + ' makes a noise.');
    }

    get animal() {
        return this;
    }

    static isAnimal(animal) {
        return animal instanceof Animal;
    }
}

class Dog extends Animal {
    speak() {
        console.log(this.constructor.name, ' speak : ', this.name + ' barks.');
    }
}

debugger;
// test....
console.log('###################################class extends start ######################################');

var bigYellow = new Dog('大黄');
// 执行自身方法
bigYellow.speak();

// 执行父类 get 方法
console.log(bigYellow.animal);

// 执行静态方法
let isAnimal = Animal.isAnimal(bigYellow);
console.log('bigYellow Dog is Animal? ', isAnimal);

console.log('###################################class extends stop ######################################');
