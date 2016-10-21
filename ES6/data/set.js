/**
 * js 喜迎复杂的数据结构: set map, 鼓掌..
 *
 * 集合（Set）对象允许你存储任意类型的唯一值（不能重复），无论它是原始值或者是对象引用。
 * set接受一个可迭代对象, new Set([iterable]);
 * Set对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set中的元素只会出现一次，即 Set 中的元素是唯一的。
 */

const set1 = new Set(Array.from({'0': 1, '1': 2, '2': 2, size: 3}));

[1, 2, 3, 4, 5, 6, 4, 5, 6].map((item) => set1.add(item));
console.log(set1, set1.size);      //size : 6 .  会忽略重复的值

// set 是可以分解的结构, 可以利用 ... 分解的特性过滤数组重复的值[扩展运算符（...）内部使用for...of循环，所以也可以用于Set结构]
// set 可以存储任何类型
// set 的去重并非简单的全等 === 判断.
// +0 和 -0视为相同的.NaN === NaN返回  false. 但在集合中视为相等的. 并非 object.is, 此函数认为+0 和 -0 不相等.
// set 的去重比较使用的是 Same-value equality 的算法, 和 === 的区别在于 NaN 的比较规则.
const arr1 = [...set1],
    arr2 = [...new Set([0, +0, -0, 'true', true, !0, null, undefined, {}, {}, [], [], Date, Date])];

console.log(arr1, arr2, +0 === 0, NaN === NaN);

// set 操作
// add 会返回 set 本身, 所以看起来就比较像链式操作
let re1 = set1.add({}).add([]).has(2);

console.log(set1, re1);

// each 中不能直接改变 set 自身
// v++并不能使得 set 元素在 each 中发生改变. 同样你也拿不到他在 set 中的位置或者其他的.
set1.forEach((v, k, set) => v++ );
console.log(set1);

// 可以通过数组化进行解决
// 方法一
let set2 = new Set([1, 2, 3]);
set2 = new Set([...set2].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set3 = new Set([1, 2, 3]);
set3 = new Set(Array.from(set3, val => val * 2));
// set的值是2, 4, 6


// set 应用
// 1. 集合操作
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);  // [1, 2, 3, 4]
// 交集
let intersect = new Set([...a].filter(x => b.has(x)));  // [2, 3]
// 差集
let difference = new Set([...a].filter(x => !b.has(x)));    // [1]
console.log(union, intersect, difference);



// WeakSet
// 一个 WeakSet 对象是一个无序的集合, 可以用它来存储任意的对象值, 并且对这些对象值保持弱引用.
// 1. 只存储对象
// 2. 弱引用, 不能作为有效引用, 回收机制有效. 因此 weakset 是不可遍历的.
const ws1 = new WeakSet();
// ws1.add(1);             // TypeError: Invalid value used in weak set
ws1.add(new Date())

// 它和 Set 对象的区别有两点:
// WeakSet 对象中只能存放对象值, 不能存放原始值, 而 Set 对象都可以.
// WeakSet 对象中存储的对象值都是被弱引用的, 如果没有其他的变量或属性引用这个对象值, 则这个对象值会被当成垃圾回收掉. 正因为这样, WeakSet 对象是无法被枚举的, 没有办法拿到它包含的所有元素.
// WeakSet 和 set 非常类似
