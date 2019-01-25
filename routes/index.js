const express = require('express')
const router = express.Router();
const app = express();

// route for Home-Page
router.get('/', function(req, res) {
  res.render('index');
});

// route for user signup
router.route('/register')
  .get((req, res) => {
    res.render('register.pug');
  })

// route for user Login
router.route('/login')
  .get((req, res) => {
    res.render('login.pug');
  })

module.exports = router;