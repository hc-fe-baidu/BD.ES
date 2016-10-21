/**
 * 协助线程 [http://www.ruanyifeng.com/blog/2013/10/event_loop.html]
 *
 * js 单线程模型: 传统的单线程模型往往需要一些机制来弥补阻塞 IO 带来的糟糕体验, js 使用了 Event loop 的程序结构来尽可能的提升计算机 cpu 的利用率.
 *  Event Loop是一个程序结构，用于等待和发送消息和事件.
 *  简单说，就是在程序中设置两个线程：一个负责程序本身的运行，称为"主线程"；另一个负责主线程与其他进程（主要是各种I/O操作）的通信，被称为"Event Loop线程"（可以译为"消息线程"）。
 *
 *  每当遇到I/O的时候，主线程就让Event Loop线程去通知相应的I/O程序，然后接着往后运行其他操作，所以不存在等待时间。等到I/O程序完成操作，Event Loop线程
 *  再把结果返回主线程。主线程就调用事先设定的回调函数，完成整个任务。
 *  由于阻塞的 io 操作被交由 event loop，所以主线程得以运行更多的任务，这就提高了效率。这种运行方式称为"异步模式"（asynchronous I/O）或"非堵塞模式"（non-blocking mode）。
 *  这就是JavaScript语言的运行方式。单线程模型虽然对JavaScript构成了很大的限制，但也因此使它具备了其他语言不具备的优势。如果部署得好，JavaScript程序是不会出现堵塞的，
 *  这就是为什么node.js平台可以用很少的资源，应付大流量访问的原因。
 *
 * 协程:协程反映了程序逻辑的一种需求：可重入能力。这个能力很重要，因为大多数语言的一个最重要的组件--函数，其实就依赖这个能力的弱化版本。函数中的局部变量，被你初始化为特定的值，每次你调函数，
 *  换种说法:重入函数，语言都保证这些局部变量的值不会改变。相同的输入，得到相同的输出
 *  简而言之就是能够把一个计算或是操作，分解成若干步，并且可以再任何一步停下来，并在需要的时候继续执行剩下的步骤。
 *
 *  协程模型里，多个线程（单线程情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），线程（或函数）之间可以交换执行权。
 *  也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。
 *  从实现上看，在内存中，子例程只使用一个栈（stack），而协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说，协程是以多占用内存为代价，实现多任务的并行。
 *
 * （2）协程与普通线程的差异
 *  不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，同一时间可以有多个线程处于运行状态，
 *  但是运行的协程只能有一个，其他协程都处于暂停状态。此外，普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配。
 *  由于ECMAScript是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。不至于像
 *  异步操作的回调函数那样，一旦出错，原始的调用栈早就结束
 *
 * Generator函数被称为“半协程”（semi-coroutine），意思是只有Generator函数的调用者，才能将程序的执行权还给Generator函数。如果是完全执行的协程，任何函数都可以
 * 让暂停的协程继续执行。如果将Generator函数当作协程，完全可以将多个需要互相协作的任务写成Generator函数，它们之间使用yield语句交换控制权。
 *
 * 鉴于协程的特征, 我们可以转化不少异步操作, 进行可控的异步操作
 */
// 看一个改在的 ajax 的例子. 使用 yield 替换回调.
function * main() {
    const result = yield request("http://some.url");
    const resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
    const makeAjaxCall = (urls, fn) => ({});
    makeAjaxCall(url, function(response) {
        it.next(response);
    });
}

var it = main();
it.next();

// 另一个场景是管控, 看一下普通方式/promise/yield
// 只是伪码为说明问题
step1(function(value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});

// promise 化之后是这样的
Q.fcall(step1)
    .then(step2)
    .then(step3)
    .then(step4)
    .then(function(value4) {
        // Do something with value4
    }, function(error) {
        // Handle any error from step1 through step4
    }).done();

// 该造成生成器函数将是
function* longRunningTask() {
    try {
        var value1 = yield step1();
        var value2 = yield step2(value1);
        var value3 = yield step3(value2);
        var value4 = yield step4(value3);
        // Do something with value4
    } catch (e) {
        // Handle any error from step1 through step4
    }
}
// 实际上我们必须搭配一些机制才能保证这个执行的正常. 否则依旧是异步的状态
// 一般来讲 yield 会被设计为返回一个promise 对象.
// 讲真可以这么做,但并不如 promise
scheduler(longRunningTask());

function scheduler(task) {
    setTimeout(function() {
        var taskObj = task.next(task.value);
        // 如果Generator函数未结束，就继续调用
        if (!taskObj.done) {
            task.value = taskObj.value
            scheduler(task);
        }
    }, 0);
}
