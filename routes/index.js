var express = require('express')
var router = express.Router();

var expressValidator = require('express-validator');
var passport = require('passport')
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(expressValidator())

// route for Home-Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});


module.exports = router;