// setInterval(() => {
//     console.log('시작')
//     try {
//         throw new Error('서버를 고장내마')
//     } catch (error) {
//         console.error(error);
//     }
// }, 1000)



// const fs = require('fs')
// setInterval(() => {
//     // 콜백에서 나는 error 는 멈추지 않음.
//     fs.unlink('./asdfasdf.js', (err) => {
//         if (err) {
//             console.log('start');
//             console.log(err);
//             console.log('end');
//         }
//     })
// }, 1000)



//에러는 났지만 죽지않고 다음께 실행되게끔.
// --> 모든 에러를 다 해결할 수 있는가?
// --> 반은 맞고 반은 틀림. 모든 에러를 다 처리할 수는 있지만, 그 에러가 계속 난다는 것!
// --> 근본적인 에러의 원인을 해결하는 것이 올바른 방법.
process.on('uncaughtException', (err) => {
    console.error('예기치 못한 에러', err);
    // 서버를 복구하는 코드를 넣는 경우도 있지만, 보장하지 않음.
})
setInterval(() => {
    throw new Error('error')
}, 1000)

setTimeout(() => {
    console.log('나는 실행돼!')
}, 2000)