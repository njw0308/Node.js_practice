const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

// POST /auth/join
// router 객체 하나에 미들웨어를 여러 개 장착할 수 있음!
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne( {where: { email } });
        if (exUser) {
            req.flash('Joinerror', '이미 가입된 이메일입니다.');
            return res.redirect('/join'); // 회원가입페이지로 돌려보내기.
        } 
        // 비밀번호 암호화. 1초 정도쯤이 적당.
        console.time('암호화시간')
        const hash = await bcrypt.hash(password, 12);
        console.timeEnd('암호화시간')
        
        //DB에 저장.
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// POST auth/login --> 1. 로그인 요청이 들어옴.
router.post('/login', isNotLoggedIn, (req, res, next) => { //req.body.email , req.body.password
    
    // 2. passport.authenticate 메서드 호출. + 3. 로그인 전략 수행
    // done (성공, 실패, 에러) 가 아래로 전달!
    passport.authenticate('local', (authError, user, info) => {
    // 에러인 경우
    if (authError) {
        console.error(authError);
        return next(authError);
    } 
    // 실패인 경우
    if (!user) {
        req.flash('loginError', info.messasge)
        return res.redirect('/');
    }

    // 4. 로그인 성공시 사용자 정보 객체와 함께 req.login 호출.
    // 5. req.login 메서드가 passport.serializerUser 호출. req.login 에서 제공하는 user 객체가 serializerUser로 넘어감. --> passport.index 파일로 넘어가서 남은 로직 처리.
    // 성공인 경우. 
    return req.login(user, (loginError) => { // 로그인 후에 req.user 에서 찾을 수 있음. http://www.passportjs.org/docs/login/
        if (loginError) {
            console.error(loginError);
            return next(loginError);
        }
        return res.redirect('/');
    })

    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(); // passport 에서 추가해줌. --> req.user 객체를 제거.
    req.session.destroy(); // session 을 지워버림.
    res.redirect('/');
})

// GET auth/kakao - 카카오 로그인. --> kakao strategy 를 실행.
// --> kakao 서버가 우리 대신에 로그인 인증을 대신해줌!
// --> authenticate 에 콜백 함수가 없음, local 과 비교했을 때.
router.get('/kakao', passport.authenticate('kakao'));

// 결과를 받을 라우터.
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/', // 실패하는 경우 메인페이지로.
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;