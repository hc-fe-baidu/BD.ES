// 计算属性名
let proName = 'foo', i = 1;
let obj = {
    [proName]: 'f',
    [i++ + 10]: 1,
    get [proName + i]() {

    }
}

console.log(obj);
