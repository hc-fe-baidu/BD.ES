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
 *  Promise.reject(reason)
 *      调用Promise的rejected句柄，并返回这个Promise对象。
 *  Promise.resolve(value)
 *      用成功值value完成一个Promise对象。如果该value为可继续的（thenable，即带有then方法），
 *      返回的Promise对象会“跟随”这个value，采用这个value的最终状态；否则的话返回值会用这个value满足（fullfil）返回的Promise对象。
 *
 * 注意: ES6提供的 promise 和 jquery 的 ajax 使用有区别, $.ajax 有一个 done 和 fail 的操作,这个是 jquery 的 ajax 成功失败回调.
 * 但是 jquery.ajax 也会返回一个 peomise 他有 then 和 catch 两个操作.不要搞混了
 */

/**
 * 如下建立了一个异步操作的业务场景
 *   init - > loadMenu && loadBody ->
 *      loadMenu -> loadCity-> loadArea -> loadTable(loadBody)
 *      loadCity || loadArea-> loadAddr
 * @type {Object}
 */

const $http = require('./$http.re');

const DATA_URL = '/promise/data';
const ERROR_DATA_URL = '/promise/data';
const log = console.log;
const M = {
    init() {
        Promise.all([this.loadBody(), this.loadMenu()]).then(() => {
            log(arguments);
        }).catch(([v1, v2]) => {
            log([v1, v2])
        });
    },

    loadMenu() {
        return $http.iGet(DATA_URL, {
            menu: 1,
        }).then((data) => {
            log('initMenv ---> ', data);
        }).catch((msg) => {
            log('menu error operate ---> ', msg);
        });
    },

    loadBody() {
        $http.iPost(DATA_URL, {
            body: 2,
        }).then((data) => {
            log('loadBody ---> ', data);
        }).catch((msg) => {
            log('body error operate ---> ', msg);
        });
    },

    loadCity() {
        $http.iGet('/promise/data', {
            body: 2,
        }).then((data) => {
            log('loadCity ---> ', data);
        });
    },

    loadAddr() {
        $http.iGet('/promise/data', {
            body: 2,
        }).then((data) => {
            log('loadAddr ---> ', data);
        });
    },

    loadArea() {
        $http.iGet('/promise/data', {
            body: 2,
        }).then((data) => {
            log('loadArea ---> ', data);
        });
    },

    loadTable() {
        $http.iGet('/promise/data', {
            body: 2,
        }).then((data) => {
            log('loadTable ---> ', data);
        });
    },
};

export default M;
