const express = require('express')
const router = express.Router();
const app = express();
var expressValidator = require('express-validator');
router.use(expressValidator())

// route for Home-Page
router.get('/', function(req, res, next) {
  res.render('index');
});

// route for user signup
router.get('/register', function(req, res, next) {
  res.render('register');
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

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], function(error, results, fields) {
      if (error) throw error;

      res.render('index', {title: 'Registration Complete'});
    })
  }
});

// route for user Login
router.get('/login', function(req, res) {
  res.render('login.pug');
})

module.exports = router;