const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models')

const obj = {}; // db 요청 횟수를 줄이기!

module.exports = (passport) => {

    // req.login 때만 호출되기 때문에 1번만 호출된다고 생각하면 됨.
    // req,session 객체에 어떤 데이터를 저장할지 선택.
    // 매개변수 user --> 로그인 사용자의 정보.
    // 세션에 사용자의 아이디만 저장하라고 done 을 통해 명령한 것.
    passport.serializeUser((user, done) => {
        // 6. req.session에 사용자 아이디만 저장
        done(null, user.id);
    });
    
    // 미들웨어가 작동할 때마다 매번 호출된다고 생각하면 됨.
    // -----로그인 이후 -----
    // 1. passport.session() 미들웨어가 이 메서드를 호출.
    // 2. serializerUser(위 메서드)에서 세션에 저장했던 아이디를 받아 DB에서 사용자 정보 조회.
    passport.deserializeUser((id, done) => {
        if ( obj[id]) {
            done(null, obj[id]);
        } else {
            User.findOne({where: { id }})
            .then(user => { obj[id] = user; return done(null, user)}) //3. 조회된 사용자 정보를 req.user에 저장.  --> 4. 라우터에서 req.user 객체 사용 가능.
            .catch(err => done(err));
        }
       
    });

    // 전략을 등록하는 것. authenticate('local') authenticate('kakao') 같은
    local(passport);
    kakao(passport);
}

// strategy --> 누구를 로그인 시킬 것인가 