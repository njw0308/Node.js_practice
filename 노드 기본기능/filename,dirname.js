// 현재 파일 경로와 그 파일이 있는 디렉토리 위치.
console.log(__filename)
console.log(__dirname)

// 노드는 싱글쓰레드 인데 그 단점을 보완하기 위해 멀티프로세싱을 한다.
// process 객체에는 현재 실행중인 노드 프로그램 정보가 들어있음.
// process.version
// process.arch
// process.platform
// process.pid --> 프로세스 아읻.
// process.uptime() --> 프로세스가 실행된 후 얼마나 지났는지.
// process.cwd() --> 프로세스 실행 위치.
// process.execPath --> 노드가 설치된 경로
// process.cpuUsage() --> cpu 사용량
// process.exit() --> 프로세스 종료
// --> 노드로 웹 쪽 서버가 아닌 데스크탑 프로그램을 돌릴 때 이런 객체들이 필요함.