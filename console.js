// console 도 객체라서 다양한 메서드들이 존재함.
// console.log
// console.error
// console.time('인자') -- console.timeend('인자')
const obj = {
    outside : {
        inside : {
            key: 'value'
        }
    }
}
console.log(obj)
console.dir(obj, { colors : true, depth : 1}) // 객체를 찍어내는?

//console.trace() --> 에러가 어디서 났는지 알 수 있게 추적해준다. 혹은 함수가 연달아서 묶여있을 때 어떻게 호출되는지 추척할 수도 있음.
const a = () => {
    console.trace("여기여기!")
}
const b = () => {
    a()
}
b();