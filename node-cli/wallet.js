#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer'); // cli 창에서 사용자와 상호작용할 수 있도록.
const chalk = require('chalk'); // cli 창의 UI 관리?
const { version } = require('./package');
const { Wallet } = require('./models/index');
var { sequelize } = require('./models/index');

sequelize.sync(); // 서버가 시작될 때 테이블들이 만들어짐.

const dbSave =  (money, description, type) => {
    if (type) {
        Wallet.create({
            money,
            description,
            type
        })
        .then((result) => {
            console.log(result)
            sequelize.close()
            triggered = true
        })
        .catch((err) => {
            console.error(err)
        })
    } else {
        console.log(money, description, type)
    }
    
}

var triggered = false

program
.version(version, '-v, --version')
.usage('[options]')

program
.command('income <money> <description>')
.usage('<money> <description>')
.description('수입을 기록합니다.')
.alias('inc')
.action((money, description) => {
    console.log(money, description)
    sequelize.sync() // 서버가 시작될 때 테이블들이 만들어짐.
    // await Wallet.create({
    //     money : parseInt(money, 10),
    //     description,
    //     type : true
    // })
    dbSave(parseInt(money, 10), description, true)
})

program
.command('expense <money> <description>')
.usage('<money> <description>')
.description('지출을 기록합니다.')
.alias('exp')
.action(async (money, description) => {
    console.log(money, description)
    await sequelize.sync() // 서버가 시작될 때 테이블들이 만들어짐.
    await  Wallet.create({
        money : parseInt(money, 10),
        description,
        type : false
    })
    await sequelize.close()
    triggered = true
})

program
.command('select')
.description('가계부 내역을 조회합니다.')
.action(async () => {
    await sequelize.sync()
    let results = await Wallet.findAll({
        raw : true,
        attributes: ['id', 'money', 'description', 'type']
    })
    let income = results.filter(el => el.type === 1).reduce((acc, cur) => acc + cur.money, 0)
    let expense = results.filter(el => el.type === 0).reduce((acc, cur) => acc + cur.money, 0)

    console.log(` 수입은 ${income}원 입니다.`)
    console.log(` 지출은 ${expense}원 입니다.`)

    await sequelize.close()
    triggered = true

})

program.parse(process.argv)

if(!triggered) {
    inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '수입 내역 / 지출 내역/ 조회 중에 선택하세요',
        choices: ['income', 'expense' , 'select'],
    }])
    .then(async (anw) => {
        if (anw.type === 'select') {
            await sequelize.sync()
            let results = await Wallet.findAll({
                raw : true,
                attributes: ['id', 'money', 'description', 'type']
            })
            let income = results.filter(el => el.type === 1).reduce((acc, cur) => acc + cur.money, 0)
            let expense = results.filter(el => el.type === 0).reduce((acc, cur) => acc + cur.money, 0)
        
            console.log(` 수입은 ${income}원 입니다.`)
            console.log(` 지출은 ${expense}원 입니다.`)
        
            await sequelize.close()
        }
        else {
            inquirer.prompt([{
                type: 'input',
                name: 'money',
                message: '금액을 입력하세요'
            }, {
                type: 'input',
                name: 'description',
                message: '설명 해주세요'
            }, {
                type: 'confirm',
                name: 'confirm',
                message: '생성하시겠습니까?'
            }])
            .then(async (anw2) => {
                if (anw.type === 'expense') {
                    await sequelize.sync() // 서버가 시작될 때 테이블들이 만들어짐.
                    await  Wallet.create({
                        money : parseInt(anw2.money, 10),
                        description: anw2.description,
                        type : false
                    })
                    await sequelize.close()
                } else if (anw.type === 'income') {
                    await sequelize.sync()
                    await Wallet.create({
                        money : parseInt(anw2.money, 10),
                        description: anw2.description,
                        type : true
                    })
                    await sequelize.close()
                }
            })
        }
    })
}