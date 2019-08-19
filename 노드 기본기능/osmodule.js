const os = require('os')
console.log(os.arch())
console.log(os.platform())
console.log(os.type())
console.log(os.uptime()) // --> 이 운영체제가 시작되고 나서 흐른 시간.
console.log(os.hostname())
console.log(os.release()) // 윈도우 버전.
console.log(os.homedir())
console.log(os.tmpdir())
console.log(os.freemem()) // 사용할 수 있는 메모리
console.log(os.totalmem()) // 전체 메모리.
console.log(os.cpus()) // cpu 정보를 알려줌.
// --> 웹 개발 할 때 보다는 데스크탑 개발할 때 쓴데.
// 코어가 8개면 나머지가 노니까 cpus() 로 개수를 파악하고, 반복문을 돌려서 8개의 노드 프로세스를 만든 다음에 싱글쓰레드의 단점을 극복함!! == "멀티 프로세싱"
