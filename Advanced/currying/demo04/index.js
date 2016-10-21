/**
 * 谈了那么多柯里化的东西, 柯里化有没有他的应用场景呢?
 *  貌似柯里化有3个常见作用：1. 参数复用；2. 提前返回；3. 延迟计算/运行。
 *  1. 参数复用
 *      function curring(fn, ...n) {
 *           return function (...m) {
 *               return fn.call(null, ...m, ...n);
 *           }
 *       }
 *       curring(fbnqCurring, 1, 1);
 *       从柯里化的定义中可以看见实际上最初传给 curring 函数的参数几何 n 实际上会被一个柯里化函数反复使用, 他和每次传入的不同参数集 m 链接之后一同发给原函数.
 *  2. 提前返回
 *  3. 延迟计算
 */

// 提前返回
var addEvent = function(el, type, fn, capture) {
    if (window.addEventListener) {
        el.addEventListener(type, function(e) {
            fn.call(el, e);
        }, capture);
    } else if (window.attachEvent) {
        el.attachEvent("on" + type, function(e) {
            fn.call(el, e);
        });
    }
};
// 上面的方法有什么问题呢？很显然，我们每次使用addEvent为元素添加事件的时候，(eg. IE6/IE7)都会走一遍if...else if ...，其实只要一次判定就可以了，怎么做？–柯里化。改为下面这样子的代码：

var addEvent = (function(){
    if (window.addEventListener) {
        return function(el, sType, fn, capture) {
            el.addEventListener(sType, function(e) {
                fn.call(el, e);
            }, (capture));
        };
    } else if (window.attachEvent) {
        return function(el, sType, fn, capture) {
            el.attachEvent("on" + sType, function(e) {
                fn.call(el, e);
            });
        };
    }
})();
// 初始addEvent的执行其实值实现了部分的应用（只有一次的if...else if...判定），而剩余的参数应用都是其返回函数实现的，典型的柯里化。
// 略显牵强.

// 延迟计算
// 参考 polyfill/Function.prototype.bind.js [bind: 当目标函数被调用时 this 值绑定到 bind() 的第一个参数]
