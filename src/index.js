import _ from "lodash"
function component() {
  const element = document.createElement("div");

  // Lodash, now imported by this script
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
function sumCurry() {
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

// Math.pow polyfill
// pow(a, n) both a & n are integers
// pow(9, 2) => 81
// pow(10, -1) => 0.1
// O(n), O(lgn)
function pow(a, n) {
  let base = a, power = n, result=1;
  if(n===0){
    return result
  }
  if( n < 0) {
    base = 1/base;
    power = -power;
  }
  for (let i = power; i>0;i--) {
    result*=base;
  }
  return result
}
function powOpt(a, n) {
  if(n===0){
    return 1
  }
  if( n < 0) {
    a = 1/a;
    n = -n;
  }
  if(n%2 === 0) {
    return powOpt(a, n/2) * powOpt(a, n/2)
  }
  else {
    return a * powOpt(a, (n-1)/2) * powOpt(a, (n-1)/2)
  }
}

// largest sum in subarray
// [-2, -3, 4, -1, -2, 1, 5, -3] => 4 + -1 + ... + 5 = 7
// Approach -> we are only interested in the consecutive +ve values and consecutive -ve values
// starting with the first positive section, we only add the next -ve section if there is a +ve section
// next to that -ve section which increases the overall sum after adding to the existing sum
function largestSubArraySum(arr){
  let sumArr = [], i=0, maxSum=arr[0];
  while(i<arr.length) {
    let sum = 0;
    if(arr[i] > 0) {
      while(i<arr.length && arr[i]>0) {
        sum+=arr[i];
        i++;
      }
      sumArr.push(sum)
    }
    else {
      while(i<arr.length && arr[i]<=0) {
        sum+=arr[i];
        i++;
      }
      sumArr.push(sum)
    }
  }
  console.log(sumArr)
  for(i=0;i<sumArr.length;i++) {
    if(sumArr[i]<=0) {
      continue;
    }
    if(sumArr[i] > 0) {
      let sum = sumArr[i];
      while((sumArr[i+1] + sumArr[i+2] > 0) && i < sumArr.length - 2) {
        sum+=sumArr[i+1] + sumArr[i+2];
        i+=2;
      }
      if(sum>maxSum){
        maxSum = sum;
      }
      continue;
    }
  }
  console.log(maxSum);
  return maxSum
}
// reverse a string
function reverseString(str) {
  let retStr = str.split('');
  let retVal=""
  for(let i=str.length-1;i>=0;i--) {
    retVal+=retStr[i]
  }
  return retVal
}
