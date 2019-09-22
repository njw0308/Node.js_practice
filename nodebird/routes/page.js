const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { Post, User } = require('../models');

// 프로필 페이지.
router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile', {title : '내 정보 - NodeBird', user: req.user})
});

// 회원가입 페이지.
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

// 메인 페이지.
router.get('/', (req, res, next) => {
    Post.findAll({
        include: {
            model: User, // 게시글 작성자 모델이랑 연결.
            attributes: ['id', 'nick'],
        },
        order: [['createdAt', 'DESC']],
    })
    .then((posts) => {
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
            user: req.user,
            loginError: req.flash('loginError')
        })
    })
    .catch((err) => {
        console.error(err);
        next(err);
    });
});

module.exports = router;