const appRoot = require('app-root-path');
const express = require('express');
var dbPool = require(appRoot + '/db').pool;
var logger = require(appRoot + '/logger');
var router = express.Router();
const balance = require(appRoot + '/services/balance');
const gameLogger = require(appRoot + '/services/gameLogger');
const gameID = 2; //Snake game id
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /snake without logging in');
    res.redirect(303, '/');
    play_his;
    return;
  } else if (!req.session.adminLoggedIn && Date.now() < enterTimestamp) {
    logger.warn('attempt to access /snake before time');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() > endTimestamp) {
    logger.warn('attempt to access /snake after time');
    res.redirect(303, '/');
    return;
  } else {
    const userID = req.session.userID;
    var opts = {
      balance: req.session.balance,
    };
    balance
      .get(userID)
      .then(bal => {
        req.session.balance = bal;
        opts.balance = bal;
        res.render('games/snake', opts);
      })
      .catch(err => {
        logger.warn(err);
        res.render('games/snake', opts);
      });
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

  if (req.session.guest) {
    res.sendStatus(200);
    return;
  }

  const userID = req.session.userID;
  const gameSessionID = req.body.gameSessionID;
  const score = req.body.score;
  if (score > 254 || score < 0) {
    logger.warn(
      'SERIOUS: player has given a score out of bounds ' +
        parseInt(score) +
        ' /snake'
    );
    res.sendStatus(406);
    return;
  }
  if (score > 30) {
    const gameLog = req.body.log;
    if (!('movement' in gameLog) || !('eatenFood' in gameLog)) {
      logger.warn('SERIOUS: player did not provide a log in /snake');
      res.sendStatus(406);
      return;
    }
    gameLogger.insert(userID, gameSessionID, score, gameLog);
  }

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
