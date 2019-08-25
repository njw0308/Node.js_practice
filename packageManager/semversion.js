//semver 은 3자리로 구성되어 있음.
// 각 자리마다 의미가 있음.

// ((메이저 버전. 마이너 버전. 패치 버전)) 
// patch 는 버그 수정
// minor 는 신기능 추가, 하위 호환이 되는 기능 업데이트
// major 는 대규모 변화, 하위 호환이 안 될 정도로 패키지의 내용이 수정되었을 때

// 버전을 수정할 때는 그래서 늘 유의해야 함!! 
// --> 특히 major 는 하위 호환이 안되기 땜시.

// ^ --> minor, patch 는 업데이트 해도 된다.
// ex) express@^1.1.1 --> 1.1.1 <= 버전에서 <2.0.0 까지 설치. 즉, 1.x.x 처럼 표시.

// ---------------------------------
// npm 기타 명령어.

// npm outdated --> 업데이트 할 수 있는 패키지가 있는지 확인.
// npm update [패키지 명]--> 업데이트 가능한 패키지를 업데이트.
// npm remove [패키지 명] == npm rm [패키지 명] --> 패키지를 지우는 것.
// npm search [패키지 명] --> 무슨 패키지들이 있는지 검색할 수가 있음.
// npm info [패키지 명] --> 패키지에 대한 package.json 파일이 보여줌.
// npm ls [패키지 명] --> 이 패키지 명이 왜 설치되어 있는지 어떤 경위(?) 를 보여줌.

// 내가 만든 package를 배포해보기.
// npm adduser --> 로그인
// npm whoami --> 내 아이디 말해줌.
// npm logout --> 로그아웃.
// npm publish --> 배포
// npm unpublish [패키지 명] --force --> 배포된 패키지를 내리는 방법. (24 시간 이내에 해야 함)


// 버전 수정 방법.
// 1. 그냥 package.json 에서 직접 수정.
// 2. npm version patch  || npm version minor || npm version major

