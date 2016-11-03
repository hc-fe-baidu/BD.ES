/**
 * fis3 工程
 *
 * promisr 处理常用异步组合模型
 *  Promise.all(iterable) [所有被代理的 promise 都 resolve 才返回 resolve]
 *      这个方法返回一个新的promise对象，该promise对象在iterable里所有的promise对象都成功的时候才会触发成功，
 *      一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。这个新的promise对象在触发成功状态以后，
 *      会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；
 *      如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。
 *      Promise.all方法常被用于处理多个promise对象的状态集合。（可以参考jQuery.when方法---译者注）
 *  Promise.race(iterable)
 *      当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数
 *      调用父promise绑定的相应句柄，并返回该promise对象。
 *
 *  Promise.reject(reason): 生成一个状态为 rejectd 的 对象.规则如下.
 *      调用Promise的rejected句柄，并返回这个Promise对象。
 *  Promise.resolve(value) : 生成一个状态为 resolved 的 promise 对象
 *      你可以使用这个方法进行 promise 化.等价于给 new Promise 传递的参数的resolve返回 . 可以接收四中类型的参数
 *        1. 接受一个非 thenable 的任意类型数据,比如基本类型.resolve 返回一个 状态为 resolved 的 proimse 对象
 *          Promise.resolve('some')
 *          Promise.resolve($.ajax('baidu.com')).       // promise 化
 *        2. 没有参数.resolve 返回一个 状态为 resolved 的 proimse 对象. 通常用于快速得到一个 promise 对象
 *          Promise.resolve()
 *        3. thenabled: (thenable 指的是含有 then 操作的对象).  resolve 将这个对象转化为 promise 对象, 然后执行 thenable 对象的
 *          then 方法.
 *          Promise.resolve({
 *              then(){
 *                  resolve(...)        // thenabled.
 *              }
 *          })
 *        4.传入 promise 对象,将原封不动的返回这个 promise
 *
 *       等价于
 *          new Promise((resolve) => resolve($.ajax('baidu.com')))
 *      用成功值value完成一个Promise对象。如果该value为可继续的（thenable，即带有then方法），
 *      返回的Promise对象会“跟随”这个value，采用这个value的最终状态；否则的话返回值会用这个value满足（fullfil）返回的Promise对象。
 *
 * 注意: ES6提供的 promise 和 jquery 的 ajax 使用有区别, $.ajax 有一个 done 和 fail 的操作,这个是 jquery 的 ajax 成功失败回调.
 * 但是 jquery.ajax 也会返回一个 peomise 他有 then 和 catch 两个操作.不要搞混了
 */

/**
 * 如下建立了一个异步操作的业务场景
 *   init - > loadMenu && loadBody ->
 *      loadMenu -> loadCity && loadArea
 *      loadCity || loadArea-> loadAddr -> loadTable(loadBody)
 *  TODO: promise 的机制都不能实现 a 或 b 执行结束后执行 c 的场景.
 *   实际上 race 实现这个场景始终有些争议, 原因在于如果某个接口 reject 了. 我们整个 promise 组没法正常执行下去.但是我们回头想想其实
 *   不是那么回事, 我们在实际应用中考虑的是每个接口都正常执行, 此时一旦有一个接口正常返回了,我们就直接执行 c. 这是符合上述或的要求的.
 *   实际上我们假设的a.b 两个接口都正常, 此时有一个返回了,就执行 c. 而不是假设失败的情况.
 *   其次这是个比较不好的结构,因为这是个多入口的操作,我们期望自己的程序是线性可以测的. 实际操作中我们会非常避讳这种连先决条件都不确定
 *   的操作. 这比同样的输入得到不同的输出更让程序不可维护. 另一方面我们可以用一些良好的设计完成这个功能.
 *   但是作为程序员我还是蛮希望完成这个功能的.
 *
 * 坑: 1. 不要链式的返回 promise. 要返回一级的直接 new 的 peomise ,否则结果会比较异常.
 *           原因是: then 不会返回当前的 promise 作为链式调用的 promise. 需要手动返回, 你在 then 中返回当前的 promise 即可
 *     2. 不要 return resolve 或者 reject 的结果, 因为没有返回值,退一步说这两个操作在异步函数中.返回值也没办法捕获
 */

const $http = require('./$http.re');
const $ = require('jquery');

const BODY_URL = '/promise/body';
const MENU_URL = '/promise/menu';
const AREA_URL = '/promise/area';
const ADDR_URL = '/promise/addr';
const CITY_URL = '/promise/city';
const TABLE_URL = '/promise/table';

