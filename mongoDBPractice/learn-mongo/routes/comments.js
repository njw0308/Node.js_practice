var express = require('express');
var router = express.Router();
var Comment = require('../schemas/comment');

router.get('/:id' , (req, res, next) => {
    // populate?? 
    // Comment 스키마 commenter 필드의 ref가 User로 되어있으므로 알아서 users 컬렉션에서 
    // 해당 id 를 지닌 user 를 가져와버림. 
    // 그 결과 commenter 필드가 사용자 다큐먼트로 치환됨.
    // ex) 
    // 0: {_id: "5d70d4b8ffb5b408b039d4d6",…}
        // comment: "수정"
        // commenter: {_id: "5d70d499ffb5b408b039d4d3", name: "test", age: 1, married: false,…}
        // _id: "5d70d499ffb5b408b039d4d3"
        // createdAt: "2019-09-05T09:26:16.624Z"
        // __v: 0
        // _id: "5d70d4b8ffb5b408b039d4d6"
    Comment.find({commenter : req.params.id}).populate('commenter')
        .then((comments) => {
        res.json(comments);
    })
        .catch((err) => {
        console.error(err);
        next(err)
    })
});

router.post('/', (req, res, next) => {
    const post = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });
    post.save()
        .then((result) => {
        res.status(201).json(result);
    })
        .catch((err) => {
        console.error(err);
        next(err);
    })
});

router.patch('/:id', (req, res , next) => {
    Comment.update({_id: req.params.id}, { comment: req.body.comment})
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        console.error(err);
        next(err)
    })
});

router.delete('/:id', (req, res, next) => {
    Comment.remove({_id: req.params.id})
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        console.error(err);
        next(err)
    })
});

module.exports = router; 