const http = require('http');
const fs = require('fs');

const users = {

};

http.createServer((req, res) => {
    if (req.method == 'GET') {
        console.log(req.url)
        if ( req.url === '/') {
            return fs.readFile('./restFront.html' , (err, data) => {
                if (err) {
                    throw err
                }
                res.end(data);
            });
        } else if (req.url === '/users') {
            return res.end(JSON.stringify(users));
        }
        return fs.readFile(`.${req.url}`, (err, data) => {
            return res.end(data)
        })
    } else if (req.method == 'POST') {
        if ( req.url === '/') {

        } else if (req.url === '/users') {
    
        }
    } else if (req.method == 'PATCH') {
        if ( req.url === '/') {

        } else if (req.url === '/users') {
    
        }
    } else if (req.method == 'DELETE') {
        if ( req.url === '/') {

        } else if (req.url === '/users') {
    
        }
    } else if (req.method == 'PUT') {
        if ( req.url === '/') {

        } else if (req.url === '/users') {
    
        }
    }
}).listen(5129, () => {
    console.log('5129 번 포트에서 서버 대기 중')
})