// 몽구스는 ODM 이라 불림. 
// 릴레이션이 아닌 다큐먼트이기 때문에.
const mongoose = require('mongoose');

module.exports = () => {
    // 몽고디비 연결하기.
    // 주소 형식 mongodb://[username:password@]host[:port][/database][?options]]
    // [] 부분은 없어도 되는 부분. 
    const connect = () => {mongoose.connect('mongodb://localhost/', {
        dbName: 'nodejs'
    }, (error) => {
        if (error) {
            console.log('몽고디비 연결 에러', error);
        } else { 
            console.log('몽고디비 연결 성공');
        }
    });
    };
    connect()
    // 디비가 연결이 끊어진 것을 감지하게끔. 이벤트리스너들.
    mongoose.connection.on('error', (error) => {
        console.error('몽고디비 연결 에러', error);
    });
    mongoose.connection.on('disconnected', (error) => {
        console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도 합시다');
        connect();
    });

    // 연결한 후에.
    require('./user');
    require('./comment');
};