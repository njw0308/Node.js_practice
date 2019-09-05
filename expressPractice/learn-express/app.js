var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// express 에 대한 설정이라고 생각하면 됨. or 값 저장.
// --> 저장한 값은 나중에 사용함. app.set('key', 'value')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // pug 가 html 을 대체할 수 있도록 설정한 것.

// 미들웨어를 연결하는 부분 app.use
// --> 미들웨어가 익스프레스의 핵심!!
// 요청이 위에서 들어와서 아래에서 응답을 보여준다. 그 사이에 있는 미들웨어들한테 다 영향을 준다!! 
// 미들웨어에서 다음 미들웨어로 넘어가려면 next를 호출해야 함.
app.use((req,res, next) => {
  console.log('first middleware');
  next()
})

// --> if 문을 통해 브라우저의 흐름을 제어할 수 있음. 
// --> 로그인한 사용자인지 확인할 때 아래의 코드를 응용.
// app.use((req,res, next) => {
//   console.log('first middleware');
//   if (+new Date() % 2 == 0) {
//     next();
//   } else {
//     res.send('50% 당첨');
//   }
// })
// app.get , app.post 등은 GET, POST 요청들에만 걸리는 미들웨어를 장착하는 것.
// --> 주소가 붙으면 그 주소와 일치하는 요청만 걸림.
// --> 결과적으론 '특수한' 미들웨어라고 생각. 명칭은 '라우팅 미들웨어' 라고 함.


app.use(logger('dev')); // 요청에 대한 정보를 console 창에 기록해줌
app.use(express.json()); //요청의 본문을 해석해주는 미들웨어. 원래는 body-parser 라는 미들웨어인데 일부 기능이 express에 내장되어 있음.
// 아래와 같이 바꿔서 표현할 수도 있음.
// --> 다른 기능들을 추가할 수 있음. password를 바꿔준다는 등. 다른 기능을 확장할 때 쓰는 패턴!!
// app.use((req, res, next) => {
//   express.json()(req,res,next);
// })
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // 요청에 보내진 쿠키를 해석 해줌. 
app.use(express.static(path.join(__dirname, 'public'))); // 정적인 파일들을 제공해줌.

// 추가적인 유명한 미들웨어들.
// 1. express-session --> 세션 관리용 미들웨어.
// app.use(cookieParser('secret code'));
// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: 'secret code',
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
// }));
// 2. connect-flash --> 일회성 메세지들을 브라우저에 나타날 떄 유용함.
// app.use(flash()) 

// Router 객체로 라우팅 분리하기. --> router 도 일종의 미들웨어.
// use 메서드는 모든 http 메서드에 대해 요청 주소만 일치하면 장땡!
// --> 코드 관리를 위해 라우터를 별도로 분리하는 것.
app.use('/', indexRouter);
app.use('/users', usersRouter);


// 위에 걸리지 않는 주소가 넘어올 때!! 
// --> 응답을 보낼 수 없기 때문에, 클라이언트는 계속 기다리게 됨.
// --> 이런 현상을 막기 위해, 라우터에 걸리지 않는 경우를 생각해줘야 함.

// app.use((req, res, next) => {
//   res.status(404).send('NOT FOUND')
// })
// -------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// 400 번대는 보통 클라이언트. 
// 근디 가끔 서버에서 발생하는 에러도 있움. 
// 그런 것을 처리하기 위한 방안을 생각해줘야함!
// next(error) 를 하면 모든 미들웨어들을 다 건너뛰고 에러처리 미들웨어로 바로 이동함.

// app.use(function(err, req, res, next) {
//   console.log(err);
//   res.status(500).send('ERROR')
// })
//--------------------------------------------


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals 가 있는 이유는 다른 미들웨어 안에서도 선언이 가능하기 때문에
  // --> 지금 이 상황에서는 상관 없지만 나중에 다른 미들웨어 안에서 선언하고자 할 때 써먹을 수 있는 방법
  res.locals.message = err.message; 
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 
  // req.app 을 통해서 app 객체에 접근하는 것. 'env'는 'key' 
  // 개발 환경인 경우에는 에러메세지를 표현해주고, 배포 환경인 경우에는 에러메세지를 표현해주지 않음.

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
