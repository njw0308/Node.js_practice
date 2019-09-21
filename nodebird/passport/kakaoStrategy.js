const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback', // 카카오로부터 인증결과를 받을 라우터 주소.
    }, async (accessToken, refreshToken, profile, done) => { // sns를 통해 login 은 보통 토큰 기반으로 하게 됨.
        // 로그인은 카카오가 대신 처리해주지만 디비에도 그 카카오로 로그인한 사용자를 저장해야함.
        try {
            // 로그인 한 유저가 이미 가입이 되어있는지 확인.
            const exUser = await User.findOne({
                where : {
                    snsId: profile.id,
                    provider: 'kakao',
                },
            });
            if (exUser) {
                done(null, exUser);
            } else {
                // 최초 로그인한 사람이라면 디비에 저장.
                const newUser = await User.create({
                    email: profile._json && profile._json.kaccount_email, // kakao 가 이런 식으로 데이터를 넘김.
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch( err) {
            console.error(err);
            done(error);
        }
       
    }))
}