/**
 * 依赖下发.
 *
 * ./promise.noCallback.js 和 ./promise.me/promise.static.re.js 都是将众多 promise 的控制流程在入口处处理.这样做能够将
 * 可变得逻辑都放到一个地方, 统一控制流程, 但是有时候也需要不同 promise 之间的依赖,而不仅仅是在入口控制.这时候 promise.resolve
 * 就可以派上用场了.
 *
 *  如下就是一个链式的触发 promise 结构. 所依赖的结构的返状态将会影响到 resolve 或者 reject 的那个 promise 的状态.
 *  简单来说 pro1 的的成功和失败影响 pro4 是执行 then 还是 catch
 */

const pro1 = new Promise((resolve, reject) => {
    debugger;
    if (Math.floor(Math.random() * 10) % 2 === 0) {
        setTimeout(() => {
            reject('pro1 reject');
        }, 100);
    } else {
        setTimeout(() => {
            resolve('pro1 resolve');
        }, 100);
    }
});

const pro2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(pro1);
    }, 100);
});

const pro3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(pro2);
    }, 100);
});

const pro4 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(pro3);
    }, 100);
});

pro4.then((v) => {
    console.log('pro4 then : ', v);
}).catch((e) => {
    console.log('pro4 catch : ', e);
});
