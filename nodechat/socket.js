const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io', io); // 라우터에서 io 객체를 쓸 수 있게 저장. req.app.get('io') 로 접근
    const room = io.of('/room') // namespace 만들기. 같은 네임스페이스끼리 데이터 전달.
    const chat = io.of('/chat');

    // io.use 메서드로 미들웨어를 장착할 수 있음. 
    // 익스프레스 미들웨어를 SOCKET.IO 에서 사용하는 방법.
    io.use((socket, next) => { 
        sessionMiddleware(socket.request, socket.request.res, next); // 세션미들웨어 커스터마이징
    });

    room.on('connection', (socekt) => {
        console.log('room 네임스페이스에 접속');
        socekt.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });

    chat.on('connection', (socekt) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request // 요청 객체에 접근. 
        const { headers: { referer } } = req;
        // req.headers.referer 에 웹 주소가 들어있음. 거기서 방 아이디를 가져올 것.
        const roomId = referer.split('/')[referer.split('/').length -1 ].replace(/\?.+/, '');
        socket.join(roomId); // 방에 들어옴.

        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다..`,
        });

        socekt.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socekt.leave(roomId); //방에서 나감.
            // 방에 인원이 하나도 없는 경우.
            const currentRoom = socekt.adapter.rooms[roomId]; // 방에 대한 정보. namespace 로 지정한 그 방이 아닌. join 으로 들어오는 고유명사로써 방.
            const userCount = currentRoom? currentRoom.length : 0;
            if (userCount === 0) {
                axios.delete(`http://localhost:8005/room/${roomId}`)
                .then(() => {
                    console.log('방 제거 요청 성공');
                })
                .catch((err) => {
                    console.error(err);
                });
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`,
                });
            }
        });
    });
};