// 下面所有的代码，并未经过验证，只是提供思路和参考

/*
通用柯里化函数的实现
既然柯里化函数这么实用，那么我们能不能实现一个通用的柯里化函数呢？所谓通用，就是说该函数可以把函数参数转换为柯里化函数
*/
 function curry(fn, args) {
   var length = fn.length;
   args = args || [];
   return function(...rest) {
     var _args = [...args, ...rest];
     return _args.length < length
       ? curry.call(this, fn, _args)
     : fn.apply(this, _args);
   }
 }
 var fn = curry(function(a, b, c) {
   console.log(a + b + c);
 });
 fn('a', 'b', 'c'); // abc
 fn('a', 'b')('c'); // abc
 fn('a')('b')('c'); // abc
 
// https://www.jianshu.com/p/2975c25e4d71
// 支持多参数传递
function progressCurrying(fn, args) {

    var _this = this
    var len = fn.length;
    var args = args || [];

    return function() {
        var _args = Array.prototype.slice.call(arguments);
        Array.prototype.push.apply(args, _args);

        // 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
        if (_args.length < len) {
            return progressCurrying.call(_this, fn, _args);
        }

        // 参数收集完毕，则执行fn
        return fn.apply(this, _args);
    }
}

// 实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;

function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }
    return _adder;
}

add(1)(2)(3)                // 6
add(1, 2, 3)(4)             // 10
add(1)(2)(3)(4)(5)          // 15
add(2, 6)(1)                // 9

// https://juejin.im/post/6875152247714480136
经典面试题：实现add(1)(2)(3)(4)=10; 、 add(1)(1,2,3)(2)=9;
function add() {
  const _args = [...arguments];
  function fn() {
    _args.push(...arguments);
    return fn;
  }
  fn.toString = function() {
    return _args.reduce((sum, cur) => sum + cur);
  }
  return fn;
}

