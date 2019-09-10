#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

let rl
let type = process.argv[2]; // html 할 것인가 router 를 할 것인가.
let name = process.argv[3]; // 파일명
let directory = process.argv[4] || '.'; //파일 경로 지정.

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;


const routerTemplate = `const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('OK');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
`;

const mkdirp = (dir) => {
    // filter --> 배열에 undefined 껴있을 때 제거하는?
    const dirname = path.relative('.', path.normalize(dir)).split(path.sep).filter(p => !!p); // 상대경로를 알 수 있는 방법. 첫 번째 인자에서 두 번째 인로 가려면 어떻게 가야하는지 알려줌.
    dirname.forEach((element, idx) => {
        // slice(begin, end)
        const pathBuilder = dirname.slice(0, idx+1).join(path.sep);
        if (!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    })
};

const exist = (dir) => {
    try {
        //https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch(e) {
        return false;
    }
};

const makeTemplate = () => {
    mkdirp(directory);
    //html 파일을 만들고 싶어
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if( exist(pathToFile)) {
            console.error("이미 해당 파일이 존재합니다.");
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, '생성 완료');
        }
    // express-router 파일을 만들고 싶어.
    } else if ( type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.html`);
        if( exist(pathToFile)) {
            console.error("이미 해당 파일이 존재합니다.");
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else {
        console.error(`tml 또는 express-router 둘 중 하나를 입력하세요.
        사용방법: cli html|express-router 파일명 [생성 경로]`);
    }
};

const dirAnswer = (answer) => {
    directory = (answer && answer.trim()) || '.';
    rl.close();
    makeTemplate()
}

const nameAnswer = (answer) => {
    if (!answer || !answer.trim()) {
        console.clear();
        console.log('name을 반드시 입력하셔야 합니다.');
        return rl.question('파일명을 설정하세요', nameAnswer);
    }
    name = answer;
    return rl.question('지정할 경로를 설정하세요.(설정하지 않으면 현재경로)', dirAnswer);
}

const typeAnswer = (answer) => {
    if ( answer != 'html' && answer != 'express-router') {
        console.clear();
        console.log('html 또는 express-router 만 지원합니다.');
        return rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
    }
    type = answer;
    return rl.question("파일명을 설정하세요." , nameAnswer);
}

const program = () => {
    // 타입과 이름을 둘 다 입력하게끔.
    if(!type || !name) {
        // 사용자와 상호작용 할 readline 을 만듬. 
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        console.clear();
        rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
    } else {
        makeTemplate();
    }

};
program();