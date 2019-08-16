const util = require('util')
const crypto = require('crypto')

// deprecate 는 지원이 조만간 중단될 메서드임을 알려줄 때 사용.
const dontuseme = util.deprecate((x,y) => {
    console.log(x + y);
}, '이 함수는 1개월 뒤에 지원하지 않습니다.')

dontuseme(1,2)

// promisify --> promise 를 지원하지 않는 얘를 promise 처럼 기능하게끔 만들어줌.
const randomBytesPromise = util.promisify(crypto.randomBytes)
const pbkdf2Promise = util.promisify(crypto.pbkdf2)

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64') // 소금을 만들어냄 ㅋㅋㅋ랜덤 바이트라 실행할 때 마다 salt 값이 달라짐.
    console.log('salt : ', salt)
    console.time("암호화") // 암호는 만드는게 1초 정도 걸리 때까지 올려주면 좋다.
    // sha512 알고리즘을 활용한 pbkdf2 방식의 비번을 만들어내는!
    crypto.pbkdf2('[비밀번호]' , salt, 491725, 64, 'sha512', (err, key) => {
        console.log('password : ', key.toString('base64'))
        console.timeEnd('암호화')
    })
})

//'-----------------promise 로 바꾼 후-------------------')
randomBytesPromise(64)
.then((buf) => {
    const salt = buf.toString('base64') 
    return pbkdf2Promise('[비밀번호]', salt, 10000, 64, 'sha512')
})
.then((key) => {
    console.log('password : ', key.toString('base64'))
})
.catch((err) => {
    console.error(err)
});

//-----------------------async await 구문 --------------------
(async () => {
    const buf = await randomBytesPromise(64)
    const salt = buf.toString('base64')
    const key = await pbkdf2Promise('[비밀번호]', salt, 10000, 64, 'sha512')
    console.log('password : ', key.toString('base64'))
})()