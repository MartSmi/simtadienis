const appRoot = require('app-root-path');
const dbPool = require(appRoot + '/db').pool;

function get(userID) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT balance from users WHERE id = ?',
      [userID],
      (err, rows) => {
        if (err) reject();
        resolve(rows[0].balance);
      }
    );
  });
}

function update(amount, userID) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [amount, userID],
      err => {
        if (err) {
          reject(err);
        }
      }
    );
  });
}

module.exports = { update, get };
