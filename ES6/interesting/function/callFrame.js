/**
 * 大多数CPU上的程序实现使用栈来支持函数调用操作。栈用来传递函数参数、存储返回信息、临时保存寄存器原有值以用于回复以及存储局部数据。
 * Call stack（调用堆栈）:调用堆栈是一个有序函数栈列表，按调用顺序保存所有在运行期被调用的方法。调用栈是一个容器
 * 调用栈存储不同的函数栈，函数栈理解为每一次方法调用所分配的一块独立的内存空间, 不同的方法栈依据调用规则形成有序结构
 * 在对方法栈的理解上需要注意这样几个地方：
 *    1.方法栈不是对象唯一的，同一个对象的方法调用2次，这2次的方法栈是不一样的。
 *    2.方法栈是不能互相通信的，也就是说当一个方法还没有返回任何值的时候，方法外部是不能获得该方法内部参数的状态的。
 *
 * 单个函数调用操作 所使用的栈部分 称为栈帧结构（stack frame）[这是个静态概念]
 * Stack frame（栈帧）是一个为函数保留的区域，用来存储关于参数、局部变量和返回地址的信息。堆栈帧通常是在新的函数调用的时候创建，并在函数返回的时候销毁。
 * 栈帧结构的两端由两个指针来指定。寄存器ebp通常用作栈帧的指针、esp用作栈的指针。esp随着数据的入栈和出栈。对于函数中大部分数据的访问都是通过基于栈帧指针ebp来实现。
 *
 * 函数只能访问自己能回溯的那些栈帧。例如f1调用f2，而f2函数又调用了f3，那么f3是可以访问自己的stack以及f2和f1的stack
 *
 * 对于函数我们往往需要动态分析他的行为. 我们知道，函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。
 * 如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，
 * 那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）。”
 *
 * 关于栈/栈帧的讨论大多数数据结构层面上的.概念. 但是有个问题比较值得讨论: 尾. 适当的尾操作会释放无用的栈帧,对于程序性能来讲比较重要.
 *
 * ES6明确规定,ECMAScript 的实现必须尾调用优化.
 */

// 现象入手: 尾调用.Tail Call
// 尾调用概念比较简单: 函数的最后一步调用另一个函数.
// 形如如下方式的就可成为尾调用
//   特征: 必须在最后一步执行函数调用
function g() {}
function f() {
    return g(x);
}

// 看几个看着像但不是尾调用的例子. 注: 尾调用函数的函数调用未必在行尾. 在行尾也未必是尾调用.衡量的唯一标准是: 函数最后一步执行调用.
// 先调用, 后返回.
function f() {
    var y = function () {return 1;}();
    return y;
}

// return 表达式的一部分. 调用之后还有其他操作.
function f() {
    return g() + 1;
}

// 隐式 return. 这种比较难发现.最让最后一句调用.但是忽略了返回值, 不主动返回,就会触发默认返回值
function f() {
    // 默认的 return undefined;
    g();
}

// 存在内部句柄引用的调用方式,引用的存在导致外部函数栈无法释放.也不属于尾调用
function f() {
    var foo = 10;
    function inner(b) {
        return b + foo;
    }

    return inner(foo);
}

/**
 * 尾调用的特殊性: 特殊的调用位置.
 * 函数存在多级调用之后会形成一个调用栈,每个栈节点会维持一个栈帧用于保存位置和内部变量等信息.
 * 这类似一个递归的操作: 当发生调用行为后,函数栈进入被调函数. 而主调函数则被暂存起来. 当被调函数执行完毕,返回主调函数并且析构自身栈帧.此时执行回到主调函数.主调函数也以此类推.
 * 这样的执行结构下,各个函数存在调用层次关系. 不妨做个假设能不能将这些调用关系平行化呢?
 *
 * 很有意思的是,尾调用作为函数的最后一步,且不引用当前函数内任何变量句柄时, 尾调函数是不需要保存当前的调用帧.可直接进入被调函数的栈帧执行.
 * 此时会发现函数调用栈由原先的层级关系变成线性关系,这就是尾部调用优化.尾部优化能够减少函数栈帧的维护,提升性能.尤其是在递归中
 *
 * 尾递归
 * 递归经常需要维护大量的函数栈帧,往往十分消耗内存.如果能够进行尾递归优化,该算法的复杂度将大大降低
 *
 * 尾递归,尾调用化
 * 一般来讲尾调用往往需要修改程序的解构和设计思路, 比如斐波那契数列的递归表达式就是 fn(n-1) + fn(n-2). 两项只和.
 * 尾递归化就需要使用游标和两个变量来完成: fbnq(n - 2, cur + next, cur + next + next);
 *
 */
// 上面代码是一个阶乘函数，计算n的阶乘，最多需要保存n个调用记录，复杂度 O(n)
function factorial(n) {
    if(n === 1)
        return 1;
    return n * factorial(n-1);
}
const fac = factorial(6);

