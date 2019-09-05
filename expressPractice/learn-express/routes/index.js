var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.render('test', {
    fruits: ['사과', '배', '오렌지']
  })
});


// 라우터는 요청을 보낸 클라이언트에게 응답을 보내주어야 한다.
// send, sendFile, json, redirect, render 와 같은 메서드들이 있음. 
module.exports = router;
