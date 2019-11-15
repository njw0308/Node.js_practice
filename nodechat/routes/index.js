const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

var userList = [];

router.get('/' , async (req, res, next) => {
    try {
        console.log("접속접속");
        const rooms = await Room.find({});
        if (!userList.includes(req.session.color)) {
            userList = userList.concat(req.session.color);  
            console.log("userList 최초 : " , userList);         
        };
        res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError')});
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 방 만들기 화면
router.get('/room', (req, res, next) => {
    res.render('room', {title : "GIF 채팅방 생성"});
})

// 방 만들기
router.post('/room', async (req, res, next) => {
    try {
        const room = new Room({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });
        const newRoom = await room.save();
        const io = req.app.get('io'); // router 에서 웹 소켓에 접근할 수 있게끔.
        io.of('/room').emit('newRoom', newRoom);

        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`)

    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 특정한 방에 접속
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
        // 결과값 : 인원수 : undefined  --> 방을 만들면 자동으로 참여하는데 그 때 자기 자신을 인식하지 못하는거 같음.
        console.log(`인원수 : ${rooms[req.params.id]}`)
        const chats = await Chat.find({ room : room._id, system : false}).sort('createdAt'); // system이 남긴 메세지는 안 찾아도 되니까.
        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.session.color,
            number: rooms && rooms[req.params.id] && rooms[req.params.id].length + 1 || 1, // 최초 초깃값 1로 설정. 
        });
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

// 시스템 메세지 저장.
router.post('/room/system/:id/:userId/:type', async (req, res, next) => {
    try {
        if (req.params.type === 'in') {
            const chat = new Chat( {
                room: req.params.id,
                user: req.params.userId,
                system: true,
                chat: `${req.params.id} 방에 ${req.params.userId} 님이 입장하셨습니다.`
            });
            await chat.save()
        } else if (req.params.type === 'out') {
            const chat = new Chat( {
                room: req.params.id,
                user: req.params.userId,
                system: true,
                chat: `${req.params.id} 방에 ${req.params.userId} 님이 퇴장하셨습니다.`
            });
            await chat.save()
        }
        
        res.send('ok');
    } catch (err) {
        console.error(err);
        next(err);
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

router.post('/room/:id/chat', async (req, res, next) => {
    try {
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat,
        });
        await chat.save();
        // 클라이언트에게 chat 이벤트를 발생시킴.
        // req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat); // of( 'namepspace' ).to ( 'room' )
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', {
            socket: req.body.sid, // 프론트에서 넘어온 sid 
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat
        });
        res.send('ok');
    } catch(err) {
        console.error(err);
        next(err);
    }
});


fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: {fileSize : 5 * 1024 * 1024},
});

router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
    try {
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            gif: req.file.filename,
        });
        await chat.save()
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', {
            socket: req.body.sid, // 프론트에서 넘어온 sid 
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat
        });
        res.send('ok');
    } catch(err) {
        console.error(err);
        next(err);
    }
})

router.post('/room/:id/sys', async (req, res, next) => {
    try {
        const chat = req.body.type === 'join' ? `${req.session.color}님이 입장하셨습니다.` : `${req.session.color} 님이 퇴장하셨습니다.`;

        const sys = new Chat({
            room: req.params.id,
            user: 'system',
            chat,
        });
        await sys.save();
        req.app.get('io').of('/chat').to(req.params.id).emit(req.body.type, {
            user: 'system',
            chat,
            number: req.app.get('io').of('/chat').adapter.rooms[req.params.id].length,
        });

        // 방장이 나갔을 경우. 
        if(req.body.type === 'exit') {
            const currentRoom = await Room.findById(req.params.id)
            const checker = req.session.color === currentRoom.owner ? true : false;
            const index = userList.indexOf(req.session.color);
            userList.splice(index, 1);
            console.log("userList : " , userList);
            if (checker) {
                await Room.updateOne({_id: req.params.id}, {$set: {owner: userList[0]}});
            };
            res.send('ok')
        } else {
            res.send('ok');
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/room/:id/hiddenchat', async (req, res, next) => {
    try {
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            chat: "귓속말" + req.body.chat,
        });
        await chat.save();
        // 클라이언트에게 chat 이벤트를 발생시킴. req.body.otherId 는 상대방의 Id. 
        req.app.get('io').of('/chat').to(req.body.otherId).emit('chat', chat); // of( 'namepspace' ).to ( 'room' )
        res.send('ok');
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router