// node 는 자바스크립트를 위한 런타임 환경이다.
// 런타임 환경(영어: runtime environment)은 컴퓨터가 실행되는 동안 프로세스나 프로그램을 위한 소프트웨어 서비스를 제공하는 가상 머신의 상태이다.

// 3가지 키워드. --> 이벤트 기반(event driven), non-blocking I/O, Single thread

// --- event loop ----
// 언제 tast queue 에 들어가는가? --> setTImeout, setInterval, setImmediate, Promise(reject, resolve), async/await, eventlistner 의 콜백.
//  queue 가 한 줄만 있는 queue 가 아니라, 여러 줄로 이루어진 queue 임. queue 들 사이의 '우선순위'는 event loop 가 알고있다고 생각하자.

// --- 서버 ---
// 서버의 원칙? 요청을 보내면 응답을 받는다. 
// 요청의 특징은 언제 요청이 올지를 모르는 것. --> 이벤트가 발생할 때 응답하자! "event driven" 
// 요청하는 대상을 클라이언트라고 하는데 그 클라이언트가 서버일 수도 있음.

// non - blocking? callback queue 에 보내버려서 순서를 다르게 만드는 것. '순서' 의 문제.
// I/O ? file system (알아서 멀티 쓰레드를 돌림), network(애초에 non-blocking)

// single thread? 한 번에 한 가지 일 밖에 하지 못함. 팔이 하나임! --> 이걸 극복하기 위해 non-blocking 으로 효율적으로 처리할 수 있게끔.
// --> 멀티쓰레드 프로그래밍이 어려움... 잘하면 물론 좋음. (양팔 사용 가능)
// --> 노드가 싱글쓰레드의 단점을 보완하고자 꼼수처럼 쓰는 싱글쓰레드가 있음...ㅋㅋㅋthread 보다 좀 더 큰 개념인 processing. "multi processing"


var a = 1
var b = 2
console.log(a+b)
console.log("hello World")