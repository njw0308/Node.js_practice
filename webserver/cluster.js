// 노드가 싱글 스레드라는 건 변함이 업음.
// --> CPU 코어를 하나 밖에 안쓴다는 뜻!! 
// --> 이런 경우에 clustering 할 수 있음
// --> 노는 코어를 다 활용하는 방법!! 
// --> "멀티 프로세싱" 

const cluster = require('cluster')
const os = require('os')
const http = require('http')

const numCPUs = os.cpus().length // 코어가 몇 개인지 갖고 올 수 이씀

// cluster 에는 마스터 모드와 워커 모드가 있움.
// --> 마스터는 워커들의 행동들을 총 관리.
// 마스터는 워커들의 행동들을 총 관리. 관리자 역할!
// 워커들(else 문)은 진짜 서버를 만듬. 일꾼 역할!

if (cluster.isMaster) {
    console.log('마스터 프로세스 아이디', process.pid);
    for (let i = 0; i < numCPUs; i++) {
        // cpu 개수만큼 워커들을 만들어내겠다.
        // 내 컴터는 코어가 8개라서 8명의 워커가 생성.
        cluster.fork();
    }
    // 하나가 너무 열심히 일해서 갑자기 죽을 때.
    cluster.on('exit', (worker , code, signal) => {
        console.log(worker.process.pid , '워커가 종료되었습니다.');
        //cluster.fork();
    })
} else {
    http.createServer((req, res) => {
        res.end('http server')
        // 워커를 하나씩 종료시켜보자!! 눈으로 확인해보기!!
        setTimeout(() => {
            process.exit(1);
        }, 1000)
    }).listen(5129);
    console.log(process.pid, '워커 실행');
}
