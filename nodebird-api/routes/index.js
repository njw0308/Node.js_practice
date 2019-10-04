const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

const { User, Domain } = require('../models');

router.get('/', (req, res, next) => {

    if (req.user) {
        User.findOne({
            where : { id : req.user && req.user.id },
            include: {model : Domain},
        })
        .then( (user) => {
            res.render('login', {
                user, 
                loginError : req.flash('loginError'),
                domains: user && user.domains,
            });
        })
        .catch( (err) => {
            console.error(err);
            next(err);
        })
    } else {
        res.render('login')
    }
})

router.post('/domain', (req, res, next) => {
    Domain.create({
        userId: req.user.id,
        host: req.body.host,
        type: req.body.type,
        clientSecret: uuidv4(),
        frontSecret: uuidv4(),
    })
    .then( () => {
        res.redirect('/');
    })
    .catch((err) => {
        next(err);
    });
});

module.exports = router;
