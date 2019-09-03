var express = require('express');
var router = express.Router();
var { User } = require('../models')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll()
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })
});

// post 로 요청이 들어온 얘들은 body 에 들어있음.
router.post('/', (req, res, next) => {
  User.create({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  })
  .then((result) => {
    console.log(result)
    res.status(201).json(result)
  })
  .catch((err) => {
    console.error(err)
    next(err);
  })
});

module.exports = router;

// --------------req.params 와 req.body 의 차이 -----------------
// source : https://stackoverflow.com/questions/24976172/node-js-req-params-vs-req-body
// req.params is for the route parameters, not your form data.

// The only param you have in that route is _id:

// app.put('/api/todos/:_id', ...)
// From the docs:

// req.params
// This property is an object containing properties mapped to the named route “parameters”.
//  For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.


// req.body
// Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as body-parser and multer.

