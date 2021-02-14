const appRoot = require('app-root-path');
const express = require('express');
// var dbPool = require(appRoot + '/db').pool;
// var mysql = require('mysql');
var logger = require(appRoot + '/logger');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /slots without logging in');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance
    }
    res.render('games/slots', opts);
  }
});

router.post('/spin', (req, res, next) => {
  if (!req.session.loggedIn) {
    logger.warn('spun slots without logging in');
    res.redirect(303, '/');
    return;
  }
  let slot1 = randomSlotNum();
  let slot2 = randomSlotNum();
  let slot3 = randomSlotNum();

  res.send({ slots: [slot1, slot2, slot3] });
  // let userID = req.session.userID;
  let gameID = 1; //Slots' game id
  let winnings = req.body.amount;

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
  dbPool.query(
    'UPDATE users SET balance = balance + ? WHERE id = ?',
    [winnings, userID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /roulette (${req.ip}):`);
        next(err);
        return;
      }
    }
  );
});

function randomSlotNum() {
  return Math.floor(Math.random() * 7 + 1);
}

module.exports = router;
