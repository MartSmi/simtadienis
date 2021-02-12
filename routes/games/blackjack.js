const appRoot = require('app-root-path');
const express = require('express');
const crypto = require('crypto');
const { resolve } = require('app-root-path');
var dbPool = require(appRoot + '/db').pool;
// var mysql = require('mysql');
const logger = require(appRoot + '/logger');
const router = express.Router();
const gameID = 1; //Blackjack's game id

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /blackjack without logging in');
    res.redirect(303, '/');
    return;
  } else {
    res.render('games/blackjack');
  }
});

router.post('/bet', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to bet in /blackjack without logging in');
    res.redirect(303, '/');
    return;
  }
  const bet = req.body.bet;
  const userID = req.session.userID;
  let playerCard1,
    playerCard2,
    dealerCard,
    player_value,
    player_aces,
    dealer_value,
    dealer_aces;

  new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT balance from users WHERE id = ?',
      [userID],
      (err, rows) => {
        if (err) {
          logger.error(`DB error on /blackjack (${req.ip}):`);
          next(err);
          return;
        }
        if (rows[0].balance < bet) {
          logger.warn(`User bet more than he has (${req.ip}) /blackjack :`);
          res.status(406).json({ error: 'Bet too big' });
          reject();
          // reject({ message: 'You cannot bet more than you have', status: 406 });
        }
        resolve();
      }
    );
  })
    .then(
      () =>
        new Promise((resolve, reject) => {
          dbPool.query(
            'INSERT INTO play_history (user_id, game_id, bet, time) VALUES(?, ?, ?, CURRENT_TIME())',
            [userID, gameID, bet],
            (err, row) => {
              if (err) {
                logger.error(`DB error on /blackjack (${req.ip}):`);
                next(err);
                return;
              }
              resolve(row.insertId);
            }
          );
        })
    )
    .then(game_session_id => {
      playerCard1 = drawCard();
      playerCard2 = drawCard();
      dealerCard = drawCard();

      res.send({
        game_session_id,
        playerCards: [playerCard1, playerCard2],
        dealerCard,
      });

      player_value =
        calCardValue(playerCard1.value) + calCardValue(playerCard2.value);
      player_aces = (playerCard1.value == 0) + (playerCard2.value == 0);
      dealer_value = calCardValue(dealerCard.value);
      dealer_aces = dealerCard.value == 0;

      dbPool.query(
        'INSERT INTO blackjack (user_id, game_session_id, player_value, player_aces, dealer_value, dealer_aces, time) VALUES(?, ?, ?, ?, ?, ?, CURRENT_TIME())',
        [
          userID,
          game_session_id,
          player_value,
          player_aces,
          dealer_value,
          dealer_aces,
        ],
        (err, rows) => {
          if (err) {
            logger.error(`DB error on /blackjack (${req.ip}):`);
            next(err);
            return;
          }
        }
      );

      // dbPool.query(
      //   'UPDATE users SET balance = balance + ? WHERE id = ?',
      //   [winnings, userID],
      //   (err, rows) => {
      //     if (err) {
      //       logger.error(`DB error on /blackjack (${req.ip}):`);
      //       next(err);
      //       return;
      //     }
      //   }
      // );
    })
    .catch(err => {});
});

router.post('/hit', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to hit in /blackjack without logging in');
    res.redirect(303, '/');
    return;
  }
  card = drawCard();
  let game_session_id = req.body.game_session_id;
  res.send({ card });

  card_value = calCardValue(card.value);
  card_aces = card.value == 0;

  dbPool.query(
    'UPDATE blackjack SET player_value = player_value + ?, player_aces = player_aces + ? WHERE game_session_id = ?',
    [card_value, card_aces, game_session_id],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /blackjack (${req.ip}):`);
        next(err);
        return;
      }
    }
  );
});

function calCardValue(val) {
  if (val > 9) return 10;
  else return val + 1;
}

function drawCard() {
  return {
    value: Math.floor(Math.random() * 13), // A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
    suit: Math.floor(Math.random() * 4), // 1 - ♠, 2 - ♥, 3 - ♦, 4 - ♣
  };
}

module.exports = router;
