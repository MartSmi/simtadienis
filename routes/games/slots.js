const { resolve } = require('app-root-path');
const appRoot = require('app-root-path');
const express = require('express');
const dbPool = require(appRoot + '/db').pool;
const logger = require(appRoot + '/logger');
const router = express.Router();
const gameID = 2; //Slots' game id
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /slots without logging in');
    res.redirect(303, '/');
    return;
  } else if (Date.now() < enterTimestamp) {
    logger.warn('attempt to access /slots before time');
    res.redirect(303, '/');
    return;
  } else if (Date.now() > endTimestamp) {
    logger.warn('attempt to access /slots after time');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance,
    };
    res.render('games/slots', opts);
  }
});

router.get('/spin', (req, res, next) => {
  if (!req.session.loggedIn) {
    logger.warn('spun slots without logging in');
    res.redirect(303, '/');
    return;
  }
  const slots = [randomSlotNum(), randomSlotNum(), randomSlotNum()];
  const winnings = calWinnings(slots);

  req.session.balance += winnings;
  res.send({ slots });

  const userID = req.session.userID;

  updateBalance(winnings, userID, req, next);

  dbPool.query(
    'INSERT INTO play_history (user_id, game_id, winnings, time) VALUES(?, ?, ?, CURRENT_TIME())',
    [userID, gameID, winnings],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /roulette (${req.ip}):`);
        next(err);
        return;
      }
    }
  );
});

function updateBalance(winnings, userID, req, next) {
  new Promise((resolve, reject) => {
    dbPool.query(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [winnings, userID],
      (err, rows) => {
        if (err) {
          logger.error(`DB error on /slots (UPDATE balance) (${req.ip}):`);
          reject(err);
        }
      }
    );
  })
    // .then(() => {
    //   dbPool.query(
    //     'SELECT balance FROM users WHERE id = ?',
    //     [userID],
    //     (err, rows) => {
    //       if (err) {
    //         logger.error(`DB error on /slots (SELECT balance) (${req.ip}):`);
    //         reject(err);
    //       }
    //       resolve(rows[0].balance);
    //     }
    //   );
    // })
    // .then(balance => {
    //   req.session.balance = balance;
    // })
    .catch(err => {
      next(err);
    });
}

function calWinnings(slots) {
  // Total of 84 combinations
  if (slots[0] == slots[1] && slots[1] == slots[2]) {
    if (slots[0] == 6) {
      // Got all best slots; Odds 1:83
      return 245;
    } else {
      // Got all the same slots; Odds 6:78
      return 95;
    }
  } else if (
    (slots[0] == slots[1] && slots[2] == 6) ||
    (slots[0] == slots[2] && slots[1] == 6) ||
    (slots[1] == slots[2] && slots[0] == 6)
  ) {
    // 2 slots are the same and the other one is the best one; Odds 6:78
    return 20;
  } else if (
    (slots[0] == slots[1] && slots[0] == 6) ||
    (slots[0] == slots[2] && slots[0] == 6) ||
    (slots[1] == slots[2] && slots[1] == 6)
  ) {
    // 2 slots are the best ones; Odds 6:78
    return 20;
  }
  // All slots are different or no best slot; Odds 65:19
  return -5;
}

function randomSlotNum() {
  return Math.floor(Math.random() * 7);
}

module.exports = router;
