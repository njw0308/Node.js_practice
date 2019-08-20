const fs = require('fs')
const http = require('http')
const url = require('url')
const qs = require('querystring')

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {

}

const server = http.createServer( (req, res) => {
    console.log(req.url, parseCookies(req.headers.cookie));
    const cookies = parseCookies(req.headers.cookie);

    if (req.url.startsWith('/login')) { 
        const { query } = url.parse(req.url) //destructuring, 키 : 값 쌍을 통해 query키의 값만 가져오는 형식.
        const { name } = qs.parse(query);
        const randomInt = +new Date()
        const expires = new Date();

        session[randomInt] = {
            name,
            expires,
        }
        expires.setMinutes(expires.getMinutes() + 5)
                
        //상태코드 302는 임시이동. 브라우저에게 Location에 적힌 페이지로 이동하라는 뜻.
        res.writeHead(302, {
        Location: '/', // root 페이지로 돌아갈게.
        'Set-Cookie' : `session= ${randomInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`})
        res.end(); 
    } else if (cookies.session && session[cookies.session] && session[cookies.session].expires > new Date()) {
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'}); // 한글이 제대로 보이게끔
        res.end(`${session[cookies.session].name} 방가방가`)
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
