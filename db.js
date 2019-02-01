var secret = require('./env.js')
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : secret.DB_HOST,
  user     : secret.DB_USER,
  password : secret.DB_PASSWORD,
  database : secret.DB_NAME,
  port: 3306
})

connection.connect()

module.exports = connection;

