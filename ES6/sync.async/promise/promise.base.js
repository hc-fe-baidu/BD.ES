/**
 * promise: [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise]
 * 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。
 * promise 提供统一的 api 以便各种异步操作都可以用同样的方法进行处理.
 *
 * new Promise(executor);
 * new Promise(function(resolve, reject) { ... });
 *  executor: 带有 resolve 、reject两个参数的一个函数。这个函数在创建Promise对象的时候会立即得到执行（在Promise构造函数返回Promise对象之前就会被执行）
 *  ，并把成功回调函数（resolve）和失败回调函数（reject）作为参数传递进来。调用成功回调函数（resolve）和失败回调函数（reject）会分别触发
 *  promise的成功或失败。
 *  executor: 这个函数通常被用来执行一些异步操作，操作完成以后可以选择调用成功回调函数（resolve）来触发promise的成功状态，
 *  或者，在出现错误的时候调用失败回调函数（reject）来触发promise的失败。
 *
 * Promise 对象是一个返回值的代理，这个返回值在promise对象创建时未必已知。它允许你为异步操作的成功返回值或失败信息指定处理方法。 这使得异步方法可以像同步
 * 方法那样返回值：异步方法会返回一个包含了原返回值的 promise 对象来替代原返回值。
 * Promise对象有以下几种状态:
 *  pending: 初始状态, 既不是 fulfilled 也不是 rejected.
 *  fulfilled: 成功的操作.
 *  rejected: 失败的操作.
 * pending 状态的 promise 对象既可转换为带着一个成功值的 fulfilled 状态，也可变为带着一个失败信息的 rejected 状态。当状态发生转换时,promise.then / catch
 * 绑定的方法（函数句柄）就会被调用。(当绑定方法时，如果 promise对象已经处于 fulfilled 或 rejected 状态，那么相应的方法将会被立刻调用，
 * 所以在异步操作的完成情况和它的绑定方法之间不存在竞争条件。) promise 状态的特点如下:
 *  1. promise 中文为承诺,她的状态不受外界影响, 只有异步操作的结果可以决定当前是那种状态.以及转换.
 *  2. promise 的状态变化不可逆, 变化方式只有从 pending 到 resolve 或者 reject 两种, 一般变化这个结果会保持,即便这个改变已经发生,
 *      你继续给 promise 对象中添加回调函数,也会立即得到这个结果,[事件机制不同,如果错过监听再添加监听函数是没法得到上次的结果的.]
 * promise 尽管提供了异步操作同步化的表达方式,但也存在一些问题
 *  1. 一旦新建 promise 对象,提供的函数会立即执行,中途无法取消.
 *  2. 如果不设置回调函数,promise 中抛出的错误无法反映到外部.
 *  3. 阶段无法确定,如果某个 promise 还没有 resolve 或者 reject 时,你没发获取他的具体执行阶段, 没法知道他是刚执行还是快执行结束.
 *  4. 不善于处理不短重复发生的事件, 可选去 stream 模式替代
 *
 * Promise.prototype.then(resolveion, rejection): 一般来讲不要这么做. 显示的 catch 更好一些
 *   then接受两个参数: resolve 回调和 reject 回调.then 不会主动返回当前的 promise 作为链式调用的起点.你要链式 then 则需要主动返回 then
 * Promise.prototype.catch(rejection):
 *   cathc 接受一个 reject 回调, 实际上这个 catch 是 then(null, rejection) 的另一种表达方式.
 *   能捕获 promise 的 reject, then 的回调中发生错误也能捕获.
 *   在一个链式的then.catch 中 cathc 不能捕获自身及其后的链式 then 中发生的错我.只能前向捕获
 *
 * 因为Promise.prototype.then 和 Promise.prototype.catch方法返回 promises对象, 所以它们可以被链式调用—— 一种被称为 composition 的操作。
 *  [参考: https://mdn.mozillademos.org/files/8633/promises.png]
 */

var promiseCount = 0;
+function testPromise() {
    var thisPromiseCount = ++promiseCount;
    console.log('beforeend', thisPromiseCount + ') 开始(同步代码开始)');

    // 我们创建一个新的promise: 然后用'result'字符串完成这个promise (3秒后)
    var p1 = new Promise(function(resolve, reject) {
        // 完成函数带着完成（resolve）或拒绝（reject）promise的能力被执行
        console.log('beforeend', thisPromiseCount + ') Promise开始(异步代码开始)');

        // 这只是个创建异步完成的示例
        setTimeout(function() {
            // 我们满足（fullfil）了这个promise!
            console.log('async resolve ing...');
            resolve(thisPromiseCount);
        }, 500);
    });

    // 定义当promise被满足时应做什么
    p1.then(function(val) {
        // 输出一段信息和一个值
        console.log('beforeend', val + ') Promise被满足了(异步代码结束)');

        return new Promise(function(resolve, reject) {
            // 这只是个创建异步完成的示例
            setTimeout(() => {
                // 我们满足（fullfil）了这个promise!
                console.log('async reject ing...');
                reject(thisPromiseCount);
            }, 500);
        })
    }).catch((reason) => {
        // Log the rejection reason
        console.log('Handle rejected promise (' + reason + ') here.');

    });

    console.log('beforeend', thisPromiseCount + ') 建立了Promise(同步代码结束)');
}();

// polyfill : ajax
// A-> $http function is implemented in order to follow the standard Adapter pattern
// function $https(url, conf) {
//     const core = {
//         ajax(method, url, args, conf) {
//             ....
//         }
//     };
//
//     return {
//         get(args) {
//             return core.ajax('GET', url, args, conf);
//         },
//         post(args) {
//             return core.ajax('POST', url, args, conf);
//         }
//     };
// }
// $http('url', {}).get({a: 1});

class $http {
    // Method that performs the ajax request
    static Ajax(method = 'POST', url, args, conf = {}) {
        console.log('AJAX');
        // Creating a promise
        const promise = new Promise((resolve, reject) => {
            console.log('promise loading...');
            // Instantiates the XMLHttpRequest
            const client = new XMLHttpRequest();
            const uri = url;
            if (args && (method === 'POST' || method === 'PUT')) {
                uri += '?';
                const argcount = 0;
                for (const key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (argcount++) {
                            uri += '&';
                        }
                        uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                    }
                }
            }
            client.open(method, uri);
            client.send();

            client.onload = function() {
                if (this.status >= 200 && this.status < 300) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    resolve(this.response);
                } else {
                    // Performs the function "reject" when this.status is different than 2xx
                    reject(this.statusText);
                }
            };
            client.onerror = function() {
                reject(this.statusText);
            };

        });

        return promise;
    }

    static Get(url, args, conf) {
        console.log('GET');
        return $http.Ajax('GET', url, args, conf);
    }

    static Post(url, args, conf) {
        console.log('post');
        return $http.Ajax('POST', url, args, conf);
    }

    static delate(url, args, conf) {
        return $http.Ajax('DELETE', url, args, conf);
    }
}

// 如下代码 console 运行无效, 无 XMLHttpRequest 对象
// 在 mozilla doc 的 web 站 console 中执行, 否则会跨域, 注意协议兼容
$http.Get('https://developer.mozilla.org/en-US/search.json', {
    a: 1,
    b: 2
}).then(function(data) {
    console.log('exec success...');
    console.log(data);
});
