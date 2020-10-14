// https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086

// Originally inspired by  David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
const debounce = (func, wait) => {
  let timeout;

  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args) {

    // The callback function to be executed after 
    // the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;
      
      // Execute the callback
      func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the 
    // inside of the previous setTimeout  
    clearTimeout(timeout);
    
    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);
  };
};

var returnedFunction = debounce(function() {
  // All the taxing stuff you do
}, 250);

window.addEventListener('resize', returnedFunction);

// https://levelup.gitconnected.com/throttle-in-javascript-improve-your-applications-performance-984a4e020a3f
// https://codepen.io/treyhuffine/pen/mdyBEvM?editors=0110

// Pass in the callback that we want to throttle and the delay between throttled events
const throttle = (callback, delay) => {
  // Create a closure around these variables.
  // They will be shared among all events handled by the throttle.
  let throttleTimeout = null;
  let storedEvent = null;

  // This is the function that will handle events and throttle callbacks when the throttle is active.
  const throttledEventHandler = event => {
    // Update the stored event every iteration
    storedEvent = event;

    // We execute the callback with our event if our throttle is not active
    const shouldHandleEvent = !throttleTimeout;

    // If there isn't a throttle active, we execute the callback and create a new throttle.
    if (shouldHandleEvent) {
      // Handle our event
      callback(storedEvent);

      // Since we have used our stored event, we null it out.
      storedEvent = null;

      // Create a new throttle by setting a timeout to prevent handling events during the delay.
      // Once the timeout finishes, we execute our throttle if we have a stored event.
      throttleTimeout = setTimeout(() => {
        // We immediately null out the throttleTimeout since the throttle time has expired.
        throttleTimeout = null;

        // If we have a stored event, recursively call this function.
        // The recursion is what allows us to run continusously while events are present.
        // If events stop coming in, our throttle will end. It will then execute immediately if a new event ever comes.
        if (storedEvent) {
          // Since our timeout finishes:
          // 1. This recursive call will execute `callback` immediately since throttleTimeout is now null
          // 2. It will restart the throttle timer, allowing us to repeat the throttle process
          throttledEventHandler(storedEvent);
        }
      }, delay);
    }
  };

  // Return our throttled event handler as a closure
  return throttledEventHandler;
};

var returnedFunction = throttle(function() {
  // Do all the taxing stuff and API requests
}, 500);

window.addEventListener('scroll', returnedFunction);

// //////////////////////////////////////////////////////////

// https://blog.csdn.net/qq_29557739/article/details/96430431
// 这个是用来获取当前时间戳的
function now() {
  return +new Date()
}
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}

function throttle(fn) {
     let canRun = true; // 通过闭包保存一个标记
     return function () {
       if (!canRun) return; // 在函数开头判断标记是否为 true，不为 true 则 return
       canRun = false; // 立即设置为 false
       setTimeout(() => { // 将外部传入的函数的执行放在 setTimeout 中
         fn.apply(this, arguments);
         // 最后在 setTimeout 执行完毕后再把标记设置为 true(关键) 
         //表示可以执行下一次循环了。当定时器没有执行的时候
         //标记永远是 false，在开头被 return 掉
         canRun = true;
       }, 500);
     };
}
function sayHi(e) {
 console.log(e.target.innerWidth, e.target.innerHeight);
}
window.addEventListener('resize', throttle(sayHi));
