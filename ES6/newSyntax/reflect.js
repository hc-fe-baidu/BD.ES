/**
 * api: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
 *
 * Reflect 对象提供了若干个能对任意对象进行某种特定的可拦截操作（interceptable operation）的方法。
 * Reflect 并不是一个构造函数，你不需要使用 new 运算符来构造它的实例。下面的所有方法都是它的静态方法（就和 Math 对象身上的一样）。
 *
 * reflect设计的目的:
 *  1. 将 object 的某些明显属于语言内部的方法放到 reflect 中. 比如 defineProperty ,由于兼容原因, 目前很多操作同时出现在 object 和 relflect 上.
 *      未来部署的新操作将只出现在 reflect 上.
*   2. 部分 object 的操作拥有不合理的返回和错误处理.reflect 进行修正了.Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，
*       而Reflect.defineProperty(obj, name, desc)则会返回false
*   3. 让部分 object 的操作编程函数行为.
*   4. 辅助 proxy 操作. reflect 操作和 proxy 的 handler 操作一一对应, proxy 可以利用 reflect 的操作去完成默认行为.
 */


/**
 * The Reflect object provides the following static functions which have the same names as the proxy handler methods.
 * Some of these methods are the same as corresponding methods on Object.[reflec 提供的操作类似于 proxy 的 handler 以及 object 的某些操作,但也有细微差别]
 *
 * Reflect.apply()
 *      Calls a target function with arguments as specified by the args parameter. See also Function.prototype.apply().
 * Reflect.construct()
 *      The new operator as a function. Equivalent to calling new target(...args).
 * Reflect.defineProperty()
 *      Similar to Object.defineProperty(). Returns a Boolean.
 * Reflect.deleteProperty()
 *      The delete operator as a function. Equivalent to calling delete target[name].
 * Reflect.get()
 *      A function that returns the value of properties.
 * Reflect.getOwnPropertyDescriptor()
 *      Similar to Object.getOwnPropertyDescriptor(). Returns a property descriptor of the given property if it exists on the object,  undefined otherwise.
 * Reflect.getPrototypeOf()
 *      Same as Object.getPrototypeOf().
 * Reflect.has()
 *      The in operator as function. Returns a boolean indicating whether an own or inherited property exists.
 * Reflect.isExtensible()
 * Same as Object.isExtensible().
 * Reflect.ownKeys()
 *      Returns an array of the target object's own (not inherited) property keys.
 * Reflect.preventExtensions()
 *      Similar to Object.preventExtensions(). Returns a Boolean.
 * Reflect.set()
 *      A function that assigns values to properties. Returns a Boolean that is true if the update was successful.
 * Reflect.setPrototypeOf()
 *      A function that sets the prototype of an object.
 */
