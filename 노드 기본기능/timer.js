// 변수는 id 라고 생각하자. 나중에 clear 할 때 필요한 놈들.
const timeout = setTimeout(() => {
    console.log("1.5초 후 실행")
}, 1500)

const interval = setInterval(() => {
    console.log("1초마다 실행")
}, 1000)

const timeout2 = setTimeout(()=> {
    console.log('실행되지 않을 것임')
}, 3000)

setTimeout(() => {
    clearTimeout(timeout2) // 지정된 타임아웃을 없애주는
    clearInterval(interval) // 지정된 interval 을 없애주는.        
}, 2500)

console.log('before immediate');

// 안에 있는 함수를 event loop 로 보내버려서, 비동기로 처리할 수가 있음.
const im = setImmediate((arg) => {
  console.log(`executing immediate: ${arg}`);
}, 'so immediate');

console.log('after immediate');