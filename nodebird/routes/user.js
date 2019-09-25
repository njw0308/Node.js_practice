const express = require('express');
const router = express.Router();

const { User, Post } = require('../models');
const {isLoggedIn} = require('./middlewares');

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({where: {id : req.user.id}});
        await user.addFollowing(parseInt(req.params.id, 10));
        res.send('success');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({where : { id : req.user.id}});
        await user.removeFollowing(parseInt(req.params.id, 10));
        res.send('success');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({where : {id : req.user.id}});
        await user.addLikes(parseInt(req.params.id, 10));
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/:id/unlike', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({where : {id : req.user.id}});
        await user.removeLikes(parseInt(req.params.id, 10));
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
    try {
        await Post.destroy({where : { id : parseInt(req.params.id, 10)}});
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/profile', isLoggedIn, async (req, res, next) => {
    try {
        const { nick } = req.body;
        await User.update({nick}, {where : {id : req.user.id}});
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;