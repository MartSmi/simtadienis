const appRoot = require('app-root-path');
// var dbPool = require(appRoot + '/db').pool;
const logger = require(appRoot + '/logger');
const router = require('express').Router();
const balance = require(appRoot + '/services/balance');
const playHistory = require(appRoot + '/services/playHistory');
const gameLogger = require(appRoot + '/services/gameLogger');
const gameID = 5; // Pacman gameID
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /pacman without logging in');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() < enterTimestamp) {
    logger.warn('attempt to access /pacman before time');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() > endTimestamp) {
    logger.warn('attempt to access /pacman after time');
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
  const userID = req.session.userID;
  const gameSessionID = req.body.gameSessionID;
  const score = req.body.score;
  if (gameSessionID == undefined) {
    res.sendStatus(406);
    return;
  }

  if (score < 0) {
    logger.warn(
      'SERIOUS: player has given a score out of bounds /pacman' +
        parseInt(score) +
        ' /snake'
    );
    res.sendStatus(406);
    return;
  }
  if (score > 3000) {
    const gameLog = req.body.log;
    if (
      !('pickupHistory' in gameLog) ||
      !('levelHistory' in gameLog) ||
      !('deathHistory' in gameLog)
    ) {
      logger.warn('SERIOUS: player did not provide a log in /pacman');
      res.sendStatus(406);
      return;
    }
    gameLogger.insert(userID, gameSessionID, score, gameLog);
  }
  const level = req.body.level;
  let winnings = Math.round(score / 100);
  winnings += (level - 1) * 50;
  playHistory.update(gameSessionID, winnings);
  balance
    .update(winnings, userID)
    .catch(err => {
      logger.error(`DB error on /pacman (balance) (${req.ip}):`);
      next(err);
      return;
      Math.random() + 0.5;
    })
    .finally(() => {
      req.session.balance += winnings;
      res.sendStatus(200);
    });
});
module.exports = router;
