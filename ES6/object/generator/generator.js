/**
 * api: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator
 * 生成器对象是由一个生成器函数 generator function 返回的。并且它是同时遵守 The iterable protocol 可遍历协议
 * 和The iterator protocol 迭代器模式协议.
 *
 * generator对象包含三个操作: next, retuen , throw. 这三个操作和 iterator 完全符合.
 *
 * 生成器对象依赖于生成器函数, 生成器函数使用*后缀 function 来声明.
 * function* 声明（function关键字后跟一个星号）定义一个generator（生成器）函数，返回一个Generator对象。
 *      function* name([param[, param[, ... param]]]) { statements }
 * Generators are functions which can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances.
 * 这句话很那理解,大致是说: 生成器函数可以保持一个执行的环境, 以便你推出后在进入能够延续上次的状态继续执行.
 *
 * 调用一个生成器函数并不会立马执行他的函数体, 会返回一个 iterator 对象, 当调用这个对象的 next 方法时,生成器函数会执行到第一个 yield 表达式, 该表达式
 * 定义了迭代器的返回值, 当然也可能是一个委托生成器 yield* 的形式,也是同理.
 * next() 会返回一个包含 value 和 done 的对象, value 表示当前 yield 计算值, done 描述该 yield 是否是生成器的最后一个 yield.
 *
 *  实际上生成器的概念是异步编程的一个细化概念: 延迟操作. 也可以认为是一个状态机的不连续迭代过程.
 */
function* anotherGenerator(i) {
    yield i + 1;
    yield i + 2;
}

function* generator(i) {
    yield i;
    yield* anotherGenerator(i);
    yield i + 10;
    // return undefined.
    yield;
}

const gen = generator(10);

console.log(gen.next()); // 10
console.log(gen.next()); // 11
console.log(gen.next()); // 12
console.log(gen.next()); // 20
console.log(gen.next()); // undefined false
console.log(gen.next()); // true

// 使用参数调用
// Calling the next() method with an argument will resume the generator function execution,
// replacing the yield statement where execution was paused with the argument from next().
// 使用参数调用生成器将会重置执行环境.参数将会在执行停止的地方替换掉 yield 表达式的值
function* logGenerator() {
  console.log(yield);
  console.log(yield);
  console.log(yield);
}

var gen1 = logGenerator();

// the first call of next executes from the start of the function
// until the first yield statement
gen1.next();
gen1.next('pretzel'); // pretzel
gen1.next('california'); // california
gen1.next('mayonnaise'); // mayonnaise
gen1.next('sb'); // nothing


// new 一个生成器将会报错
function* f() {}
// var obj = new f; // throws "TypeError: f is not a constructor"


// 注意点
// ES6 并没有规定*的位置. 因此我们会有多重写法
// airbnb 的的规范是*紧贴 function. 也就是最后一中写法.
function * f1() {}
function *f2() {}
function*f3() {}
function* f4() {}


// 为什么说 generator 是一种异步机制呢?
// generator 返回的遍历起对象只有调用 next 才能进入下个内部状态.可以认为是一种可暂停的函数执行机制.或者延迟执行.
//  调用 next 时进入生成器函数执行,执行中当遇到 yield 时, 暂停执行后续操作, 并返回 yield 表达式的值.作为 value 的值.如此往复next下去,直到最后一个 yield 后面的 return 为止.
// yield 是惰性求值
// yield 和 return 紧随其后的表达式的值都能被返回(yield 没有返回, 其他机制返回的), 区别在于 yield 会暂停函数执行,跳出函数,并记录执行状态. 而 return 不具备记忆状态
// 生成器函数可以返回一组值,最终以 return 为结束点
// yield 不能出现在普通函数里面, 包含回调,剪头函数等等形式的普通函数中.
// yield 没有返回, 他会提供给 next, next 包装之后返回 value.
function* fn1() {
    for (let i = 0; true; i += 1) {
        console.log('before yield : ', i);
        const reset = yield i;
        console.log('after yield: ', i, reset);
    }
}

const g = fn1();
// 可以印证: yield 操作符没有返回值, 挥着返回 undefined .
// 生成器函数遇到 yield 就暂停执行
// n4 call 的输出里面 reset 的值就是传入的参数.也就是上面说的使用参数调用时, 该参数会被当做上一次 yield 语句的返回值. 体会一下
// Calling the next() method with an argument will resume the generator function execution,
// replacing the yield statement where execution was paused with the argument from next().
const [n1, n2, n3, n4, n5] = [(console.log('n1 call'), g.next()),  (console.log('n2 call'), g.next()),
        (console.log('n3 call'), g.next()), (console.log('n4 call'), g.next(100)), (console.log('n5 call'), g.next())];
