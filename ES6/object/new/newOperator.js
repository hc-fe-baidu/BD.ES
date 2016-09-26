//  new 创建 object 已经在 object/generate/newObject.js 中做了说明.
//  这里提供 new 的更新信息.

// 1. new.target.
// new.target属性允许你检测函数或构造方法是否通过是通过new运算符被调用的。在通过new运算符被初始化的函数或构造方法中，new.target返回一个指向构造方法或函数的引用。在普通的函数调用中，new.target 的值是undefined。
// 通常 点 的作用是提供属性访问的上下文，但这里"new."其实不是一个真正的对象. 不过在构造方法调用中，new.target指向被new调用的构造函数，所以"new."成为了一个虚拟上下文。
function Foo() {
    if (!new.target) throw "Foo() must be called with new";

    console.log("Foo instantiated with new: ", new.target.name);
}

// Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new"

// new 不能单独存在, new.target属性是一个可以被所有函数访问的元属性。在箭头函数中，new.target指向外围函数的 new.target。
console.log(new.target);

function Person () {
    (() => {
        console.log('arrow fun: ', new.target.name);
    })();


}
new Person();       // arrow fun:  function Person().

// 在类的构造方法中，new.target指向直接被new执行的构造函数。并且当一个父类构造方法在子类构造方法中被调用时，情况与之相同。
class A {
    constructor() {

        console.log(new.target.name);
    }
}

class B extends A {
    constructor() {
        super();
    }
}

var a = new A(); // logs "A"
var b = new B(); // logs "B"
