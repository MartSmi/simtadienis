const appRoot = require('app-root-path');
const express = require('express');
var dbPool = require(appRoot + '/db').pool;
var logger = require(appRoot + '/logger');
var router = express.Router();
const gameID = 2; //Snake game id
const enterTimestamp = process.env.ENTER_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /snake without logging in');
    res.redirect(303, '/');
    return;
  } else if (Date.now() < enterTimestamp) {
    logger.warn('attempt to access /snake before time');
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

router.post('/start', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to bet in /blackjack without logging in');
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

module.exports = router;