console.log(n1, n2, n3, n4, n5);


// generator 函数从暂停回复运行时,他对应的上下文是不变的, next 参数提供了一种在 generator 函数运行的不同阶段从外部注入不同的值从而调整函数行为的方式.
// next 参数替换的是 yield 表达式的值
function* fooFn(x) {
    const y = 2 * (yield (x + 1));
    let z = yield (y / 3);
    return (x + y + z);
}

const fooGen = fooFn(1);
// 一定要记得 next 参数替换的是 yield 的值 和 next 遇到 yield 就直接停止执行.
// 第一次 next 没有参数,计算的是 yield (1 + 1), 结果是2
// 第二次 next 参数: 9, 替换的是 yield (x + 1), 所以此时 y = 2 * 9 . 然后 yield (y/ 3) 得到6.
// 第三次 next 参数: 1, 替换 yield (y / 3), z = 1. 1 + 18 + 1 = 20
const [foo1, foo2, foo3, foo4] = [fooGen.next(), fooGen.next(9), fooGen.next(1), fooGen.next()];
console.log(foo1, foo2, foo3, foo4);

// 如果需要第一次也传入参数切生效可以使用一个函数包裹一层, 直接调用一次 next(). 然后返回结果.
// yield 允许单独存在, 此时替换规则依旧是替换 yield.
function* dataConsumer() {
    console.log('Started');
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
    return 'result';
}

const genObj = dataConsumer();
genObj.next();// Started
// 传入的参数直接替换掉 yield
genObj.next('a');// 1. a
genObj.next('b');// 2. b


// fb
function* fb() {
    let [x, y] = [1, 1];
    while(true) {
        yield [x, y];
        [x, y] = [x + y, x + y + y];
    }
}

const fgen = fb();
const fbre = [...fgen.next().value, ...fgen.next().value, ...fgen.next().value, ...fgen.next().value, ...fgen.next().value];
console.log(fbre);

// 生成器函数返回一个部署了 iterator 的接口, 则此时我们可以直接进行各种遍历. 不必考虑去实现 symbol.literator
// 实际上下述 generator 函数可在任何对象上部署 iterator 接口
function * objectEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);

    for (const propKey of propKeys) {
        yield [propKey, obj[propKey]];
    }
}

let jane = {
    first: 'Jane',
    last: 'Doe'
};

for (let [key, value]of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}

// 当然你也可以将对象的迭代器接口指向该生成器.就可以直接 of jane 这个对象了. 当然生成器航速不需要参数了, key 从 this 获取即可: Reflect.ownKeys(this)
jane[Symbol.iterator] = objectEntries;


// Generator.prototype.throw : 生成器独立的异常捕获, 参考: p554 - 564

// Generator.prototype.return
// 调用 return 则返回值的 value 就是 return 传入的参数, 没传则表示传入 undefined. 并且此时生成器终止执行.
// 如果生成器内有 finally 则一定是先将 finally 执行结束才会执行 return.


// yield and yield*
// yield [[expression]]; 就是说 yield 可以独立存在, 他描述的表达式是可选的.
// yield 使生成器函数暂停执行，并把跟在它后面的表达式的值提供给 iterator next. 可以把它想成是 return 关键字的一个基于生成器的版本.
// yield 实际返回一个对象，包含两个属性, value 和 done.value 属性为 yield expression 的值,  done 是一个布尔值用来指示生成器函数是否已经全部完成.
// 一旦在 yield expression 处暂停,  除非外部调用生成器的 next() 方法，否则生成器的代码将不能继续执行. 这使得可以对生成器的执行以及渐进式的返回值进行直接控制.

// yield* 可以把需要 yield 的值委托给另外一个生成器或者其他任意的可迭代对象。
// yield* 表达式本身的值就是当前可迭代对象迭代完毕（当done为true时）时的返回值。
// 如下的 yield * g1(); 就等价于 g1 里面的所有 yield 的成员.
// yield* 本质是一个表达式,而不是语句, 所以他是有字面量的.
// 在 yield 和 * 之间不允许有换行
// yield* 后缀一个实现 iterator 接口的数据结构均可.
function* g1() {
    yield 2;
    yield 3;
    yield* [4, 5, 6];
    return 'value of yield*';
}

