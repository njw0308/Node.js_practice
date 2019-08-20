const fs = require('fs')
const http = require('http')
const url = require('url')
const qs = require('querystring')

// 쿠키를 객체 형식처럼 만들기 위한 함수.
const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const server = http.createServer( (req, res) => {
    console.log(req.url, parseCookies(req.headers.cookie));
    const cookies = parseCookies(req.headers.cookie);
    // http 분기 처리.
    if (req.url.startsWith('/login')) { 
        // 로그인에 저장된 정보가 파싱되서, 쿠키에 저장되서 다시 클리언트로 넘어가는 일련의 과정.
        const { query } = url.parse(req.url) //destructuring, 키 : 값 쌍을 통해 query키의 값만 가져오는 형식.
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5)
        // 쿠키의 여러가지 옵션들. 유효기간, 권한, 경로 등
        // res.writeHead(200, {'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`})
        
        //상태코드 302는 임시이동. 브라우저에게 Location에 적힌 페이지로 이동하라는 뜻.
        res.writeHead(302, {
        Location: '/', // root 페이지로 돌아갈게.
        'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`})
        res.end(); 
    } else if (cookies.name) {
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'}); // 한글이 제대로 보이게끔
        res.end(`${cookies.name} 방가방가`)
    } else {
        fs.readFile('./server4.html', (err, data) => {
            if (err) {
                throw err
            }
            res.end(data)
        })
    }
}).listen(5129);

server.on('listening', () => {
    console.log('5129번 포트에서 서버 대기중입니다.');
})