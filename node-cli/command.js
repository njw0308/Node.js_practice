#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer'); // cli 창에서 사용자와 상호작용할 수 있도록.
const chalk = require('chalk'); // cli 창의 UI 관리?

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

const makeTemplate = (type, name, directory) => {
    mkdirp(directory);
    //html 파일을 만들고 싶어
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if( exist(pathToFile)) {
            console.error(chalk.bold.red("이미 해당 파일이 존재합니다."));
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, chalk.bold.green('생성 완료'));
        }
    // express-router 파일을 만들고 싶어.
    } else if ( type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.html`);
        if( exist(pathToFile)) {
            console.error(chalk.bold.red("이미 해당 파일이 존재합니다."));
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, chalk.bold.green('생성 완료'));
        }
    } else {
        console.error(`tml 또는 express-router 둘 중 하나를 입력하세요.
        사용방법: cli html|express-router 파일명 [생성 경로]`);
    }
};

let triggered = false;
program
.version('0.0.1', '-v, --version')
.usage('[options]');

program
.command('template <type>')
.usage('--name <name> --path [path]')
.description('템플릿을 생성합니다.')
.alias('tmpl')
.option('-n, --name <name>', '파일명을 입력하세요', 'index')
.option('-d, --directory [path]', '생성 경로를 입력하세요.', '.')
.action((type, options) => {
    makeTemplate(type, options.name, options.directory);
    triggered = true;
});

program
.command('*', {noHelp: true})
.action(() => {
    console.log('해당 명령어를 찾을 수 없습니다.');
    program.help();
    triggered = true;
});

program.parse(process.argv);

if (!triggered) {
    inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '템플릿 종류를 선택하세요.',
        choices: ['html', 'express-router'],
    }, {
        type: 'input',
        name: 'name',
        message : '파일의 이름을 입력하세요.',
        default: 'index',

    }, {
        type: 'input',
        name: 'directory',
        message: '파일의 위치할 폴더의 경로를 입력하세요.',
        default: '.',
    }, {
        type: 'confirm',
        name: 'confirm',
        message: '생성하시겠습니까?',
    }])
    .then((answers) => {
        if (answers.confirm) {
            makeTemplate(answers.type, answers.name, answers.directory);
        }
    })
}
