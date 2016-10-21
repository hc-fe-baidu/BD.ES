/**
 * 这个接口的原始设计目的，与WebGL项目有关。所谓WebGL，就是指浏览器与显卡之间的通信接口，为了满足JavaScript与显卡之间大量的、实时的数据交换，
 * 它们之间的数据通信必须是二进制的，而不能是传统的文本格式。文本格式传递一个32位整数，两端的JavaScript脚本与显卡都要进行格式转化，将非常耗时。
 * 这时要是存在一种机制，可以像C语言那样，直接操作字节，将4个字节的32位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。”
 *
 * 二进制数组组成部分: （ArrayBuffer对象、TypedArray视图和DataView视图）是JavaScript操作二进制数据的一个接口
 *  （1）ArrayBuffer对象：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。
 *      api: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
 *  （2）TypedArray视图：共包括9种类型的视图，比如Uint8Array（无符号8位整数）数组视图, Int16Array（16位整数）数组视图, Float32Array（32位浮点数）数组视图等等。
 *  （3）DataView视图：可以自定义复合格式的视图，比如第一个字节是Uint8（无符号8位整数）、第二、三个字节是Int16（16位整数）、第四个字节开始是Float32（32位浮点数）等等，
 *      此外还可以自定义字节序。
 *   简单说，ArrayBuffer对象代表原始的二进制数据，TypedArray视图用来读写简单类型的二进制数据，DataView视图用来读写复杂类型的二进制数据。
 *   TypedArray视图支持的数据类型一共有9种（DataView视图支持除Uint8C以外的其他8种）
 *       Int8	    1	   8位带符号整数	                signed char
 *       Uint8	    1	   8位不带符号整数	               unsigned char
 *       Uint8C	    1	   8位不带符号整数（自动过滤溢出）	  unsigned char
 *       Int16	    2	   16位带符号整数	                short
 *       Uint16	    2	   16位不带符号整数	            unsigned short
 *       Int32	    4	   32位带符号整数	                int
 *       Uint32	    4	   32位不带符号的整数	           unsigned int
 *       Float32	4	   32位浮点数	                 float
 *       Float64	8	   64位浮点数	                 double
 *
 * 二进制数组不是真正的数组,是类数组对象
 */

// demo
// ajax: 传统上，服务器通过AJAX操作只能返回文本数据，即responseType属性默认为text。XMLHttpRequest第二版XHR2允许服务器返回
// 二进制数据，这时分成两种情况。如果明确知道返回的二进制数据类型，可以把返回类型（responseType）设为arraybuffer；如果不知道，就设为blob
var xhr = new XMLHttpRequest();
xhr.open('GET', someUrl);
xhr.responseType = 'arraybuffer';

xhr.onload = function () {
  let arrayBuffer = xhr.response;
  // ···
};

xhr.send();

// canvas
// 参考./binaryArray/index.html and ./binaryArray/index.js

// TODO 利用二进制数组对图片数据化 demo 进行优化: /Users/baidu/baidulib/git/baidu/fe/interesting/p2e/README.md
