const express = require('express');
const router = express.Router();

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

router.get('/' , async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError')});
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/room', (req, res, next) => {
    res.render('room', {title : "GIF 채팅방 생성"});
})

router.post('/room', async (req, res, next) => {
    try {
        const room = new Room({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });
        const newRoom = await room.save();
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/room/:id', async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id : req.params.id});
        const io = req.app.get('io');
        if (!room) {
            req.flash('roomError', '존재하지 않는 방입니다');
            return res.redirect('/');
        }
        if (room.password && room.password !== req.query.password) {
            req.flash('roomError', '비밀번호가 틀렸습니다.');
            return res.redirect('/');
        }
        const { rooms } = io.of('/chat').adapter;
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
            req.flash('roomError', '허용 인원이 초과되었습니다.');
            return res.redirect('/');
        }
        return res.render('chat', {
            room,
            title: room.title,
            chats :[],
            user: req.session.color,
        });
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

router.delete('/room/:id', async (req, res, next) => {
    try {
        await Room.remove({ _id : req.params.id});
        res.send('OK');
        setTimeout( () => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id)
        }, 2000);
    } catch ( err ) {
        console.error(err);
        next(err);
    }
});

module.exports = router