const appRoot = require('app-root-path');
const express = require('express');
const winston = require('winston/lib/winston/config');
// var dbPool = require(appRoot + '/db').pool;
const logger = require(appRoot + '/logger');
const router = express.Router();
const balance = require(appRoot + '/services/balance');
const playHistory = require(appRoot + '/services/playHistory');
const gameLogger = require(appRoot + '/services/gameLogger');
const gameID = 4; // Tetris gameID
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /tetris without logging in');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() < enterTimestamp) {
    logger.warn('attempt to access /tetris before time');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() > endTimestamp) {
    logger.warn('attempt to access /tetris after time');
    res.redirect(303, '/');
    return;
  } else {

    const userID = req.session.userID;
    var opts = {
      balance: req.session.balance,
    };
    balance.get(userID).then (bal => {
      req.session.balance = bal;
      opts.balance = bal;
      res.render('games/tetris', opts);
    }).catch(err => {
      logger.warn(err);
      res.render('games/tetris', opts);  
    });
  }
});

router.get('/start', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to start a game in /tetris without logging in');
    res.redirect(303, '/');
    return;
  }
  const userID = req.session.userID;
  playHistory.insert(userID, gameID).then(row => {
    res.send({ gameSessionID: row.insertId });
  });
});

router.post('/end', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to end a game in /tetris without logging in');
    res.redirect(303, '/');
    return;
  }
  const userID = req.session.userID;
  const gameSessionID = req.body.gameSessionID;
  const score = req.body.score;
  if (score < 0) {
    logger.warn(
      'SERIOUS: player has given a score out of bounds ' +
        parseInt(score) +
        ' /snake'
    );
    res.sendStatus(406);
    return;
  }
  if (score > 3000) {
    const gameLog = req.body.log;
    if (!('boardHistory' in gameLog) || !('scoreHistory' in gameLog)) {
      logger.warn('SERIOUS: player did not provide a log in /tetris snake');
      res.sendStatus(406);
      return;
    }
    gameLogger.insert(userID, gameSessionID, score, gameLog);
  }

  const winnings = Math.round(score / 100);
  playHistory.update(gameSessionID, winnings);
  balance
    .update(winnings, userID)
    .catch(err => {
      logger.error(`DB error on /tetris (balance) (${req.ip}):`);
      next(err);
      return;
    })
    .finally(() => {
      req.session.balance += winnings;
      res.sendStatus(200);
    });
});
module.exports = router;
