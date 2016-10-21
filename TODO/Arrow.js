// 非常奇怪的代码. 始终想不明白
const re = [1,2,3].reduce(function(a, b) {
    return a, b;
});

const re1 = [1,2,3].reduce((a, b) => {
    return a, b;
});

// ReferenceError: b is not defined
// 匪夷所思的错误.很奇怪. b没有定义. 怎么也看不明白.
// const re2 = [1,2,3].reduce((a, b) => a, b);

// 上述代码的按照常规理解应该是: {return a, b}. 或者(a, b).于是改为下述代码
// 奇怪的是下面代码并没有报错.
const re2 = [1,2,3].reduce((a, b) => (a, b));
// polyfill: var re2 = [1, 2, 3].reduce(function (a, b) {
//  return a, b;
// });

// ','又称分组操作符, 返回最后一个表达式的值, 所以上述代码一般理解成执行 a, 返回 b.
// 但结果不是我们想的那样, 我们使用转译看看他的 polyfill[http://babeljs.io/repl/]

// const re2 = [1,2,3].reduce((a, b) => a, b);
// ------------------polyfill
// var re2 = [1, 2, 3].reduce(function (a, b) {
//   return a;
// }, b);

// 转译代码很奇怪, 其实也不奇怪. 总算是看明白了. reduce((a, b) => a, b)中的 b 并不是剪头函数的返回值, 而是 reduce 的第二个参数: arr.reduce(callback,[initialValue]). 用作初始化值
// 逗号分组的优先级级低, 他左边被视为一个整体了.
// 擦... 丢人了, 妈的

console.log(re, re1, re2);
