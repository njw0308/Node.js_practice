var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 유용한 팁. 
// --> 일반 라우터보다 뒤에 위치해야함. 다양한 라우터를 아우르는 와일드카드 역할.
router.get('/:id', function(req, res) {
  console.log(req.params, req.query);
})

// 라우터는 요청을 보낸 클라이언트에게 응답을 보내주어야 한다.
// send, sendFile, json, redirect, render 와 같은 메서드들이 있음. 
module.exports = router;
