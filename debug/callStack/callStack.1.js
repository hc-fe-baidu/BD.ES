function f (fn) {
debugger;
    console.log(arguments.callee);
    fn();
}

var p = function p () {
debugger;
    console.log(arguments.callee);
};

// 匿名函数表达式在调试过程中,函数
var g = function (fn1, fn2) {
    console.log(arguments.callee);
    fn1(fn2);
};


(function () {
debugger;
    // console.log(a);
    g(f, p);
}())
