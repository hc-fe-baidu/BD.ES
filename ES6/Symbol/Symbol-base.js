/**
 * symbol: 是一种特殊的、不可变的数据类型，可以作为对象属性的标识符使用。符号对象是一个符号 原始数据类型的隐式对象包装器。
 * Symbol是 js 中的第七种数据类型.
 * Symbol 值通过 Symbol 函数生成, Symbol 可以保证生成的变量名都是独一无二的
 *
 */

// symbol 新的数据类型, 可以接受任何类型.
// symbol值 不是对象,不是函数模板不能 new, 也不能和其他类型进行计算.但可以转换成 bool 值
let sy = Symbol(null);

// new Symbol();            // TypeError: Symbol is not a constructor
// sy + 1;                  // TypeError: Cannot convert a Symbol value to a numbe / a string
// `this is ${sy}`;         // TypeError: Cannot convert a Symbol value to a string

// symbol 也和普通基础类型一样通过包装类的到 object 基本操作.
sy.toString();

console.log(typeof sy, sy, !sy, sy || true);

// Symbol函数前不能使用new命令，否则会报错。这是因为生成的Symbol是一个原始类型的值，不是对象。也就是说，由于Symbol值不是对象，所以不能添加属性。
// 基本上，它是一种类似于字符串的数据类型。Symbol函数可以接受一个字符串作为参数，表示对Symbol实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
// symbol 函数的参数只是对当前 symbol 值的描述, 和 symbol 值无关, symbol 值总是不相同的,所以会存在相同参数的 symbol 值不相等
let sy1 = Symbol(),
    sy2 = Symbol(),
    sy3 = Symbol(false),
    sy4 = Symbol(false),
    sy5 = Symbol(undefined),
    sy6 = Symbol(undefined),
    sy7 = Symbol(Function),
    sy8 = Symbol(Function);
console.log(sy1 === sy2, sy3 == sy4, sy5 === sy6, sy7 == sy8);


// symbol 值作为属性
// symbol 不是字符串, 不能使用点操作, 需要放在中括号里. 进行属性名计算.
let syObj = {
    // 方式1
    [sy1]: 1,
    [sy2](n) {
        console.log(this[sy3] + n);
    }
};

// 方式2
syObj[sy3] = 10;

// 方式3
Object.defineProperties(syObj, sy4, {
    value: 100
});

// symbol 属性不能使用点的方式赋值和访问. 直接点操作相当于普通属性.
syObj.sy3 = 1010;
console.log(syObj.sy3, syObj[sy3], syObj['sy3']);

// symbol 值作为属性名时该属性为公开属性
// symbol 属性不会出现在普通的 each 中, 比如常见的 for in/of / keys / getOwnPropertyNames.等 但不代表 symbol 是私有的. symbol 是公开属性.
// symbol 属性不可枚举,不可被普通方法获取. object 有个getOwnPropertySymbols可以获取对象的 symbol 属性.
let allSymbol = Object.getOwnPropertySymbols(syObj);
console.log(Object.getOwnPropertyNames(syObj), allSymbol);

// 使用 for in 得不到 symbol 属性, 使用 for of 抛出异常: TypeError: syObj[Symbol.iterator] is not a function
// for(let item of syObj) {
//     console.log(item, syObj[item]);
// }

// 能够通过 symbol 集合的数组去拿到 symbol 属性的值
for (const item of allSymbol) {
    console.log(item, syObj[item], syObj.item);
}

syObj[allSymbol[1]](20);

// 新增加操作可获得 symbol 属性: ownKeys
for (const item of Reflect.ownKeys(syObj)) {
    console.log(item, syObj[item]);
}

// 由于以Symbol值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法. 等价于定义变量时候设置不可枚举.
// 由于 symbol 的值可以保证唯一性, 所以作为枚举值, switch-case捕获值非常适合.能够保证正确性


// 创建等价 symbol
// 使用 symbol.for 进行 symbol 值创建时,他会以传入参数检索有没有已创建了的 symbol 值, 如果有则返回, 没有则新建.
// symbol.for 只会在 for 创建的 symbol 值中检索.不会和普通 symbol 进行匹配.
const sy9 = Symbol.for('foos'),
    sy10 = Symbol.for('foos'),
    sy11 = Symbol('foos');

console.log(sy9 === sy10, sy10, sy11, sy10 === sy11);

// Symbol.for()与Symbol()这两种写法，都会生成新的Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。
// Symbol.for()不会每次调用就返回一个新的Symbol类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值

// 使用 keyFor可以获取已登记的 symbol 值的key
const sy12 = Symbol('f');
console.log(Symbol.keyFor(sy9), Symbol.keyFor(sy12));


// 内置 symbol 可参考<<ES62 阮一峰 p337 - p350>>.
