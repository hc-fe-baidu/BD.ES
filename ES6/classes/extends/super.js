/**
 * For example, when using methods such as map() that returns the default constructor, you want these methods
 * to return a parent Array object, instead of the MyArray object. The Symbol.species symbol lets you do this:
 *
 * Symbol.species帮你引用一个父类的成员. 如下的 mapped 并不是 locArray 的类型而是父类类型.
 */
'use strict';
class locArray extends Array {
  // Overwrite species to the parent Array constructor
  static get [Symbol.species]() {
      return Array;
  }
}
var a = new locArray(1,2,3);
var mapped = a.map(x => x * x);

console.log(mapped); // false
console.log(mapped instanceof locArray); // false
console.log(mapped instanceof Array);   // true


/**
 * ES6使用 super 去完成对父类的成员引用.
 */
class Cat {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Lion extends Cat {
  speak() {
    super.speak();
    console.log(this.name + ' roars.');
  }
}

let xinba = new Lion('xinba ');
xinba.speak();
