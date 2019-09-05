//https 가 보안면에서 좀 더 좋데! --> 암호화가 기본적으로 되어있어서 보안에 강력!
//https 는 아무나 할 수 있는게 아니고, 인증서가 필요함. --> 암호화 통신이기 때문에, 암호화가 제대로 되고 있는지 검증을 받아야함
//무료 중에서 제일 유명한건 letsencrypt 가 있움.
const http = require('http')
http.createServer({
    cert : fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),,
        fs.readFileSync('상위 인증서 경로')
    ]
}, (req, res) => {
    res.end()
}).listen(5129);

//http2 버전도 나왔데. https 기반으로 동작하므로 인증서가 필요함.
// --> 노드 10버전 기준으로 실험적인 단계!!
const http2 = require('http2')
http2.createSecureServer()