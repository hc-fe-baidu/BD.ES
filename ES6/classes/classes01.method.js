/**
 * 如下提供 ES6的类声明方式和传统的类模拟方式,尝试解析 class 这个语法糖的模拟过程
 */

// class by ES6
class Point {
    /**
     * [constructor description]
     * @method constructor
     * @param  {[type]}    x [description]
     * @param  {[type]}    y [description]
     * @return {[type]}      [description]
     */
    constructor(...arg) {
        let [x, y] = this.translate(...arg);
        this.x = x;
        this.y = y;

        // 不能直接错报的去修改 由 get 生成的 point 的值.
        // this.point = this;
        // 这样是可以的.但是是无意义的,依据词法分析.此时 point 已经被 get生成了.此时访问 this.point 他会对其进行寻址.
        // 也就是进入 get 方法中进行计算获取. 他此时是有正确的 get 值的.
        this.point;
    }

    /**
     * get set 方法
     *
     * 有时候希望访问属性时能返回一个动态计算后的值, 或希望不通过使用明确的方法调用而显示内部变量的状态.在JavaScript中,
     * 能通过使用 getter 实现. 尽管可能结合使用getter和setter创建一个伪属性,但不能既使用getter绑定到一个属性上,同时
     * 又用该属性真实的存储一个值.这是很必要的机制.他会衍生一些限制:
     * 	1. 访问方式: 这里的 get 方法将被解释为一个属性而不是操作.所以你不能 .point()的方式调用:  p1.point is not a function
     * 	2. 这个 point 被视为一个属性.此时你不能在构造函数中再声明一个同名的属性. 他和情况3实质上是一样的, 因为依据词法分析进入构造器时class的成员已经被加载
     * 		到活动对象中并能被正确寻址了.此时进行: this.point = xxx 的赋值操作将会去寻找 set 操作.没有则报错.
     * 		但是假如你只是单纯的寻址,则他将访问 get 方法, 而不报错.因为我们声明了 get 方法.
     * 	3. 使用get生成的 point 属性不能使用 this.point = 10;去引用修改它的值:  Cannot set property point of #<Point> which has only a getter
     *
     * 实际上java 中的 get/set是必须声明一个对应的属性.我们可以设置位私有的. 然后完成同样的事情.
     *
     * 	在函数章节详细介绍: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
     *  this.point = this;
     *
     * getter/setter 的实现思路可以借鉴 :
     * 		Object.defineProperty(this, 'id', {
     *          configurable: false,
     *          enumerable: true,
     *          writable: true,
     *          get: function () {
     *              return _id;
     *          },
     *          set: function (nouse) {},
     *      });
     *
     * @method point
     * @return {[type]} [description]
     */

    get point() {
        // this.point = 'point';
        return this;
    }
    set pointDesc (desc) {
        this.point.desc = desc + ' this is point....';
    }

    /**
     * 原型方法: 实际上这里的 class 就是一个语法糖. 普通的方式下我们使用 function 声明一个类. 这个类中进行成员属性的初始化, 我们同时在这个类的原型中定义诸多成员方法
     * 		让类的实例共有.这里就是这种模式的语法糖.
     * @method translate
     * @param  {[type]}  ...point [description]
     * @return {[type]}           [description]
     */
    translate(...point){
        Array.isArray(point[0]) && (point = point[0]);
        let [x, y] = point;
        return [x,y];
    }

    /**
     * 静态方法: static 关键字用来定义类的静态方法。 静态方法是指那些不需要对类进行实例化，使用类名就可以直接访问的方法。静态方法经常用来作为工具函数。
     * @method distance
     * @param  {[type]} a [description]
     * @param  {[type]} b [description]
     * @return {[type]}   [description]
     */
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx*dx + dy*dy);
    }
}

// test....
console.log('###################################class method start ######################################');

const p1 = new Point(5, 5);
p1.distance = 'set method.';
console.log('p1 >>> get method: ', p1.point);

const p2 = new Point([10, 17]);
console.log('p2 >>> get method', p2.point);


console.log('p1, p2之间的距离: ', Point.distance(p1, p2));

console.log('###################################clcass method start ######################################');


// 上面是 class 语法糖实现了类, 构造函数, 实例函数, 静态方法, 以及get / set. 下面我们不妨使用function 实现这一功能.

function PointFn (x, y) {
    var point = this.translate(x, y);
    this.x = point.x;
    this.y = point.y;
    this.point = this;
}

PointFn.prototype = {
    translate: function(){
        var format = arguments;
        !arguments[1] && (format = arguments[0]);

        return {x: format[0], y: format[1]};
    },
    toString: function () {
        return {x: this.x, y: this.y};
    }

}

PointFn.distance = function (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;

    return Math.sqrt(dx*dx + dy*dy);
}

// test
console.log('###################################function method start ######################################');

var p3 = new PointFn(3, 3);
var p4 = new PointFn([6, 7]);
console.log('P3 && P4 is : ', p3.toString(), p4.toString());

var distanceP3AP4 = PointFn.distance(p3, p4);
console.log('p1, p2之间的距离: ', distanceP3AP4);

console.log('###################################function method end ######################################');
