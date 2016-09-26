 //  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create

// 为了让其进入 if, 我先注释了正确的判断
// if (typeof Object.create != 'function') {
if (typeof Object.create == 'function') {
    // Production steps of ECMA-262, Edition 5, 15.2.3.5
    // Reference: http://es5.github.io/#x15.2.3.5
    Object.create = (function() {
        //为了节省内存，使用一个共享的构造器
        function Temp() {}
debugger;
        // 使用 Object.prototype.hasOwnProperty 更安全的引用
        var hasOwn = Object.prototype.hasOwnProperty;

        return function(O) {
debugger;
            // 1. 如果 O 不是 Object 或 null，抛出一个 TypeError 异常。
            if (typeof O != 'object') {
                throw TypeError('Object prototype may only be an Object or null');
            }

            // 2. 使创建的一个新的对象为 obj ，就和通过
            //    new Object() 表达式创建一个新对象一样，
            //    Object是标准内置的构造器名
            // 3. 设置 obj 的内部属性 [[Prototype]] 为 O。
            Temp.prototype = O;

            var obj = new Temp();

            // 精彩
            Temp.prototype = null; // 不要保持一个 O 的杂散引用（a stray reference）...

            // 4. 如果存在参数 Properties ，而不是 undefined ，
            //    那么就把参数的自身属性添加到 obj 上，就像调用
            //    携带obj ，Properties两个参数的标准内置函数
            //    Object.defineProperties() 一样。
            if (arguments.length > 1) {
                // Object.defineProperties does ToObject on its first argument.
                var Properties = Object(arguments[1]);
                for (var prop in Properties) {
                    // 为什么还要判断一次? for in 会遍历得到原型中可枚举的属性.但这不是他自身的属性. 原型中的属性已经可以访问.如果再拷贝到 obj 上就违背了继承的初衷.
                    if (hasOwn.call(Properties, prop)) {
                        obj[prop] = Properties[prop];
                    }
                }
            }

            // 5. 返回 obj
            return obj;
        };
    })();
}

let liming = Object.create({
    show() {
        console.log(this);
    }
}, {
    __proto__: {
        a: 1,
        b: 2
    },
    id: {
        value: 1001,
        enumerable: true,
        configurable: false
    },

    name: {
        value: true,
        enumerable: true,
        writable: true
    }
});
