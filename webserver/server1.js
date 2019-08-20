//이 모듈이 서버프로그램을 만들어줌.
//노드 자체가 서버가 아니라 http 모듈이 서버역할을 해줌.
const http = require('http');
const fs = require('fs')
//http 모듈은 방문이라는 event 가 기본적으로 설정되어있움.
// req --> 요청 , res --> 반응. 요청을 받아들일지 거절할지도 허락할 수 있음.
// 올바른 요청인지를 검사해서 맞으면 res 를 보내주고, 이상하면 res를 거절할 수도 있다!
const server = http.createServer((req, res) => {
    console.log('서버 실행');
    fs.readFile('./server2.html', (err, data) => {
        if (err) {
            throw err;
        }
        res.end(data); // 웹 브라우저가 알아서 렌더링을 함. 버퍼인 데이터를 브라우저에 보내는 것까지가 노드의 역할
    })
}).listen(5129);

// http 는 기본포트 80 , https 는 기본포트 443 --> 얘네들이 숨어져있음. (기본 포트는 숨겨져도 됨) 
// 포트가 다르면 호스트(도메인, naver.com 이런 것)가 같더라도 다른 사이트처럼 동작할 수 있음.
server.on('listening', () => {
    console.log('5129번 포트에서 서버 대기중입니다.')
})

server.on('error', (err) => {
    console.error(err);
})