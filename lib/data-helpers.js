module.exports.verifyUserByName = function(name) {
  const db = require('../db.js');

  db.query('SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)', [name.toString()], function(err, results, fields) {
    return results[0];
  })
}

