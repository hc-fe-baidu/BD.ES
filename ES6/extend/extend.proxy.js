// 继承: proxy.

// (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy : Extending constructor)
function extend(sup, base) {
    var descriptor = Object.getOwnPropertyDescriptor(base.prototype, 'constructor');
    // 修改原型指向
    base.prototype = Object.create(sup.prototype);
    var handler = {
        construct(target, args) {
            // 每次创建对象的时候, 声明一个临时的对象用于指向 base 以维护原型.
            var obj = Object.create(base.prototype);
            // 获取构造成员.
            this.apply(target, obj, args);
            return obj;
        },
        apply(target, that, args) {
            sup.apply(that, args);
            base.apply(that, args);
        }
    };
    // 创建代理,延迟实际操作
    var proxy = new Proxy(base, handler);
    // 维护构造
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, 'constructor', descriptor);
    return proxy;
}

// 这样的写法下有个限制是: 父类需要的参数必须在子类的参数的前面.如下 name 必须在 age 前面.
var Person = function(name) {
    this.name = name;
};

var Boy = extend(Person, function(name, age) {
    this.age = age;
});

Boy.prototype.sex = 'M';

var Peter = new Boy('Peter', 13);
console.log(Peter, Peter.sex);
