const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const { Post , Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

// multer 모듈에 옵션 주기.
const upload = multer({
    // 이미지를 어디에 저장할지.
    storage: multer.diskStorage({
        // 저장할 파일 경로
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); //파일의 확장자.
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    // 파일 사이즈
    limit: { fileSize : 5 * 1024 * 1024 },
});

// 이미지 업로드 처리.
// upload 객체에 다양한 메서드가 있음. single --> 하나의 이미지를 업로드할 떄 사용하며, req.file 객체를 생성함. 
// array, fileds 메서드는 여러개의 이미지를 업로드할 때 사용하며, req.files 객체를 생성함.
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({url : `/img/${req.file.filename}`})
});

// 게시글 업로드 처리.
const upload2 = multer();
router.post('/' , isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content : req.body.content,
            img: req.body.url,
            userId: req.user.id,
        })
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            console.log(hashtags);
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({ // DB에 있으면 찾고 없으면 새로 생성.
                where : { title : tag.slice(1).toLowerCase() },
            })));
            console.log(result);
            // addHashtags 는 post 데이터에 시퀄라이즈가 추가해주는 메서드.
            await post.addHashtags(result.map(r => r[0] )); // 게시글과 해시태그의 관계를 PostHashtag 테이블에 넣음.
        }
        res.redirect('/');
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 해쉬태그 검색 기능 구현.
router.get('/hashtag', async (req, res, next) => {
    // 프론트에서 req 가 이렇게 날라옴. --> GET /post/hashtag?hashtag=[value]
    // form#hashtag-form(action='/post/hashtag')
    // input(type='text' name='hashtag' placeholder='태그 검색')
    // button.btn 검색
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    } 
    try {
        const hashtag = await Hashtag.findOne({where : {title : query}});
        let posts = [];
        if (hashtag) {
            // getPosts 는 hashtag 데이터에 시퀄라이즈가 추가해주는 메서드.
            // include: [{}]는 여러 모델을 동시에 JOIN하고 싶을 때 사용합니다. {}는 하나만 할 때 쓰고요.
            posts = await hashtag.getPosts({include: [{model : User }]});
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user: req.user,
            twits: posts,
        }); 
    } catch (err) {
        console.error(err);
        return next(err);
    }
})

module.exports = router;