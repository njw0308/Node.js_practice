const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash'); // req 객체에 req.flash 메서드 추가.
const passport = require('passport');

require('dotenv').config() 

const indexRouter = require('./routes/page');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 5129);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // 실제 주소 (/uploads) 와 접근 주소(/img)를 다르게 만들 수 있음.
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(flash());

// passport 미들웨어.
app.use(passport.initialize()); // 설정 초기화. 요청(req 객체) 에 passport 설정을 넣어둠.
    // ---- 로그인 이후 ----
    // passport.deserializerUser 메서드 호출.
app.use(passport.session()); // 사용자 정보를 세션에다 저장. req.session 객체에 passport 정보를 저장 

// 라우터 미들웨어 연결.
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
// 에러처리.
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development?' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 서버 실행 중입니다.`);
});