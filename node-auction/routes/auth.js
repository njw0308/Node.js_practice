const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password, money } = req.body;
    try {
        const exUser = await User.findOne({where : {email}});
        if (exUser) {
            req.flash('joinError', '이미 가입된 유저');
            return res.redirect('/join');
        } 
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
            money,
        });
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    // http://www.passportjs.org/packages/passport-local/ 
    // Use passport.authenticate(), specifying the 'local' strategy, to authenticate requests.
    passport.authenticate('local', (authError, user, info) => { 
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user , (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 라우터 미들웨어 안에, passport 미들웨어가 있는 형태. --> 이런 경우 내부 미들웨어에 (req, res, next)를 인자로 제공해서 호출하는 것. 'customizing'
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destory();
    res.redirect('/');
});

module.exports = router;