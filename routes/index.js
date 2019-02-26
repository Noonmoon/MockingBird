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
  let user_id;
  if (req.session.passport) {
    user_id = req.session.passport.user.user_id;
  }

  const db = require('../db.js');

  if (user_id) {
    db.query('SELECT username FROM USERS WHERE ID = ?', [user_id], function(err, results, fields) {
      let user = results[0].username;

      res.render('index', { title: 'Home', auth: user });
    })
  } else {
    res.render('index', { title: 'Home', auth: false });
  }
});

function getNames(results) {
  let names = [];
  for (let i = 0; i < results.length; i++) {
    names.push(results[i].following);
  }
  return names;
}

function getValueCount(results) {
  let string = '?'.repeat(results.length).split('').join(', ')

  return `(${string})`
}

router.get('/post/:id', function(req, res) {
  let follower = req.params.id;

  const db = require('../db.js');

  db.query('SELECT following FROM FOLLOWERS WHERE follower = ?', [follower], function(err, results, fields) {
    names = getNames(results)

    db.query(`SELECT text, date, user_id FROM POSTS WHERE USER_ID IN ${getValueCount(results)}`, names, function(err, results, fields) {
      res.json(results)
    })
  })
})

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