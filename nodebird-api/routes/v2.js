const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter, apiLimiterPremium } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

// cors 미들웨어가 응답헤더에 Access-Control-Allow-Origin 을 넣어줌으로써 해결해줌. 
// router.use(cors()); 

// 다르게 표현. --> 커스터마이징!
// router.use( async (req, res, next) => {
//     cors()(req,res,next); --> 미들웨어 내의 미들웨어 쓰는 방법.
// });

// 특정 도메인만 허용하기.
// router.use(cors({ origin : 'http://localhost:8003'}));
// router.use(cors({origin : (origin, callback) => {
//     if (['http://localhost:8001', 'http://localhost:8003'].indexOf(origin) !== -1) {
//         callback(null, true)
//     } else {
//         callback(new Error('Not allowed by CORS'))
//     }
// }}));

//Network 탭에서 , Access-Control-Allow-Origin: http://localhost:8003 로 바뀐다!
router.use(async (req, res, next) => {
    // req.get('origin') --> http://localhost:8003 --> request 를 날린 주소.
    try {
        // 에러가 발생하기 때문에 try - catch
        const domain = await Domain.findOne({
            where : {host : req.get('origin')},
        });
        if (domain) {
            cors({ origin: req.get('origin') })(req, res, next); // --> 미들웨어 커스터마이징
        }
    } catch(err) {
        next()
    }
});

// MARK: API 사용량 분할하기 solution1.
router.use(async (req, res, next) => {
    console.log(res)
    try {
        const domain = await Domain.findOne({
            where: {host : req.get('origin')},
        });
        console.log(domain.dataValues)
        if (domain.dataValues.type === "free") {
            apiLimiter(req, res, next);
        } else if (domain.dataValues.type === "premium") {
            apiLimiterPremium(req, res, next);
        }
    } catch(err) {
        next();
    }
})

// MARK: API 사용량 분할하기 solution2.
// const apiConfirm = () => {
//     return async (req, res, next) => {
//         try {
//             const domain = await Domain.findOne({
//                 where: {host : req.get('origin')},
//             });
//             console.log(domain.dataValues);
//             if (domain.dataValues.type === "free") {
//                apiLimiter(req, res, next);
//             } else if (domain.dataValues.type === "premium") {
//                apiLimiterPremium(req, res, next);
//             }
//         } catch(err) {
//             next();
//         }
//     }
// }

// router.use(apiConfirm());

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

router.get('/posts/my', verifyToken, (req, res) => {
    Post.findAll({where : {userId: req.decoded.id }})
    .then( (posts) => {
        console.log(posts);
        res.json({
            code: 200,
            payload: posts,
        });
    })
    .catch((err) => {
        return res.status(500).json({
            code:500,
            message: '서버 에러',
        });
    });
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({where : {title: req.params.title}});
        if( !hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        })
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

router.get('/follower', verifyToken, async ( req, res) => {
    try {
        const followers = await User.findAll({
            where : { id : req.decoded.id },
            attributes: ['id', 'nick'],
            include : [{
                model : User,
                attributes: ['id', 'nick'],
                as : 'Followers'
            }]
        })
        res.json({
            code : 200,
            payload: followers,
        })
    } catch(err) {
        console.error(err);
        return res.status(404).json({
            code: 404,
            message: '검색 결과가 없습니다.',
        })
    }
});

router.get('/following', verifyToken, async (req, res) => {
    try {
        const followings = await User.findAll({
            where : { id : req.decoded.id },
            attributes: ['id', 'nick'],
            include : [{
                model : User,
                attributes: ['id', 'nick'],
                as : 'Followings'
            }]
        })
        res.json({
            code : 200,
            payload: followings,
        })    
    } catch(err) {
        console.error(err);
        return res.status(404).json({
            code: 404,
            message: '검색 결과가 없습니다.'
        })
    }
})


module.exports = router;