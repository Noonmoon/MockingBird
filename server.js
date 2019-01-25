var app = require('./app');
var http = require('http');
var mysql = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'deadmoons13',
  database : 'remedy'
});

connection.connect()
connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end()

var port = normalizePort(process.env.PORT || '3000');

app.set('port', port);
const server = http.createServer(app);

server.listen(port);
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}