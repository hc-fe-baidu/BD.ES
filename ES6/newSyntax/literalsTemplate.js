// 字符串模板

// 是时候告别在 js 中写个 html 模板的时候那种换行加号和一些奇奇怪怪的占位符的痛苦了. 字符串模板提供简单而强大的写法.

// 模板功能, 在${}中可接受任何表达式, 还可以调用函数.
var a = 5;
var b = function(a) {
    return Math.pow(a, 2);
};
console.log('Fifteen is ' + (a + b(a)) + ' and not ' + (2 * a + b(a)) + '.');
console.log(`${ console.log(a, b) } , Fifteen is ${ a + b(a + 1) } and not ${ 2 * a + b(a + 1) }`);


// 模板字符串能够嵌套.   但是不是直接嵌套, 需要有一个解析从属关系
const tmpl = addrs => `
    <table>
        ${addrs.map(addr => `
            <tr><td>${addr.first}</td></tr>
            <tr><td>${addr.last}</td></tr>
        `).join('')}
    </table>
`;

const data = [
    { first: '<Jane>', last: 'Bond' },
    { first: 'Lars', last: '<Croft>' },
];

console.log(tmpl(data));


// 模板标签
// 所谓的模板标签并不是模板, 而是一种函数的特殊调用方式. 基本语法是模板函数后跟一个字符串模板.
// 实际上该函数会接受到两部分参数. 这两部分来自于这个模板字符串.
//  para1: 没有变量替换的部分,依据变量替换的位置 split 成一个数组. hello ${a} word ${b} . 的参数一就是['hello', 'word', '.']
//  para2: 变量替换的实际值. 请注意是解析后的值.

// eg:
let tagStr = tag`Fifteen is ${ a + b(a + 1) } and not ${ 2 * a + b(a + 1) }. `;
function tag(literals, ...values) {
    console.log(literals, values);

    // 在标签函数的第一个参数中，存在一个特殊的属性raw ，我们可以通过它来访问模板字符串的原始字符串。
    console.log(literals.raw[0]);
    return '';
}

// 另外，使用String.raw() 方法创建原始字符串和使用默认模板函数和字符串连接创建是一样的。
String.raw`Hi\n${2+3}!`;
// "Hi\\n5!"

// 由于模板字符串能够访问变量和函数，因此不能由不受信任的用户来构造。
`${console.warn("this is",this)}`; // "this is" Window

var a = 10;
console.warn(`${a+=20}`); // "30"
console.warn(a); // 30

// 使用模板字符串嵌入其他语言. : https://gist.github.com/lygaret/a68220defa69174bdec5
this.state = {};
jsx`
  <div>
    <input
      ref='input'
      onChange='${this.handleChange}'
      defaultValue='${this.state.value}' />
      ${this.state.value}
   </div>
`;
// 实现参考: https://gist.github.com/lygaret/a68220defa69174bdec5
function jsx() {

}
