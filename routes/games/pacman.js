const appRoot = require('app-root-path');
const express = require('express');
// var dbPool = require(appRoot + '/db').pool;
// var mysql = require('mysql');
var logger = require(appRoot + '/logger');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /pacman without logging in');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      name: req.session.fullName,
      balance: req.session.balance
    }
    res.render('games/pacman', opts);
  }
});

router.post('/bet', (req, res, next) => {
  if (!req.session.loggedIn) {
    logger.warn('spun the roulette without logging in');
    res.redirect(303, '/');
    return;
  }
  let bet = req.body.amount;
  if (!req.body.amount > 0) {
    logger.warn('bet in blackjack with amount not greater than 0');
    res.redirect(400, req.baseUrl);
    return;
  }
  let winnings = req.body.amount;
  if (chosenColor == 2 && block == 0) {
    // Won on green
    winnings *= 20;
  } else if (chosenColor == 1 && block % 2 == 0) {
    // Won on black
    winnings *= 2;
  } else if (chosenColor == 0 && block % 2 == 1) {
    // Won on red
    winnings *= 2;
  } else {
    // Lost
    winnings *= -1;
  }
  res.send({ block });
  let userID = req.session.userID;
  dbPool.query(
    'INSERT INTO blackjack_bets (user_id, bet, time) VALUES(?, ?, ?, CURRENT_TIME())',
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
module.exports = router;