const ERROR_DATA_URL = '/error.promise/data';
const log = console.log;
const M = {
    init() {
        // all: Promise.all(iterable) 方法返回一个promise，该promise会等iterable参数内的所有promise都
        // 被resolve后被resolve，或以第一个promise被reject的原因而reject 。
        const promise = Promise.all([this.loadBody(), this.loadMenu()]);

        // 如下演示了控制汇总的情况.当然我们也可以将控制权交给给个函数. 可以利用 resolve(promise) 去实现对别的 promise 的依赖.
        // promise.then(([v1, v2] = ['', '']) => {
        //     log('loadBody && loadMenu', JSON.parse(v1), JSON.parse(v2));
        //
        //     // race 函数返回一个Promise，这个promise在iterable中的任意一个promise被解决或拒绝后，立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。
        //     // 实际上这里用 race 处理或的情况建立在两个接口都预期正常返回的前提下进行或的讨论.当然你也可以认为这个不能满足场景.
        //     Promise.race([this.loadCity(), this.loadArea()]).then((v = '') => {
        //         log('loadCity || loadArea', JSON.parse(v));
        //
        //         // 继续添加 then 监听
        //         this.loadAddr().then((v) => {
        //             log('loadAddr -> loadTable', JSON.parse(v));
        //             this.loadTable();
        //         });
        //
        //         // 当然你也可以包装 loadAddr 的 promise.
        //         // Promise.resolve(this.loadAddr()).then(() => {
        //         //     log('loadAddr -> loadTable', JSON.parse(v));
        //         //     this.loadTable();
        //         // });
        //     }).catch((v) => {
        //         log('catch', v);
        //     });
        // });

        //  实际上上述写法是非常糟糕的写法,原因在于几遍使用了 promise 你依旧使用回调嵌套完成各种异步操作
        // 如下演示了控制汇总的情况.当然我们也可以将控制权交给给个函数. 可以利用 resolve(promise) 去实现对别的 promise 的依赖.
        // 至此已经完成这个模型了. 结构比较好, promise 化
        promise.then(([v1, v2] = ['', '']) => {
            log('loadBody && loadMenu', JSON.parse(v1), JSON.parse(v2));

            // race 函数返回一个Promise，这个promise在iterable中的任意一个promise被解决或拒绝后，立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。
            // 实际上这里用 race 处理或的情况建立在两个接口都预期正常返回的前提下进行或的讨论.当然你也可以认为这个不能满足场景.
            return Promise.race([this.loadCity(), this.loadArea()]);
        }, (v) => {
            log('catch', v);
        }).then((v) => {
            log('loadCity || loadArea', JSON.parse(v));
            return this.loadAddr();
        }).then((v) => {
            log('loadAddr -> loadTable', JSON.parse(v));
            return this.loadTable();
        }).then(() => {
            log('last step: hide overlay...');
        });
    },
    /**
     * 之前为了省事直接返回的链式调用的 promise ,虽然也是 promise 但结果一直很奇怪. 达不到 all 描述的情况. 只好拆分出来.
     * return  $http.iGet(ERROR_DATA_URL, {
     *     menu: 1,
     * }).then((data) => {
     *     log('initMenv ---> ', data);
     * }).catch((msg) => {
     *     log('menu error operate ---> ', msg);
     * });
     *
     * 原因是 : then 这个方法会导致 promise 丢失, 这个丢失的含义是线性操作丢失,而不是选择操作丢失, 所以 then 后面继续 catch 不会发生丢失.
     * 因为 cathc 和 then 是并行而非串行.
     * 论证参考: BD.ES/ES6/sync.async/promise/promise.operate.js
     */
    loadMenu() {
        const promise = $http.iGet(MENU_URL, {
            menu: 1,
        });

        promise.then((data) => {
            log('initMenv ---> ', data);
        }).catch((msg) => {
            log('menu error operate ---> ', msg);
        });

        return promise;
    },

    loadBody() {
        const promise = $http.iPost(BODY_URL, {
            id: 2,
            name: 'post',
        });
        promise.then((data) => {
            log('loadBody ---> ', data);
        }).catch((msg) => {
            log('body error operate ---> ', msg);
        });
        return promise;
    },

    loadCity() {
        const promise = $http.iGet(CITY_URL, {
            body: 2,
        });
        promise.then((data) => {
            log('loadCity ---> ', data);
        });

        return promise;
    },

    loadAddr() {
        const promise = $http.iGet(ADDR_URL, {
            body: 2,
        });
        promise.then((data) => {
            log('loadAddr ---> ', data);
        });
        return promise;
    },

    loadArea() {
        const promise = $http.iGet(AREA_URL, {
            body: 2,
        });
        promise.then((data) => {
            log('loadArea ---> ', data);
        });
        return promise;
    },

    loadTable() {
        const promise = $http.iGet(TABLE_URL, {
            body: 2,
        });
        promise.then((data) => {
            log('loadTable ---> ', data);
        });
        return promise;
    },
};

export default M;
