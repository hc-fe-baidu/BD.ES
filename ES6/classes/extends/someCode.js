'use strict';

var ClassTest;

(function () {
    var id = 0;
    ClassTest = class {
        constructor (name) {
            var _id = id;
            this.name = name;
            /**
             * 配置一个 id属性  : [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty]
             * @method defineProperty
             * @param  {[type]}       this        [description]
             * @param  {[type]}       'id'        [description]
             * @param  {[type]}       {                                                                 configurable: false [description]
             * @param  {[type]}       enumerable: true          [description]
             * @param  {[type]}       get:        function      (             [description]
             * @return {[type]}                   [description]
             */
            Object.defineProperty(this, 'id', {
                configurable: false,
                enumerable: true,
                get: function () {
                    return _id;
                },
                set: function (nouse) {},
            });
            id ++;
            this.value = 0;
        }

        toString () {
            return "I'm " + this.name + ", the " + this.id + "nth child of THE DARK LORD!";
        }

        add (value) {
            this.value += value;
            return this;
        }
        minus (value) {
            this.value -= value;
            return this;
        }
        time (value) {
            this.value *= value;
            return this;
        }
        divide (value) {
            this.value /= value;
            return this;
        }

        Add (value) {
            this.value += value;
            return this.value;
        }
        Minus (value) {
            this.value -= value;
            return this.value;
        }
        Time (value) {
            this.value *= value;
            return this.value;
        }
        Divide (value) {
            this.value /= value;
            return this.value;
        }
    };
})();
var test1 = new ClassTest('Aloha'),
    test2 = new ClassTest('Kosmos');

class ClassOther {
    constructor () {
        this.name = "MiaoWu~~~";
        this.id = 0;
    }

    toString () {
        return "I'm Nothing...";
    }
}
var other = new ClassOther();

/**
 * 这里的接口并不是和 java 中的interface 非常不同.这里的实现可以认为是一个适配器模式
 */
class Interface {
    constructor (kernel, options) {
        options = options || {};
        if (!!options.changable) {
            Object.defineProperty(this, 'kernel', {
                configurable: false,
                enumerable: false,
                writable: true,
                value: kernel,
            });
        }
        else {
            Object.defineProperty(this, 'kernel', {
                configurable: false,
                enumerable: false,
                get: function () {
                    return kernel;
                },
                set: function (nouse) {},
            });
        }
        if (!!options.frozen) {
            /**
             * Object.freeze() 方法可以冻结一个对象。冻结对象是指那些不能添加新的属性，不能修改已有属性的值，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性的对象。也就是说，这个对象永远是不可变的。该方法返回被冻结的对象。
             * @method freeze
             * @param  {[type]} this [description]
             * @return {[type]}      [description]
             */
            Object.freeze(this);
        }
    }

    get value () {
        if (isNaN(this.kernel.value)) return 0;
        else return this.kernel.value;
    }
    set value (nouse) {}
    get description () {
        if (!!this.kernel.toString) return this.kernel.toString();
        else return "EMPTY";
    }
    set description (nouse) {}

    add (value) {
        if (!!this.kernel.add) return this.kernel.add(value);
        else return this;
    }
    minus (value) {
        if (!!this.kernel.minus) return this.kernel.minus(value);
        else return this;
    }
    time (value) {
        if (!!this.kernel.time) return this.kernel.time(value);
        else return this;
    }
    divide (value) {
        if (!!this.kernel.divide) return this.kernel.divide(value);
        else return this;
    }

}

var int1 = new Interface(test1, { changable: true });
var int2 = new Interface(test2, { frozen: true });
