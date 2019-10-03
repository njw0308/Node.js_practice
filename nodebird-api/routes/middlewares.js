// 라우터에 접근 권한을 제어하는 미들 웨어. 
// --> 로그인한 사람만 할 수 있는 것과, 로그인하지 않은 사람만 할 수 있는 것을 구분.
// ex) 로그아웃 / 로그인(로그인 한 사람이 또 로그인 할 순 없으니까.)
const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    
    // passport 는 req 객체에 isAuthenticated 메서드를 추가해줌.
    // --> 로그인 중이면 true 임.
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        // req.headers.authorization --> 요청헤더에 저장된 토큰, 쿠키처럼 헤더에 토큰을 넣어 보낼 것.
        // jwt.verify 메서드로 토큰을 검증할 수 있음. jwt.verify(토큰, 비밀키)
        // req.decoded 에 대입하여 다음 미들웨어에서 쓸 수 있도록 하자!
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
}

exports.apiLimiter = new RateLimit({
    windowMS: 60 * 1000, // 기준 시간
    max: 5, // 허용 횟수
    delayMs: 0, // 호출 간격
    handler(req, res) { // 제한 초과시 콜백 함수
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: '1분에 5번 요청할 수 있습니다.',
        });
    },
});

exports.apiLimiterPremium = new RateLimit({
    windowMs: 60 * 1000,
    max: 10,
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: '1분에 10번 요청할 수 있습니다.',
        })
    }
})

// 버전 관리를 위한 미들웨어.
exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
};
