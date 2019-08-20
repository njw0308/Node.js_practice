const http = require('http')

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const server = http.createServer((req, res) => {
    // req.url 을 통해 어디서 요청이 들어오는지를 알 수 있음.
    console.log(req.url, parseCookies(req.headers.cookie))
    // header 부분에 cookie 를 설정해줌. 서버에서 클라이언트로 보낼 때 Set-Cookie 를 사용함.
    // status code 200 을 통해 성공할 때 이것을 하겠다.
    res.writeHead(200, {'Set-Cookie': 'mycookie=test'});
    console.log('서버 실행')
    res.end('Hello Cookie')
}).listen(5129);

server.on('listening', () => {
    console.log('5129 번 포트에서 서버 대기 중입니다.')
})

server.on('error', (err) => {
    console.error(err)
})