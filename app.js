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
var MySQLStore = require('express-mysql-session')(session);


var app = express();
var indexRouter = require('./routes/index');

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
    // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
module.exports = app;
