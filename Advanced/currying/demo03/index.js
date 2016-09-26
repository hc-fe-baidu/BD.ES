var add = function() {
    var _this = this,
        _args = arguments;
    return function fn() {
        if (!arguments.length) {
            var sum = 0;
debugger;
            for (var i = 0, c; c = _args[i++];)
                sum += c;
            return sum;
        } else {
            Array.prototype.push.apply(_args, arguments);
            return fn;
            // es6严格模式不允许访问这个属性
            // return arguments.callee;
        }
    }
}
var sum = add(1)(2)(3)(4)();//10

console.log(sum);

console.log('\n-------------------------------------------------------currying-------------------------------------------------------\n');

debugger;
// 普通写法
var curry = function(fn) {
    var _args = [];
    return function cb() {
        if (arguments.length == 0) {
            return fn(..._args);
        }

        Array.prototype.push.apply(_args, arguments);
        return cb;
    }
};

var sumOrd = curry((..._args) => {
    // 剪头函数中不要使用 arguments,他会被编译替换为最外层的 defined的参数,
    // var sum = Array.from(arguments).reduce((previousValue, currentValue, currentIndex, array) => {
    var sum = Array.from(_args).reduce((previousValue, currentValue, currentIndex, array) => {
        return previousValue + currentValue;
    });
debugger;
    return sum;
});

var sumOrdData = sumOrd(1)(2)(3)(4)();//10

console.log(sumOrdData);
