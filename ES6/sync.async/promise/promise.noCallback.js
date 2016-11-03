/**
 * promise 将异步控制同步化写法
 * @type {Promise}
 */
const pro1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('promise 1 resolve.');
    }, 1000);
});

const pro2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('promise 2 resolve.');
    }, 2000);
});

const pro3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('promise 3 resolve.');
    }, 3000);
});

pro3.then(() => {
    console.log('p3 exec...');
}).catch((v) => {
    console.log('error : ', v);
});

// 如果我们把多个存在线性的 then 链式调用. 会发现后面的部分捕获不到内容. 原因是 then
// pro1.then((v) => {
//     console.log('p1 then : ', v);
//     // return pro2;
// }, (e) => {
//     console.log(e);
// }).then((v) => {
//     console.log('p2 then : ', v);
//     // return pro3;
// }).then((v) => {
//     // JSON.parse(v);
//     console.log('p3 then : ', v);
// }).catch((e) => {
//     console.log(e);
// });


// 但是如果我们指定 then 返回的 promise. 就会发现 promise 在处理嵌套调用和回调上的贡献.
pro1.then((v) => {
    console.log('p1 then : ', v);
    return pro2;
}, (e) => {
    console.log(e);
}).then((v) => {
    console.log('p2 then : ', v);
    return pro3;
}).then((v) => {
    // JSON.parse(v);
    console.log('p3 then : ', v);
}).catch((e) => {
    console.log(e);
});

// 否则我们该怎么写?
// 实际上这并不是线性的,还是回调的方式. 在 then 的回调中调用另一个 promise.这并不需要 promise 来实现
// 不妨比较两种写法
// pro1.then((v) => {
//     console.log('p1 then : ', v);
//     pro2.then((v) => {
//         console.log('p2 then : ', v);
//         pro3.then((v) => {
//             console.log('p3 then : ', v);
//         })
//     })
// })
