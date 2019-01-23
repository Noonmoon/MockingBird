var express = require('express')
const router = express.Router();
const uuid = require('uuid/v4');
var app = express()

// router.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// });

// respond with "hello world" when a GET request is made to the homepage
router.get('/', function (req, res) {
  res.render('index.pug')
})

router.get('/registration', function(req, res) {
  res.render('register')
})

router.get('/login', function(req, res) {
  res.render('login')
})

router.get('/user/:id', function(req, res) {
  res.render('user-profile')
})


module.exports = router;