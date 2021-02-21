const appRoot = require('app-root-path');
const express = require('express');
var dbPool = require(appRoot + '/db').pool;
var mysql = require('mysql');
const { log } = require('../../logger');
var logger = require(appRoot + '/logger');
var router = express.Router();
let gameID = 0; //Roulette's game id
const enterTimestamp = process.env.ENTER_TIMESTAMP;

router.get('/', (req, res, next) => {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /roulette without logging in');
    res.redirect(303, '/');
    return;
  } else if (Date.now() < enterTimestamp) {
    logger.warn('attempt to access /roulette before time');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance,
    };
    res.render('games/roulette', opts);
  }
});

router.post('/spin', (req, res, next) => {
  if (!req.session.loggedIn) {
    logger.warn('spun the roulette without logging in');
    res.redirect(303, '/');
    return;
  }
  let chosenColor = req.body.chosenColor; //0 - red, 1 - black, 2 - green
  if (chosenColor == undefined) {
    logger.warn('spun the roulette without choosing a color');
    res.redirect(400, req.baseUrl);
    return;
  } else if (!req.body.amount > 0) {
    logger.warn('spun the roulette with amount not greater than 0');
    res.redirect(400, req.baseUrl);
    return;
  }
  let bet = req.body.amount;
  let winnings = bet;
  let userID = req.session.userID;
  balance
    .get(userID)
    .then(bal => {
      if (bal < bet) {
        logger.warn(`User bet more than he has (${req.ip}) /roulette :`);
        res.status(406).json({ error: 'Bet too big' });
        reject();
        // reject({ message: 'You cannot bet more than you have', status: 406 });
      }
    })
    .then(() => {
      let block = Math.floor(Math.random() * 15);

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

      playHistory.insert(userID, gameID, null, winnings);
      balance.update(winnings, userID);
    })
    .catch(err => {
      logger.error(`DB error on /roulette (${req.ip}):`);
      next(err);
    });
});
module.exports = router;
