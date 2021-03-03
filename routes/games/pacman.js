const appRoot = require('app-root-path');
// var dbPool = require(appRoot + '/db').pool;
const logger = require(appRoot + '/logger');
const router = require('express').Router();
const balance = require(appRoot + '/services/balance');
const playHistory = require(appRoot + '/services/playHistory');
const gameID = 5; // Pacman gameID
const enterTimestamp = process.env.ENTER_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /pacman without logging in');
    res.redirect(303, '/');
    return;
  } else if (Date.now() < enterTimestamp) {
    logger.warn('attempt to access /pacman before time');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance,
    };
    res.render('games/pacman', opts);
  }
});

router.get('/start', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to start a game in /pacman without logging in');
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
    logger.warn('attempt to end a game in /pacman without logging in');
    res.redirect(303, '/');
    return;
  }
  const userID = req.body.userID;
  const gameSessionID = req.body.gameSessionID;
  const score = req.body.score;
  const winnings = Math.round(score / 100);
  playHistory.update(gameSessionID, winnings);
  balance
    .update(winnings, userID)
    .catch(err => {
      logger.error(`DB error on /pacman (balance) (${req.ip}):`);
      next(err);
      return;
    })
    .finally(() => {
      req.session.balance += winnings;
      res.sendStatus(200);
    });
});
module.exports = router;
