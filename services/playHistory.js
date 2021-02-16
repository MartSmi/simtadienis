const appRoot = require('app-root-path');
const dbPool = require(appRoot + '/db').pool;

function insert(userID, gameID, bet, winnings, ended = true) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'INSERT INTO play_history (user_id, game_id, bet, winnings, ended, time) VALUES(?, ?, ?, ?, ?, CURRENT_TIME())',
      [userID, gameID, bet, winnings, ended],
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
}

module.exports = { insert };
