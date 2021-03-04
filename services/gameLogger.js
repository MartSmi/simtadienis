const appRoot = require('app-root-path');
const dbPool = require(appRoot + '/db').pool;

async function insert(userID, gameSessionID, score, gameLog) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'INSERT INTO game_log (user_id, game_session_id, score, time, log) VALUES(?, ?, ?, CURRENT_TIME(), ?)',
      [userID, gameSessionID, score, JSON.stringify(gameLog)],
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
}
module.exports = { insert };
