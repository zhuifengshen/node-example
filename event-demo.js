// console.log('1');

// setTimeout(function() {
//     console.log('2');
//     process.nextTick(function() {
//         console.log('3');
//     })
//     new Promise(function(resolve) {
//         console.log('4');
//         resolve();
//     }).then(function() {
//         console.log('5')
//     })
// })
// process.nextTick(function() {
//     console.log('6');
// })
// new Promise(function(resolve) {
//     console.log('7');
//     resolve();
// }).then(function() {
//     console.log('8')
// })

// setTimeout(function() {
//     console.log('9');
//     process.nextTick(function() {
//         console.log('10');
//     })
//     new Promise(function(resolve) {
//         console.log('11');
//         resolve();
//     }).then(function() {
//         console.log('12')
//     })
// })

// setTimeout(function(){
//     console.log('定时器开始啦')
// });

// new Promise(function(resolve){
//     console.log('马上执行for循环啦');
//     for(var i = 0; i < 10000; i++){
//         console.log(i)
//         i == 99 && resolve();  // 循环满足 i == 99 时，才会调用 resolve() (&& 逻辑运算符前面为 true 时，后面的语句才会被执行)
//     }
// }).then(function(){
//     console.log('执行then函数啦')
// });

// console.log('代码执行结束');


Promise.resolve(1)
.then( (x) => x + 1 )
.then( (x) => {throw new Error('My Error')})
.catch( (err) => console.log(err))
.then( (x) => {
  console.log(x)
  return x + 1
})
.then((x) => console.log(x))
.catch( (x) => console.log(error))
