/*
미리 특정 이벤트가 발생했을 때 어떤 동작을 할지 정의하는 '이벤트리스너'를 만들어둔다.
*/
const EventEmitter = require('events')

const myEvent = new EventEmitter() // 나만의 이벤트를 만들어냄. custom event

myEvent.addListener('방문', () => {
    console.log('땡큐 포 비지팅!');
});

// on 은 별칭(alias) 임.

// 동일한 이벤트에 여러 개의 리스너가 있어도 됨.
myEvent.on('종료', () => {
    console.log('ㅅㄱ');
});
myEvent.on('종료', () => {
    console.log('ㅂㅂ')
})

//이벤트를 한번만 실행함.
myEvent.once('특별이벤트', () => {
    console.log('딱 한번만 실횅딤');
})

// 우리가 만든 이벤트를 호출하는 메서드. emit()
myEvent.emit('방문');
myEvent.emit('종료');
myEvent.emit('특별이벤트')
myEvent.emit('특별이벤트')

// 이벤트 제거.
myEvent.removeAllListeners('종료');
myEvent.emit('종료')

// 몇 개의 이벤트가 있는지를 알려줌.
myEvent.listenerCount('종료')