// bin 속성 : {콘솔 명령어 : 실행파일} ==> cli 라는 명령어를 치면 index 를 실행하라라는 뜻.

// 1. npm i -g --> 전역 설치, 어떤 패키지인지 안 적어주면 현재 피키지가 전역 설치가 됨.

// 2. npm rm -g node-cli --> 전역 설치한 얘 삭제 시키기.


// config 에 옵션으로 logging: false 를 해두면, 지저분한 쿼리 수행 내역이 안뜸.

// 만드려고 하는 테이블에  charset:'utf8', collate:'utf8_general_ci' 옵션을 주면, 한글을 사용할 수 있음.

// sequelize 의 메서드들은 promise 객체를 반환함. --> async await 사용.