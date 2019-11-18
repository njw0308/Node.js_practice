const LocalStorage = require('passport-local').Strategy; // Strategy 생성자.
const bcrypt = require('bcrypt');
const { User } = require('../models')

module.exports = (passport) => {
    passport.use(new LocalStorage({
        usernameField: 'email', //req.body.email
        passwordField: 'password', // req.body.password
    }, async (email, password, done) => { //done (에러, 성공, 실패)
        try {
            const exUser = await User.findOne({ where : { email }}); //db에서 해당 이메일을 가진 사람 찾아오기.
            if (exUser) {
                // 비밀번호 검사.
                const result = await bcrypt.compare(password, exUser.password, function(err, result) {
                    if (result) {
                        done(null, exUser);
                    } else {
                        console.log('비밀번호 불일치');
                        done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                    }
                });
                // if ( result ) {
                //     // 성공
                //     done(null, exUser);
                // } else {
                //     // 비번 틀린 경우.
                //     done(null, false, { message: '비밀번호가 일치하지 않습니다.'})
                // }
            } else {
                // 실패하는 경우.
                done(null, false, { message: '가입되지 않은 회원입니다.'})
            }
        } catch( err) {
            console.error(err);
            done(err);
        }
    }))
}