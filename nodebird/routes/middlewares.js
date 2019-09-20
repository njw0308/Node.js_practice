// 라우터에 접근 권한을 제어하는 미들 웨어. 
// --> 로그인한 사람만 할 수 있는 것과, 로그인하지 않은 사람만 할 수 있는 것을 구분.
// ex) 로그아웃 / 로그인(로그인 한 사람이 또 로그인 할 순 없으니까.)

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
}