var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var secret = require('./env.js')
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var expressValidator = require('express-validator');

// AUTH PACKAGES
var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt')

var app = express();
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user')

require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var options = {
  host     : secret.DB_HOST,
  user     : secret.DB_USER,
  password : secret.DB_PASSWORD,
  database : secret.DB_NAME,
  port: 3306
};

var sessionStore = new MySQLStore(options);

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    secret: 'admin',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    // cookie: { secure: true } for https
}));
app.use(passport.initialize());
app.use(passport.session());

// set global variables
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();

  next();
})

app.use('/', indexRouter);
app.use('/user', userRouter);

passport.use(new LocalStrategy(
  function(username, password, done) {
    const db = require('./db')

    db.query('SELECT id, password FROM users WHERE username = ?', [username], function(err, results, fields) {
      if (err) done(err);

      if (results.length === 0) {
        done(null, false);
      } else {
        const hash = results[0].password.toString()

        bcrypt.compare(password, hash, function(err, response) {
          if (response === true) {
            return done(null, {user_id: results[0].id});
          } else {
            return done(null, false);
          }
        })
      }
    })
  }
));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

module.exports = app;
