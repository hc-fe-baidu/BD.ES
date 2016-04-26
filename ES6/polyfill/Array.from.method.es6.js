Array.froms = (function() {
    // 用于判断函数类型. eg: toStr.call(fn) === '[object Function]';
    var toStr = Object.prototype.toString;
    var isCallable = function(fn) {
        // 有些浏览器会将函数的typeof识别成object,比如safari低版本,ff似乎有一个版本也会出这个问题.
        // toStr.call(fn) === '[object Function]'是比较靠谱的,但是也有极少数浏览器返回的是'[object Function]'.尽管他们的实现中function依旧是来源于Function
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function(value) {
        var number = Number(value);
        if (isNaN(number)) {
            return 0;
        }
        // /用来检查一个数值是否非无穷（infinity）
        if (number === 0 || !isFinite(number)) {
            return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function(value) {
        var len = toInteger(value);
        // 0 到 Math.pow(2, 53) - 1 之间
        return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */ ) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        // 家一个对象外壳包装,如果本身是对象则返回这个值本身,如果是null/undefined则返回空对象.基础类型得到包装类: 官方解释如下
        // The Object constructor creates an object wrapper for the given value. If the value is null or undefined, it will create and return an empty object,
        // otherwise, it will return an object of a Type that corresponds to the given value. If the value is an object already, it will return the value.
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
            throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
            // 5. else
            // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
            if (!isCallable(mapFn)) {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
            }

            // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 2) {
                T = arguments[2];
            }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        // 所谓的类数组对象就是有length
        var len = toLength(items.length);
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        // 在这里this就是这个from的调用者Array.可以使用C.isArray([1,2,3])来判断.
        // Object(new C(len)): 创建一个数组然后包装一个对象外壳,其实本身是对象类型的话返回其本身
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
            kValue = items[k];
            if (mapFn) {
                A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
                A[k] = kValue;
            }
            k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
    };
}());

// 不要在剪头函数中使用this.babel将其编译为undefined
// let genArrays = Array.froms({length: 6}, (value, index) => {
//     return this.pow(index, index);
//     // return index ** index
// }, Math);

// polyfill , by ES5
var genArray = Array.froms({length: 6}, function (value, index) {
    return this.pow(index, index);
}, Math);

// ES6 Array.from
var genArrays = Array.from({length: 6}, function (value, index) {
    return index ** index;
}, Math);

console.log(genArray, genArrays);   //[ 1, 1, 4, 27, 256, 3125 ] [ 1, 1, 4, 27, 256, 3125 ]

// 基本类型
Array.froms(1);   // []
