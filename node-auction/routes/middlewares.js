exports.isLoggedIn = (req, res, next) => {
    // passport 는 req 객체에 isAuthenticated 메서드를 추가해줌.
    // --> 로그인 중이면 true 임.
    if (req.isAuthenticated()) {  
        next();
    } else {
        req.flash('loginError', '로그인이 필요합니다.');
        res.redirect('/');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}