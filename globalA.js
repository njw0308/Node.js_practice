// node 에서 전역 객체는 global 이다.
// 전역 객체이기 때문에 파일 간 global 이 공유된다.
module.exports = () => global.message;