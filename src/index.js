function component() {
  const element = document.createElement("div");

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());
// Problems related to currying

// 1)
// sum(2)(4)...(n)()
function sum(res) {
  return function(n) {
    return n!==undefined ? sum(res + n) : res
  }
}

// 2)
// sum(1,2,3)
// sum(1,2)(3) 
// sum(1)(2,3)
// sum(1)(2)(3)
function sum() {
  let argsAdded = 0, sum = 0;
  
  function addSum() {
    if((argsAdded + arguments.length) < 3) {
      argsAdded += arguments.length;
      sum += (Array.from( arguments)).reduce((acc, n)=>acc+n, 0)
      return addSum
    }
    else {
      return sum + ([].slice.call(arguments,0,3-argsAdded)).reduce((acc, n)=>acc+n, 0)
    }
  }
  return addSum(...arguments);
}

// Currying polyfill
// f(a,b,c){} , curry(f) => f(a,b,c) | f(a,b)(c) | f(a)(b,c) | f(a)(b)(c)
function curry(f) {
  let argsUsed = 0, argsArr = [];
  function curriedFn(...args) {
    if(args.length + argsUsed < f.length) {
      argsUsed+=args.length;
      argsArr = argsArr.concat(args)
      console.log("returning bound fn with>>>", ...argsArr)
      return curriedFn.bind(this, ...argsArr)
    }
    else {
      let finalArr = argsArr.concat(args.slice(0, f.length - argsArr.length))
      return f.apply(this, finalArr)
    }
  }
  return curriedFn
}

// understanding bind for currying
function sum(a,b,c) {
  return a+b+c;
}
let boundsum = sum.bind(undefined, 1)
