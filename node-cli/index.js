#!/usr/bin/env node
// process.argv[0] --> 노드 설치 경로.
// process.argv[1] --> 파일 위치 경로.cli
// console.log('뚜몬 쪼아!!', process.argv);

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin, // 터미널에서 적는 것
    output: process.stdout, // 결과가 출력되는 것.
});

// 터미널 부분이 깔끔해짐.
console.clear();

const answerCallback = (anw) => {
    if(anw ==='y') {
        console.log('인디용인디용!!');
        rl.close(); 
    } else if (anw==='n') {
        console.log('쀼들?');
        rl.close(); 
    } else {
        console.log(" y 와 n 중에 입력하세요.");
        // y와 n 을 입력을 안하면 다시 질문하는 것.
        rl.question('멧돌커플이 짱입니까? (y/n)', answerCallback);
    }    
}
// rl 객체, 그 안에 들어있는 question 메서드를 통해 사용자와 상호작용 할 수 있음.

rl.question('멧돌커플이 짱입니까? (y/n)', answerCallback);