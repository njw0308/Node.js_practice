const path = require('path')
console.log(path.sep) // 구분자를 어떻게하는가.
console.log(path.delimiter) // 환경 변수 관련?
console.log(path.dirname(__filename)) // 경로(부모 파일까지만 보여줌)
console.log(path.extname(__filename)) // 확장자. ex) .js
console.log(path.basename(__filename)) // 파일이름
console.log(path.parse(__filename)) //파일과 관련된 정보를 쪼개서 보여줌.
console.log(path.format(path.parse(__filename))) // 쪼갠 정보를 다시 합쳐서 하나로 보여줌.
console.log(path.normalize("C:/users/joonwoo//study")) // 경로를 올바른 표현 방식으로 고쳐줌(해당 os에 맞게!)
console.log(path.isAbsolute('C:\\')) // 현재 경로가 상대 경로인지 절대 경로인지. true 엔 false 로 알려준다.
console.log(path.relative('C:\\users\\Joonwoo\\study', 'junwoo')) // 상대경로를 알 수 있는 방법. 첫 번째 인자에서 두 번째 인로 가려면 어떻게 가야하는지 알려줌.

console.log(path.join(__dirname, '..', '..', '/test')) // 첫 번째 인자를 기준으로 나머지 조각들을 합침. --> C:\Users\JoonWoo\Desktop\test
console.log(path.resolve(__dirname, '..', '..', '/test')) // 절대 경로 고려하고 합침. 루트 C:\ 에서 시작하는 경로를 만드는 듯...? --> C:\test
