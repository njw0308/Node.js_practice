const SocketIO = require('socket.io'); 
module.exports = (server) => {
    const wss = new WebSocket.Server({ server }); // websocket 서버.

    // event 기반. 클러이언트 -> ws 요청 -> 서버  --> 이 때 터지는 event 가 connection(연결 중)
    wss.on('connection', (ws, req) => {

        // req.headers['x-forwarded-for'] --> 프록시 거치기 전의 아이피.
        // req.connection.remoteAddress  --> 최종 아이피
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('클라이언트 접속', ip);

        //클라이언트가 서버에게 메세지를 보냈을 때 발생하는 이벤트.
        ws.on('message', (message) => {
            console.log(message);
        });

        //서버에서 클라이언트로 메세지를 보냄.
        const interval = setInterval( () => {
            if (ws.readyState === ws.OPEN) { // ws.CONNECTING , ws.CLOSING, ws.CLOSED 
                ws.send('서버에서 클라이언트로 메세지를 보냅니다.');    
            }
        }, 3000)
        
        ws.interval = interval;

        ws.on('error', (error) => {
            console.log(error);
        });
        
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); // 서버가 쓸데 없는 일을 하지 않도록! "메모리 누수 방지"
        });
    });
};