// 암호화를 도와주는 모듈.
// 비밀번호를 어떻게 암호화하느냐? --> hash 방식을 사용한데 일반적으로 복화화 할 수 없게끔
// 복호화 할 수 없으면 왜 쓰냐?? 근데 비밀번호는 복호화할 이유가 없음!
// 나중에 사용자가 로그인 창에서 id 와 비번을 입력할 때, 암호화된 비번이 일치하면 일치하는 것.
// --> 이걸 단방향 암호화라고 함. (암호화만 하고 복호화는 안되니까)

const crypto= require('crypto')
// crypto 에서 hash 를 만듬. sha512 라는 알고리즘을 만들어냄. update 부분에 암호화하고 싶은 비밀번호를 넣음. 그것을 어떤 방식으로 보여줄지를 digest로 지정함.
console.log(crypto.createHash('sha512').update('[비밀번호]').digest('base64'));

// 근데 똑같은 암호화 해시가 나오도록 해커들이 가끔 공격을 함.
// 비밀번호가 짧고 쉬울 수록 비밀번호 충돌이 일어나기가 쉬움.
// 이것을 노드는 pbkdf2 라는 알고리즘을 지원함.

console.log('------------------------------------')

// 어떻게 pbkdf2 알고리즘이 동작하는지 알아보자.
console.log("-------------Pbkdf2--------------")

// buf 에 랜덤 바이트가 담겨있음. 이 랜덤한 바이트를 base64 형식으로 만듬.
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

//실무에서는 bcrypt 혹은 scrypt 를 쓴다고 함. 

console.log('----------------------------------------------')
// 중요한 것은 [열쇠]가 노출이 되면 안됨! 복화할 수 있는 유일한 단서.
//양방향 암호화가 가능한 방식.
const cipher = crypto.createCipher('aes-256-cbc', '[열쇠]');
let result = cipher.update('[비밀번호]', 'utf-8', 'base64') // utf-8 을 base64 암호문으로
result += cipher.final('base64')
console.log('암호' , result)

//복호화
const deciper = crypto.createDecipher('aes-256-cbc', '[열쇠]')
let result2 = deciper.update(result, 'base64', 'utf-8') // base64 암호문을 utf-8 평문으로
result2 += deciper.final('utf-8')
console.log('복호화된 암호', result2)