// 经过尾递归优化,每次递归调用只维护当前函数栈帧,复杂度 O(1)
function factorialSimple(n, total = 1) {
    if(n === 1)
        return total;
    return factorialSimple(n - 1, n * total);
}
const facSimple = factorialSimple(6);

console.log(fac, facSimple);

// 尾递归往往需要对递归进行比较大的改造. 上述的阶乘算法就必须提供一个辅助参数. 当然你可以拆分成两个尾调用函数
// function factorialSimple(n, total) {
//     if(n === 1)
//         return total;
//     return factorialSimple(n - 1, n * total);
// }
//
// function factorial(n) {
//     return factorial(n, 1);
// }


// other demo
// 斐波纳契数列
'use strict';
function fbnq(n, cur = 1, next = 1) {
    if(n === 2) {
        return next;
    } else if(n <= 1){
        return cur;
    }

    return fbnq(n - 2, cur + next, cur + next + next);
}
let [a, b, c, d, e, x, y] = [fbnq(0), fbnq(2), fbnq(3), fbnq(4), fbnq(8), fbnq(10), fbnq(20)];

console.log(a, b, c, d, e, x, y);

// 普遍的斐波那契数列如下.
function fbnq1(n) {
    if(n <= 2){
        return 1;
    }
    return fbnq1(n-1) + fbnq1(n-2);
}

// 非递归
function fbnq2(l) {
    let c = 1,
        n = 1;
    for (let i = l; i > 2; i -= 2) {
        [c, n] = [c + n, c + n + n];
    }

    return n === 1 ? c : n;
}

// 我们稍微测试两个函数性能. 来看看尾递归的意义究竟有多大
//   10       0.477ms     0.082ms         0.240ms         循环更胜一筹
//   18       0.457ms     0.444ms         0.298ms         递归和尾递归平衡点
//   30       0.454ms     9.806ms         0.380ms
//   50       0.963ms     152451.818ms    大于100.         几乎呈现天壤之别.
//   100      1.022ms     ...             0.599ms
//   300      0.788ms     ...             0.892ms          for 和尾递归大约达到平衡点
//   1000     0.632ms     ...             0.923ms          递归一定大规模后求值效率更高
//   10000    1.776ms     ...             10.301ms         不可思议的结果优化恩尾递归性能比 for 高出30多倍
console.time('fbnq with tail call');
let fTailCall = fbnq(20);
console.timeEnd('fbnq with tail call');

console.time('fbnq');
let fCall = fbnq1(20);
console.timeEnd('fbnq');

console.time('fForCall');
let fForCall = fbnq2(20);
console.timeEnd('fForCall');

console.log(fTailCall === fCall, fCall === fForCall, fForCall);

// 可以尝试更多的例子,都会比较有趣. ----> http://www.cnblogs.com/joinclear/archive/2013/02/06/2908247.html

/**
 * 尾递归化的原则:
 *     尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部变量改写成函数的参数.
*  尾调用方法:
*       1. 提供一个辅助函数
*       2. 使用函数默认值,可以省去这个辅助函数.
*           function f(n, index = 1)
*       3. 柯里化
 */

// curring: 大致思路是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
// 可以利用柯里化将其余参数转化.柯里化需要将关键参数作为本质参数放在首位.
// 柯里原型是:
// var currying = function(fn) {
// 　　// 从第二个传入的参数开始截取,隔离第一个参数
// 　　var args1 = [].slice.call(arguments, 1);
// 　　// 返回一个函数（此处的函数为一个内部函数）外部调用的时候，只是会以函数表达式的形式展现出来
// 　　return function() {
// 　　   // 将参数进行链接. 提供完整的参数
// 　　　　var args2 = args1.concat([].slice.call(arguments));
// 　　　　return fn.apply(null, args2);
// 　　};
// };
// 使用 ES6 特性进行简化如下:
function curring(fn, ...n) {
    return function (...m) {
        return fn.call(null, ...m, ...n);
    }
}

function fbnqCurring(n, cur, next) {
    if(n === 2) {
        return next;
    } else if(n <= 1){
        return cur;
    }

    return fbnq(n - 2, cur + next, cur + next + next);
}

let fbCurring = curring(fbnqCurring, 1, 1);
console.time('fbnqCurring');
let fbCurringVal = fbCurring(20);
console.timeEnd('fbnqCurring');
console.log(fbCurringVal);


/**
 * ES6的尾调用优化只在严格模式下开启，正常模式是无效的。这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。
 *    func.arguments：返回调用时函数的参数。
 *    func.caller：返回调用当前函数的那个函数
 * 尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以尾调用模式仅在严格模式下生效
 */
// (function f() {
//     'use strict';       // TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context.
//     console.log(f.caller, f.arguments)
// })(1,2);


// 上面的函数并没有完成尾调用优化.当你输入有个10万左右的数. 将会抛出益处的错误: RangeError: Maximum call stack size exceeded
// TODO  待补充: 参考蹦床函数和模拟实现: ECMAScript6: p254-258.
