
/**
 * http://www.cnblogs.com/pigtail/p/3447660.html
 *
 * 在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
 * 这个技术由 Christopher Strachey 以逻辑学家哈斯凯尔·加里命名的，尽管它是 Moses Schönfinkel 和 Gottlob Frege 发明的。
 *
 * 这是来自维基百科的名词解释。顾名思义，柯里化其实本身是固定一个可以预期的参数，并返回一个特定的函数，处理批特定的需求。这增加了函数的适用性，但同时也降低了函数的适用范围。
 *
 * 看一下通用实现：
 *
 * function currying(fn) {
 *      var slice = Array.prototype.slice,
 *      __args = slice.call(arguments, 1);
 *      return function () {
 *          var __inargs = slice.call(arguments);
 *          return fn.apply(null, __args.concat(__inargs));
 *      };
 *  }
 *
 */

import $ from 'jquery';

/**
 * 1 提高适用性。
 * 【通用函数】解决了兼容性问题，但同时也会再来，使用的不便利性，不同的应用场景往，要传递很多参数，以达到解决特定问题的目的。有时候应用中，同一种规则可能会反复使用，这就可能会造成代码的重复性。
 */
function square(i) {
    return i * i ;
}

function  dubble(i) {
    return i *=  2;
}

function map(fn, list) {
    return list.map(fn);
}

/**
 * 例子中，创建了一个map通用函数，用于适应不同的应用场景。显然，通用性不用怀疑。同时，例子中重复传入了相同的处理函数：square和dubble。
 *
 * 应用中这种可能会更多。当然，通用性的增强必然带来适用性的减弱。但是，我们依然可以在中间找到一种平衡。
 *
 */
debugger;

var arrayData = [1,2,3,4,5],
    squareData = map(square, arrayData),
    dubbleData = map(dubble, arrayData);

console.log(arrayData, 'to > ', squareData, dubbleData);

console.log('\n-------------------------------------------------------currying-------------------------------------------------------\n');

// 看下面，我们利用柯里化改造一下：

function currying (fn) {
    var slice = Array.prototype.slice,
        _args = slice.call(arguments, 1);

    return function () {
        var _inargs = slice.call(arguments);
        return fn.apply(this, _args.concat(_inargs));
    }
}

// 科里化
var mapSQ = currying(map, square),
    mapSQData = mapSQ(arrayData);

var mapDB = currying(map, dubble),
    mapDBData = mapDB(arrayData);

console.log(arrayData, 'currying to > ', mapSQData, mapDBData);

// console.log('\n-------------------------------------------------------currying-------------------------------------------------------\n');


/**
 * 由此，可知柯里化不仅仅是提高了代码的合理性，更重的它突出一种思想---降低适用范围，提高适用性。
 *
 * 下面再看一个例子，一个应用范围更广泛更熟悉的例子：[见/demo02]
 */
