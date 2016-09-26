
// 表达式[和函数一样分为: 匿名类表达式 和 命名表达式] 不建议
//  命名函数表达式
let Ac = class Ac {
    constructor(name) {
        this.name = name;
    }
}

//  匿名韩式表达式
// let Ac = class {
//     constructor(name) {
//         this.name = name;
//     }
// }

Ac.show = () => {
    console.log('Ac static method: show');
}


// test....
console.log('################################### expression start ######################################');

let ac = new Ac('Ac');
Ac.show()
console.log(ac);

console.log('################################### expression end ######################################');