function* g2() {
    yield 1;
    const yie = yield* g1();
    // yield* 是表达式, 有字面两.
    console.log(yie);
    yield* '78';
}
console.log(...g2());   // 1 2 3 4 5 6 '7' '8'


// each 多层结构. 将数组平面化
function* iteratorTree(tree) {
    if (Array.isArray(tree)) {
        for (const item of tree) {
            yield* iteratorTree(item);
        }
    } else {
        yield tree;
    }
}
const arrays = [1, [2, 3, [40, 5], 6], [7, 8], 9, 10]
console.log(...iteratorTree(arrays));


// 二叉树
class Tree {
    constructor(cur, L = null, R = null) {
        this.cur = cur;
        this.L = L;
        this.R = R;
    }

    /**
     * 生成二叉树的递归算法
     * 算法设计:
     *  我们从根节点开始假设有 n 层, 每个节点有两个子节点构成. 则 t(n) = t(n-1).L + t(n-1).R 构成. 于是得出基本递归解构
     *      root.L = Tree.genBinary(n - 1);
     *      root.R = Tree.genBinary(n - 1);
     *
     * @type {String}
     */
    static genBinary(n, perLoc = 'Root', root = new Tree(`${n}-Cu-Parent.${perLoc}`)) {
        Tree.applyAccount ++;
        if (n <= 1) {
            return new Tree(`${n}-Cu-Parent.${perLoc}`);
        }

        // 怎么尾递归优化?
        root.L = Tree.genBinary(n - 1, 'L');
        root.R = Tree.genBinary(n - 1, 'R');

        return root;
    }
    // 使用生成器遍历二叉树
    // 生成器函数也支持短函数, 并且可以配合 static 等关键词
    static* iteratorBinaryTree(t) {
        if (t) {
            yield t.cur;
            yield* Tree.iteratorBinaryTree(t.L);
            yield* Tree.iteratorBinaryTree(t.R);
        }
    }

}
Tree.applyAccount = 0;

const binaryTree = Tree.genBinary(5);
console.log(binaryTree);
// console.log(binaryTree.R.L)
// console.log(binaryTree.R.R);
console.log(`递归调用 count: ${Tree.applyAccount}`);

// 深度优先的遍历方式
console.log([...Tree.iteratorBinaryTree(binaryTree)].join('\n'));


// generator 在 this/new 的操作
// generator 返回一个 iterator 对象, 并继承了遍历器函数的原型. 但是并没有返回遍历起自身的 this.
// 因此遍历起函数能够使用到原型的值.但是拿不到 this 对象.
// new 操作导致出错.
function* ge() {
    this.op = 'ge op';
}
ge.prototype = {
    genName: 'function* ge'
};

const geObj = ge();
console.log(geObj.genName, geObj.op);

// 如果一定要使用 this, 并生效呢
// 可以利用 prototype
function* Ge() {
    yield this.a = 10;
    yield b = 20;
}

let GeObj = Ge.call(Ge.prototype);
console.log(GeObj.next(), GeObj.next(), GeObj.a);

// 如果一定要 new 呢?
// 使用代理
// new Ge();       // TypeError: Ge is not a constructor
function ProxyGe() {
    return Ge.call(Ge.prototype);
}

GeObj = new ProxyGe();
console.log(GeObj.next(), GeObj.next(), GeObj.a);


// 场景
// 1. 状态机 [每次执行切换不用状态, 状态可以循环] . 注意控制,否则执行最后一个状态时将会额外执行第一个状态
function* clock() {
    while(true) {
        setTimeout(function () {
            console.log('s0');
        }, 3000);
        yield;
        console.log('s1');
        // 这种状态机不做控制的话,将会导致执行第二个状态时, 会再执行一次状态1, 因为他会一直行到遇到下个 yield.
        yield;
    }
}

// 2. 异步状态
const clockG = clock();
clockG.next();
clockG.next();


//  请注意不同的 yield 之间执行是异步的. 互不等待的状态
function fn2(){
    setTimeout(function () {
        console.log('fn2');
    }, 2000);
}

function fn3(){
    setTimeout(function () {
        console.log('fn3');
    }, 1000);
}

function* sync(){
    const resp1 = yield fn2();
    const resp2 = yield fn3(resp1);
    return resp2
}

const syncFn = sync();
syncFn.next();
syncFn.next();
