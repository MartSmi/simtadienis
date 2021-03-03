const appRoot = require('app-root-path');
const express = require('express');
var dbPool = require(appRoot + '/db').pool;
var logger = require(appRoot + '/logger');
var router = express.Router();
const balance = require(appRoot + '/services/balance');
const gameID = 2; //Snake game id
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /snake without logging in');
    res.redirect(303, '/');
    play_his;
    return;
  } else if (Date.now() < enterTimestamp) {
    logger.warn('attempt to access /snake before time');
    res.redirect(303, '/');
    return;
  } else if (Date.now() > endTimestamp) {
    logger.warn('attempt to access /snake after time');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance,
    };
    res.render('games/snake', opts);
  }
});

router.get('/start', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to start /snake without logging in');
    res.redirect(303, '/');
    return;
  }
  const userID = req.session.userID;
  dbPool.query(
    'INSERT INTO play_history (user_id, game_id, time) VALUES(?, ?, CURRENT_TIME())',
    [userID, gameID],
    (err, row) => {
      if (err) {
        logger.error(`DB error on /blackjack (${req.ip}):`);
        next(err);
        return;
      }
      res.send({ gameSessionID: row.insertId });
    }
  );
});

router.post('/end', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to end /snake without logging in');
    res.redirect(303, '/');
    return;
  }
  const userID = req.session.userID;
  const gameSessionID = req.body.gameSessionID;
  const score = req.body.score;
  const winnings = Math.round((score / 2) * 1.03 ** score);
  req.session.balance += winnings;
  res.sendStatus(200);
  balance.update(winnings, userID).catch(err => {
    logger.error(`DB error on /snake (balance) (${req.ip}):`);
    next(err);
    return;
  });

  dbPool.query(
    'UPDATE play_history SET winnings = ?, ended = TRUE WHERE id = ?',
    [winnings, gameSessionID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /snake (play_history) (${req.ip}):`);
        next(err);
      }
    }
  );
});

module.exports = router;
