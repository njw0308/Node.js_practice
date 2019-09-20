var express = require('express');
var router = express.Router();
const User = require('../schemas/user'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find()
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  });
  user.save()
    .then((result) => {
    console.log(result);
    res.status(201).json(result);
  })
    .catch((err) => {
    console.error(err);
    next(err);
  });
});

module.exports = router;
