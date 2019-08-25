//npm이란 무엇인가?
// --> 노드를 설치하면 npm도 같이 설치됨.
// --> 노드의 패키지 관리자!!
// --> 패키지? 다른 사람이 만들어둔 모듈. 
// --> 노드는 코딩을 하는 느낌이 아니고 레고 블록 같은 느낌.
// --> 패키지를 찾아서 내 프로젝트에 적용을 하면 되는. 
// --> 이미 사람들이 만들어놔서 가져다 쓰기만 하면 되니까.

// 모듈 --> 노드의 내장 모듈. 
// 패키지 --> 남들이 만든 모듈.

// 패키지 만들기!
// 1. npm init  --> package.json 파일이 생김. --> 패키지에 대한 설명서!!

// 패키지 설치하기. 
// 주의 사항 : package.json 파일이 있는 위치. 거기에다 해야함
// 1. npm install express --> package-lock.json 이 생기고, 추가적으로 이상한 모듈들도 같이 깔림.
// --> 이것들이 모냐면!! express가 사용하고 있는 패키지임.  --> 꼬리를 물고 관련되어 있는 애들을 가져옴 --> 즉, 한 번에 다 가져옴.
// --> 우리가 다운 받았던 express 는 package.json 에 dependencies 쪽에 생김.
// 추가적으로) --save-dev 를 추가해서 install 하면, 배포 환경에서는 안 쓰고 개발 환경에서만 사용한다는 뜻. 얘는 package.json 에 devDependencies 쪽에 생김.
//           동시에 설치할 수도 있음. 그냥 옆에다 같이 쓰면 됨. ex) npm install express cookie-parser


// 축약 표현.  npm i == npm install
//            npm i -D == npm install --save-dev


// global --> 명령어처럼 동작할 수 있음. == console 에다 칠 수 있다는 뜻
// --> 환경변수에다 세팅하고 설치하고 그랬어야 했는데, --global 을 붙여서 설치하니까 가능하게 함.
// 명령어로 쓸 수 있는 패키지를 설치할 때 global 옵션을 쓴데.
// npm i --global rimraf  == npm i -g rimraf