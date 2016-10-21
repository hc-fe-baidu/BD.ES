/**
 * Iterator function 将会在将来某个版本被移除掉. 这里讨论的是 Iterator protocol 以及消费 iterator 机制的 for of
 *
 * 由于Iterator只是把接口规格加到数据结构之上，所以，遍历器与它所遍历的那个数据结构，实际上是分开的.
 * 作为 ECMAScript 2015 (ES6)新增加的一部分，它不是新语法或一个新的内置对象，而是一种协议(protocol)。这种协议能被任何遵循某些约定的对象实现。
 * 它们是两类协议：可遍历（可迭代）协议和迭代器协议。
 *
 * js 中很多原生结构是部署了这两种协议的. 你可以使用 for of 方便的做各种遍历操作, 部署方式基本上是:  一个对象必须实现 @@iterator 方法,
 * 意思是这个对象（或者它原型链prototype chain上的某个对象）必须有一个名字是 Symbol.iterator 的属性
 *   [Symbol.iterator] 返回一个对象的无参函数，被返回对象符合迭代器协议.
 * 当一个对象需要被遍历的时候（比如开始用于一个for..of循环中），它的@@iterator方法被调用并且无参数，然后返回一个用于在遍历中获得值的迭代器。
 */

// 可迭代部署接口: Symbol.iterator
const it0 = new Set([1, 2, 3, 4, 5]),
    it0Iterator = it0[Symbol.iterator],
    prop = Object.getOwnPropertyNames(it0Iterator),
    symbol = Object.getOwnPropertySymbols(it0Iterator),
    itRe1 = it0Iterator.call(it0),
    iteratorProp = Object.getOwnPropertyNames(itRe1),
    iteratorSymbol = Object.getOwnPropertyNames(itRe1),
    itRe2 = new Map([['a', 1], ['b', 2]])[Symbol.iterator]();

// 我使用getOwnPropertyNames/getOwnPropertyNames均拿不到 iterator 的 next 操作和其他操作.估计是代理操作
// next 操作是 iterator 的主要操作,当一个对象被认为是一个迭代器时，它实现了一个 next() 的方法并且拥有以下含义
//     返回一个对象的无参函数，被返回对象拥有两个属性：
//     done (boolean)
//      如果迭代器已经经过了被迭代序列时为 true。这时 value 可能描述了该迭代器的返回值。返回值在这里有更多解释。
//      如果迭代器可以产生序列中的下一个值，则为 false。这等效于连同 done 属性也不指定。
//     value - 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。
console.log(prop, symbol, it0Iterator + '', iteratorProp, iteratorSymbol);
console.log(itRe1.next(), itRe1, itRe2);

// 一些迭代器是转换自可迭代对象:
var someArray = [1, 5, 7];
var someArrayEntries = someArray.entries();

someArrayEntries.toString();           // "[object Array Iterator]"
console.log(it0.entries() === someArrayEntries[Symbol.iterator]());    // true


// 可以通过自己的 @@iterator 方法重新定义迭代行为
var someString = new String("hi");          // need to construct a String object explicitly to avoid auto-boxing

someString[Symbol.iterator] = function() {
  return { // this is the iterator object, returning a single element, the string "bye"
    next: function() {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};
console.log([...someString], someString);


// 可迭代
// 凡事部署了 iterator 的数据解构都是可以被 ... 分解的.
// 可以接合生成器函数.也可以使用生成器最为初始化函数
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
console.log([...myIterable]); // [1, 2, 3]

new WeakSet(function*() {
    yield {};
    yield myIterable;
    yield {};
}()).has(myIterable);                                         // true

// 生成器式的迭代器
function* Fb(n = true) {
    let x = 0,
        y = 1;

    while(n) {
        // 两俩返回
        // [x, y] = [x + y, x + y + x];
        // yield [x, y];
        [x, y] = [y, x + y];
        yield [x];
    }
}

const fb = Fb();
let fbArray = [], n = 10;
while(n > 0) {
    // n -= 2;
    n -= 1;
    fbArray.push(...fb.next().value);
}

console.log(fbArray);

/**
 * iterator function (注意只是 iterator function. 改操作在未来将会被废弃) polyfill
 *
 * function makeIterator(array) {
 *    var nextIndex = 0;
 *    return {
 *      next: function() {
 *        return nextIndex < array.length ?
 *          {value: array[nextIndex++]} :
 *          {done: true};
 *      }
 *    };
 *  }
 */
class  Iterator {
    constructor(array) {
        this.array = array;
        this.cur = 0;
    }

    next() {
        const array = this.array;
        return this.cur < array.length ? {
            value: array[this.cur ++]
        } : {
            done: true
        };
    }

    // ... 的接口实现
    [Symbol.iterator]() {
        return this;

        // 更明确的返回指向
        // const next = this.next.bind(this);
        // return {
        //     next
        // };
    }
}

const iter = new Iterator([1, 2, 3, 4]);
const iterBak = new Iterator([1, 2, 3, 4]);

const [it1, it2, it3, it4, it5] = [iter.next(), iter.next(), iter.next(), iter.next(), iter.next()];
console.log(it1, it2, it3, it4, it5);

console.log(iterBak, ' by ... : ', [...iterBak]);


// 非迭代对象部署 iterator
// 部署迭代接口主要实现[Symbol.iterator]. 上面有不少实现.一般来说数据结构不同, 迭代规则不同
// 反过来如果数据类似其实就可以利用现有的迭代接口, 比如类数组对象
// [Symbol.iterator] 是 for of. yield* 和 ... 的内置服务, 解构可能也会用到
// Symbol.iterator 可能会返回一个包含 next 的对象, 这时候可以使用 while 进行方便的迭代.
const arrayLike = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
};

for (let item of arrayLike) {
    console.log(item);
}

console.log(typeof arrayLike.next, ...arrayLike);


// iterator  and  generator
let gen = {
    * [Symbol.iterator]() {
        yield  {
            a: 'a',
            b: 'b'
        };
    }
}

for (let item of gen) {
    console.log(item);
}


// 迭代器除了 next 还有两个操作: return . throw
// return : 如果异常推出 for of, 就会进入 return. 可以用作释放资源
// throw: 配合生成器使用, 场景不常见


// 几种遍历操作的横向比较
// for: 简单但麻烦
// foreach: 不能处理 break 和 return
// for in:
//      1. 数组的键是数字, 但是 for in 的结果是以字符串为键
//      2. for in可遍历的属性没有限制, 包括动态添加和原型链上的属性都拿的到.
//      3. 遍历顺序不是线性的
//   for in 更适合对象的遍历
// for of:
//      1. 和 for in 不同, of 仅仅关心结构里存储的数据, 更适合数据结构的迭代
//      2. break/ continue/ return 均能配合
//      3. 提供迭代任何数据类型的统一接口. 并非针对特定类型,而是针对 iterator 接口
