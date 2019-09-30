const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

// 토큰을 발급하는 라우터
router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include :{
                model : User,
                attribute: ['nick', 'id'],
            },
        });

        if (!domain) {
            return res.status(401).json({
                code : 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        // sign 메서드로 토큰 발급 받기. sign( 토큰의 내용, 토큰의 비밀크, <토큰의 설정>)
        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m', // 1분
            issuer: 'nodebird',
        });
        return res.json({
            code:200,
            message: '토큰이 발급되었습니다.',
            token,
        })
    } catch (err) {
        console.error(err);
        // API 서버의 응답 형식을 하나로 통일. --> 여기서는 JSON 으로.
        return res.status(500).json({
            code : 500,
            message: '서버 에러',
        })
    }
})

// 토큰 테스트
router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

module.exports = router;