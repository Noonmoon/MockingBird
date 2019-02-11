var express = require('express')
var router = express.Router();
var expressValidator = require('express-validator');
var { body } = require('express-validator/check');
var dbHelper = require('../lib/data-helpers.js')
var passport = require('passport')
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(expressValidator())

// route for Home-Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.post('/search', function(req, res, next) {
  const db = require('../db.js');
  let name = req.body.user
  let back = req.header('Referer') || '/';

  // validate with javscript eventually
  db.query('SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)', [name.toString()], function(err, results, fields) {
    if (results[0][Object.keys(results[0])[0]] === 1) {
      res.redirect(`/user/profile/${name}`)
    } else {
      res.render('index', {reg_error:'username'})
    }
  })
})


module.exports = router;