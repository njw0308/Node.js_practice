// const 와 let {} block 안에서만 존재.

// const에 객체가 할당된 경우 객체 내부 속성은 변경 가능.
const obj = {"a" : 1}
obj.a = 2
console.log(obj)

//객체 literal 의 변화.
const sayNode = () => {
    console.log('SayNode')
}

let es = 'ES'
const newObject = {
    sayjs() { // function 이라고 명시할 필요 없이 바로 메서드 가능.
        console.log('JS') 
    },
    sayNode, // key랑 value 가 같은 경우 바로 표현 가능.
    [es + 6] : 'fantastic' // 동적 속성 할당을 literal 안에 표현 가능. --> { [변수] : 값}
}

newObject.sayNode()
newObject.sayjs()
console.log(newObject.ES6)

//function 과 => 의 차이.
// this 가 어디에 속해있는가. 특히 callback func 으로 들어갈 때 화살표 함수를 쓰는게 편할 거임. 
// --> 내부의 this 를 함수 외부의 this 와 연결짓기 때문에.

// destructuring
const test = {
    status : {
        name : 'node',
        count : 5
    },
    get() {
        this.status.count --;
        return this.status.count
    }
}

const { status, get } = test // key 명과 같게끔.
console.log(status)
console.log(test.get()) // this 가 누구인지 알려줘야 하니까 앞에 test 있어야함. 
console.log(get.call(test)) // this 를 알려주는.

const array = [ "string" , {} , 10 , true]
const [string, obj2, int, bool] = array // destructing

// spread operator --> arguments 랑 비슷한 놈.
const add = (x, y) => console.log(x + y)
add(5,6)
const add2 = (x, ...y) => console.log(x + y.reduce((sum, b) => sum + b))
add2(5,6,7,8)

//Promise
const plus = new Promise((res, rej) => {
    const a = 1;
    const b = 2;
    if ( a+ b > 2) {
        res(a + b) // 성공 메세지 == 다음 then 으로 넘겨줄 메세지
    } else {
        rej(a + b) // 실패 메세지 == 다음 catch 로 넘겨줄 메세지.
    }
})

// resolve 가 then 이랑 이어지고 reject 는 catch 랑 이어져.
// then 에 return 이 또 Promise 라면 마치 체인처럼 then 이 이어질 수 있어.
plus
.then((success) => {
    console.log(success) // 3 이 나옴. res 의 결과값이 인자로 전해진다.
})
.catch((fail) => {
    console.error("fail")
})

const promise = new Promise((res, rej) => {
    res('성공')
})
const successPromise = Promise.resolve('성공') // 무조건 성공하는 경우 이렇게 쓸 수도 있음.
const failPromise = Promise.resolve('실패') // 무조건 실패하는 경우 이렇게 쓸 수도 있음.

//Promise.all([]) 로 여러 promise 를 동시에 실행 가능하다. 단 하나라도 실패하면 catch.
//Promise 는 결과값을 가지고 있지만, .then() 이나 .catch() 를 붙이기 전까지 반화하지 않는다고 생각하면 됨.
