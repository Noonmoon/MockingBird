var express = require('express')
var router = express.Router();
var moment = require('moment')

var expressValidator = require('express-validator');
var passport = require('passport')
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(expressValidator())


/* PERSONAL PROFILE
-------------------------------------------------- */
router.get('/profile', authenticationMiddleware(), function(req, res) {
  let user_id = req.session.passport.user.user_id;
  const db = require('../db.js');

  // RETRIEVE USERNAME FROM DB
  db.query('SELECT username FROM USERS WHERE ID = ?', [user_id], function(err, results, fields) {
    if (err) throw err;
    let username = results[0].username

    // RETRIEVE POSTS FROM DB
    db.query('SELECT text, date FROM POSTS WHERE USER_ID = ?', [username.toString()], function(err, results, fields) {
      if (err) throw err;
      posts = results;

      res.render('profile', { title: 'Profile', username: username, posts: JSON.stringify(posts) })
    })
  })
})

router.post('/profile', authenticationMiddleware(), function(req, res) {
  let user_id = req.session.passport.user.user_id;

  const db = require('../db.js');

  // RETRIEVE USERNAME FROM DB
  db.query('SELECT username FROM USERS WHERE ID = ?', [user_id], function(err, results, fields) {
    if (err) throw err;

    // INSERT POSTS INTO DB
    let username = results[0].username
    let postText = req.body.text;
    let postDatetime = moment().format('YYYY-MM-DD h:mm:ss');

    db.query('INSERT INTO posts (date, text, user_id) VALUES (?, ?, ?)', [postDatetime, postText, username], function(err, results, fields) {
      if (err) throw err;

      res.redirect('back')
    })
  })
})

/* LOGIN/LOGOUT
-------------------------------------------------- */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/login'
}));

router.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
})


/* REIGISTRATION
-------------------------------------------------- */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.post('/register', function(req, res, next) {
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 3-15 characters long.').len(3, 15);
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 8-30 characters long.').len(8, 30);
  req.checkBody("password", "Password must include one lowercase character, one uppercase character, and a number.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/);
  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    console.log(`errors: ${JSON.stringify(errors)}`);

    res.render('register', {
      title: 'Registration Error',
      errors: errors
    })
  } else {
    let username = req.body.username;
    let password = req.body.password
    let email = req.body.email

    const db = require('../db.js');

    bcrypt.hash(password, saltRounds, function(err, hash){
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], function(error, results, fields) {
        if (error) throw error;

        db.query('SELECT LAST_INSERT_ID() as user_id', function(err, results, fields) {
          if (error) throw error;

          const user_id = results[0]

          req.login(user_id, function(err) {
            res.redirect('/');
          })
        })
      })
    })
  }
});


/* USER AUTH FUNCTIONS
-------------------------------------------------- */
passport.serializeUser(function(user_id, done) {
  done(null, user_id)
})

passport.deserializeUser(function(user_id, done) {
  done(null, user_id)
})

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();

    res.redirect('/user/login')
  }
}

module.exports = router;