/**
 * Map对象就是简单的键/值映射。其中键和值可以是任意值(对象或者原始值)。
 * api: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map
 * map 的键可以是任何值. 这一点非常 bug. 但也意味着更加复杂.
 *
 * 实际上你可能会怀疑 js 中 map 存在的必要性, 实际上我们常用的 object 其实就是一种键值对的形式, 他已经相当丰富了. map 和 object 的区别是什么呢?
 * Object结构提供了“字符串—值”的对应，Map结构提供了“值—值”的对应，是一种更完善的Hash结构实现。如果你需要“键值对”的数据结构，Map比Object更合适。
 * 实际上也并没有任何迹象表明 object 不满足需求而催生了 map, 事实上你需要明白 map 是一个数据结构, object 是一个功能结构. 你需要一些标准去判断到底是用那个
 *    在运行之前 key 是否是未知的，是否需要动态地查询 key 呢？
 *    是否所有的值都是统一类型，这些值可以互换么？
 *    是否需要不是字符串类型的 key ？
 *    键值对经常增加或者删除么？
 *    是否有任意个且非常容易改变的键值对?
 *    这个集合可以遍历么(Is the collection iterated)?
 * 如果上述问题是'yse' 的话, 你可以考虑使用 map 保存这个集合.相反，你有固定数目的键值对，独立操作它们，区分它们的用法，那么你需要的是对象。
 *
 *
 * map 的键是不重复的. 累死 set , map 的键的重复判定策略也是基于 'same-value' 算法：NaN 是与 NaN 相同的（虽然 NaN !== NaN），剩下所有其它的值是根据 === 运算符的结果判断是否相等
 *
 */

var myMap = new Map();

var keyObj = {},
    keyFunc = function () {},
    keyString = 'a string';

// 添加键
myMap.set(keyString, '和键\'a string\'关联的值');
myMap.set(keyObj, '和键keyObj关联的值');
myMap.set(keyFunc, '和键keyFunc关联的值');

myMap.size; // 3

// 读取值
myMap.get(keyString);    // '和键'a string'关联的值'
myMap.get(keyObj);       // '和键keyObj关联的值'
myMap.get(keyFunc);      // '和键keyFunc关联的值'

myMap.get('a string');   // '和键'a string'关联的值'
                         // 因为keyString === 'a string'
myMap.get({});           // undefined, 因为keyObj !== {}
myMap.get(function() {}) // undefined, 因为keyFunc !== function () {}

// 虽然 NaN 和任何值甚至和自己都不相等(NaN !== NaN 返回true) , 但作为键是等价的
var myMap = new Map();
myMap.set(NaN, 'not a number');

myMap.get(NaN); // 'not a number'

var otherNaN = Number('foo');
myMap.get(otherNaN); // 'not a number'


// map <===> array
// map 的结构类似于一个二维结构: [[1, 'one'], [2, 'two']], 因此数组可以转化为 map
// 因为 map 的构造接受的 Iterable 是一个数组（2元数组）或者可遍历的且其元素是键值对的对象。
// 如果数组每一项不等于两个属性时出现以下状态:
//  1. 无参数: [] , 表明键值都是 undefined, 得到的是: undefined => undefined.
//  2. 一个参数: 值是 undefined.
//  3.多余两个参数会忽略多余的部分
//  4. 覆盖原则
// 上述语法在声明时有效, 不适用于 set 函数. set 不会去分解数组结构他直接收两个参数
//  set([[]])   =>      [[]] => undefined
// 他的键可以是任何值.包括无效值, map 的键是有类型的, 并且会保留类型, 比如: [[1,3], ['', 4]]. 得到的是 1 => 3, ''=>4
//
// undefined 和 typeof a 不同, 后者返回的是'undefined' , 是一个 string.
// array ==> map
const map1 = new Map([ [1, 'one', 'last'], ['t \'w\' o'], ['', 'three'], [undefined, 'four']]);
// 链式操作
map1.set(null, 'some').set('no key').set([[]]).set(['p', 'q']);
// undefined 对应的值为 four. 在这里使用 map1.set() 表示设置一个键值均为 undefined 的成员.
// 但是如下代码执行之后会有非常奇怪的现象:
//    首先输出先是 map1对象: map{... undefined => undefined, ....}
//    然后是 get(undefined) ,结果是 four.
//    接着set 空(set() )来设置 undefined 的值也为 undefined
//    然后输出 get(undefined) 结果: undefined.
// 问题来了: 为什么第一次输出的 map1 中 undefined 的值是 undefined, 理应是 four 啊. 而且随后输出get(undefined) 结果是 four. 不就矛盾了么
// 其实很简单. 这是 log 函数的执行方式,而并非 map 的问题. 我们稍加验证
// var a = {b: 1, c: 2};console.log(a, a.b, (a.b = 3, a.b)); // {b: 3, c: 2} 1 3  的结果和上述描述如出一辙
//    log 函数会计算出每个参数的值, 然后去输出他们. 首先 a 的值是一个对象的地址, a.b 的值是1, 因为是简单类型.然后set()进行设置,并访问 a.b
//    此时真实的内存中 a.b 已经发生改变了. 然后输出,输出的时候会调用 tostring 等一类的方法. 此时 a 会依据内存地址去将对象转成 string. 因此是
//    set() 之后的结果. 但是第二个 a.b 并不是地址,他已经是1了.所以就出现很奇怪的结果
console.log(map1, map1.get(undefined), map1.get(typeof age), (map1.set(), map1.get(undefined)));

// map ==> array
// 接合...操作符
const array1 = [...map1];
console.log(Array.isArray(array1), array1);


// 类似对象的操作可以使用 for of 结合解构去遍历 map.
const map2 = new Map();
map2.set(0, "zero").set(1, "one");
for (var [key, value] of map2) {
    console.log(key + " = " + value);
}


// weakMap
// WeakMap 对象是键/值对的集合，且其中的键是弱引用的。其键只能是对象，而值则可以是任意的。
// WeakMap 的 key 只能是对象类型。 原始数据类型 是不能作为 key 的（比如 Symbol）。

// Why WeakMap?

// 经验丰富的 JavaScript 程序员会注意到，WeakMap 完全可以通过两个数组(一个存放键,一个存放值)来实现。但这样的实现会有两个很大的缺点，
// 首先是O(n)的时间复杂度(n是键值对的个数)。另外一个则可能会导致内存泄漏:在这种自己实现的 WeakMap 中,存放键的数组中的每个索引将会保持
// 对所引用对象的引用,阻止他们被当作垃圾回收.而在原生的WeakMap中,每个键对自己所引用对象的引用是 "弱引用", 这意味着,如果没有其他引用和该
// 键引用同一个对象,这个对象将会被当作垃圾回收.

// 正由于这样的弱引用，WeakMap 的 key 是非枚举的 (没有方法能给出所有的 key)。如果key 是可枚举的话，其列表将会受垃圾回收机制的影响，
// 从而得到不确定的结果. 因此,如果你想要这种类型对象的 key 值的列表，你应该使用 Map。
