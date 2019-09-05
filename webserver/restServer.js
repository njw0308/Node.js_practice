const http = require('http');
const fs = require('fs');

const users = {

};

//리팩토링 시켜보자. express 가 아닌 순수 node 로 짜야할 때.
const router = {
    get : {
        '/' : (req, res) => {
            fs.readFile('./restFront.html' , (err, data) => {
                if (err) {
                    throw err
                }
                res.end(data);
            });
        },
        '/users' : (req, res) => {
            res.end(JSON.stringify(users));
        },

        // wild Card!! 이외의 모든 케이스.
        '*' : (req, res) => {
            fs.readFile(`.${req.url}`, (err, data) => {
                return res.end(data)
            });
        },
    },
    post : {
        '/users' : (req, res) => {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            })
            req.on('end', () => {
                console.log('Post 본문(body)', body);
                const { name } = JSON.parse(body);
                const id = +new Date();
                users[id] = name
                res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'}); //이렇게 해야 한글이 안깨짐.
                res.end('사용자 등록 성공')
            });
        }
    },
    patch : {

    },
    delete : {
        '/users' : (req, res) => {
            const key = req.url.split('/')[2];
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            return req.on('end', () => {
                console.log('delete', body);
                delete users[key] 
                return res.end(JSON.stringify(users))
            });
        },
    },
    put : {
        '/users' : (req, res) => {
            const key = req.url.split('/')[2];
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            return req.on('end', () => {
                console.log('put', body);
                users[key] = JSON.parse(body).name;
                return res.end(JSON.stringify(users))
            })
        },
    }
}

http.createServer((req, res) => {
    //  우리가 만든 라우터 객체를 이용해보자.
    // 
    const matchedUrl = router[req.method.toLowerCase()][req.url];
    (matchedUrl || router[req.method.toLowerCase()]['*'])(req, res);

    
}).listen(5129, () => {
    console.log('5129 번 포트에서 서버 대기 중')
})