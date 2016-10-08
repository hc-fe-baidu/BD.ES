var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
// 上面代码中，参数y的默认值等于x。调用时，由于函数作用域内部的变量x已经生成，所以y等于参数x，而不是全局变量x。
// 如果调用时，函数作用域内部的变量x没有生成，结果就会不一样。

x = 1;

function f1(y = x) {
  // let x = 2;
  var x = 2;
  console.log(y);
}

f1() // 1

// 实际上我会疑惑,为什么f1的结果是1, 如果按照词法分析应该是 undefined, 进入函数后首先初始化了 y 和 x 两个变量. 这个 x 是: let x声明的. 只不过此时没有值罢了. 然后给 y 赋值.
// 如此看来结果怎么是1呢?
// 记得某次看到 js 权威指南上有一句话说的是 argumants 是活动对象的第一个成员. 他的初始化应该是先于函数内的其他成员.先于函数栈内所有自定义的成员声明.
// 因此使用变量去作为函数默认值时是检索不到该函数中的变量.
// 需要避免这样的代码, 这会造成一个作用域里同名变量行为不一致的错觉

// 函数作为默认值的时候. 参数函数的作用域是和函数本身是平级的, 没有从属关系. 所以函数内调用参数函数访问的实际上不是内部的 foo
// 函数作为参数默认值时其作用域与所在函数的作用域平行. 但是他的使用域仅仅是所在函数.
// 上述所谓的作用域指的是作用域链.和非 this 的变量寻址.
let foo = '1o';
function bar(fn = () => {console.log('get.'); return foo;}, fn1 = function pafn () {}) {
    let foo = '2o';
    console.log(foo);
    console.log(fn());
}

bar();  // 20 get 1o
console.log(typeof pafn);

// 实际上函数的作用域和其定义域息息相关, 和传递和调用域则没有太大的关系.所以我们本身是很好区分所谓的域.
// 1, 参数函数定义在函数之外. 此时参数函数的作用域一定是函数之外.
// 2. 函数定义在函数内部,此时内部函数的作用域一定是外部函数.
// 3. 情况最特殊的是函数定义出现在默认参数处, 此时参数函数实际上和函数的作用域是平行的.


// 应用
// 必传参数
function throwMissing () {
    // throw new Error('Missng parameter..');
    // throw 'Missng parameter..';
    //
}

(function (ms = throwMissing()) {})();


// rest 参数
// ES6引入rest参数（形式为“...变量名”），用于获取函数的多余参数
// rest 参数会接受剩下的所有参数, 所以 rest 参数一般是最后一个参数, 其后再有参数会抛出一个 error
// length失真.
// rest 参数也可用于实参等的前缀, 此时表示解析. 是一个封装剩余参数的反操作.
// ...这个操作符作用形参和实参, 形参前缀表示聚合, 实参前缀表示分解.
// ...可以将任何实现 iterator 接口的对象转为真正的数组. 对于一些 arraylike 的对象,如果没有实现 iterator 接口的.可以使用 Array.from对其进行数组化
(function (a, ...arg){
    console.log(a, arg);
})(0, ...[1,2,3,4]);


// eg
var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

// ES5的合并数组
let mergeArr = arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6的合并数组
let mergeArr1 = [...arr1, ...arr2, ...arr3];
// [ 'a', 'b', 'c', 'd', 'e' ]”

console.log(mergeArr, mergeArr1);
