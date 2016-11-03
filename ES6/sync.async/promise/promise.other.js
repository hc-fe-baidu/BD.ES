/**
 * 更多 promise 扩展. 如下属性并不在 ES6 中部署.
 *
 * done:
 *  由于 catch 的特殊性,一个 promise 链的做后一个操作抛出的错误是无法捕获的.promise 的异步行为产生异常同定时器一样无法被全局捕获
 *       上述表达有误,定时器的错误无法使用 try catch 捕获. 但是全局可以拿到
 *  done就是这样一个永远处于回调链尾端的用于处理任何可能抛出错误的操作.
 * finally:
 *  接受一个普通函数, 无论 promise 对象最终状态如何都会执行的一个方法.
 *
 *  实现如下
 */

Promise.prototype.done = function done(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected).catch((reason) => {
        // 抛出一个全局错误
        setTimeout(() => {
            throw reason
        }, 0);
    });
};

Promise.prototype.finally = function finallyFn(callback) {
    const P = this.constructor;
    return this.then(value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason;
        })
    );
};
