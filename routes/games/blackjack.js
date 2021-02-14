const appRoot = require('app-root-path');
const express = require('express');
const crypto = require('crypto');
const { resolve } = require('app-root-path');
const { Promise, reject } = require('q');
const winston = require('winston/lib/winston/config');
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
  let playerCards, dealerCards, playerPoints, playerAces, points, dealerAces;

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
              gameSessionID = row.insertId;
              resolve();
            }
          );
          updateBalance(bet * -1, req.ip, userID, next);
        })
    )
    .then(() => {
      playerCards = [drawCard(), drawCard()];
      dealerCards = [drawCard()];
      if (
        (playerCards[0].value == 0 && playerCards[1].value >= 10) ||
        (playerCards[1].value == 0 && playerCards[0].value >= 10)
      ) {
        let isTie = false;
        if (dealerCards[0].value == 0) {
          dealerCards.push(drawCard());
          if (dealerCards[1].value >= 10) {
            tie(req.ip, userID, gameSessionID, next);
            isTie = true;
          }
        } else if (dealerCards[0].value >= 10) {
          dealerCards.push(drawCard());
          if (dealerCards[1].value == 0) {
            tie(req.ip, userID, gameSessionID, next);
            isTie = true;
          }
        } else if (!isTie) {
          blackjack(req.ip, userID, gameSessionID, next);
        }
      }
      res.send({ gameSessionID, playerCards, dealerCards });

      playerPoints =
        calCardValue(playerCards[0].value) + calCardValue(playerCards[1].value);
      playerAces = (playerCards[0].value == 0) + (playerCards[1].value == 0);
      points = calCardValue(dealerCards[0].value);
      dealerAces = dealerCards[0].value == 0;

      dbPool.query(
        'INSERT INTO blackjack (user_id, game_session_id, player_points, player_aces, dealer_points, dealer_aces, time) VALUES(?, ?, ?, ?, ?, ?, CURRENT_TIME())',
        [userID, gameSessionID, playerPoints, playerAces, points, dealerAces],
        (err, rows) => {
          if (err) {
            logger.error(`DB error on /blackjack (${req.ip}):`);
            next(err);
            return;
          }
        }
      );
    })
    .catch(err => {});
});

router.post('/hit', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to hit in /blackjack without logging in');
    res.redirect(303, '/');
    return;
  }
  playerCard = drawCard();
  const gameSessionID = req.body.gameSessionID;
  let oldPlayerCards = req.body.playerCards;
  let oldDealerCard = req.body.dealerCard;
  const userID = req.session.userID;

  cardValue = calCardValue(playerCard.value);
  cardAces = playerCard.value == 0 ? 1 : 0;
  let dealer = {},
    playerPoints = cardValue,
    playerAces = cardAces;

  oldPlayerCards.forEach(c => {
    playerPoints += calCardValue(c.value);
    if (c.value == 0) playerAces++;
  });

  if (playerPoints == 21 || (playerAces > 0 && playerPoints == 11)) {
    dealer = playDealer(
      calCardValue(oldDealerCard.value),
      oldDealerCard.value == 0
    );
  }

  res.send({ playerCard, dealerCards: dealer.newCards || [] });
  dbPool.query(
    'SELECT player_points, player_aces FROM blackjack WHERE game_session_id = ?',
    [gameSessionID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /blackjack (${req.ip}):`);
        next(err);
        return;
      }
      let safePlayerPoints = rows[0].player_points + cardValue;
      if (safePlayerPoints <= 11 && (cardAces > 0 || rows[0].player_aces > 0))
        safePlayerPoints += 10;

      if (dealer.points != undefined) {
        if (
          playerPoints != safePlayerPoints ||
          rows[0].player_aces + cardAces != dealer.aces
        ) {
          //Player is editing cards
          lost(req.ip, gameSessionID, next);
          logger.warn(`Player tried to edit cards (${req.ip}):`);
        } else if (safePlayerPoints == dealer.points) {
          tie(req.ip, userID, gameSessionID, next);
        } else if (safePlayerPoints > dealer.points) {
          won(req.ip, userID, gameSessionID, next);
        }
      } else if (safePlayerPoints > 21) {
        lost(req.ip, gameSessionID, next);
      } else {
        dbPool.query(
          'UPDATE blackjack SET player_points = player_points + ?, player_aces = player_aces + ? WHERE game_session_id = ?',
          [cardValue, cardAces, gameSessionID],
          (err, rows) => {
            if (err) {
              logger.error(`DB error on /blackjack (${req.ip}):`);
              next(err);
              return;
            }
          }
        );
      }
    }
  );
});

router.post('/stand', async function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to stand in /blackjack without logging in');
    res.redirect(303, '/');
    return;
  }
  const gameSessionID = req.body.gameSessionID;
  const userID = req.session.userID;
  let playerPoints;
  new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT player_points, player_aces, dealer_points, dealer_aces from blackjack WHERE game_session_id = ?',
      [gameSessionID],
      (err, rows) => {
        if (err) {
          logger.error(`DB error on /blackjack/stand (${req.ip}):`);
          next(err);
          return;
        }
        resolve(rows[0]);
      }
    );
  }).then(row => {
    playerAces = row.player_aces;

    playerPoints = row.player_points;
    playerPoints += playerAces > 0 && playerPoints <= 11 ? 10 : 0;

    const dealer = playDealer(row.dealer_points, row.dealer_aces);

    res.send({
      cards: dealer.newCards,
    });

    if (dealer.points > 21 || playerPoints > dealer.points) {
      //Player won
      won(req.ip, userID, gameSessionID, next);
    } else if (playerPoints < dealer.points) {
      //Dealer won
      lost(req.ip, gameSessionID, next);
    } else {
      //Draw
      tie(req.ip, userID, gameSessionID, next);
    }

    dbPool.query(
      'UPDATE blackjack SET dealer_points = dealer_points + ?, dealer_aces = dealer_aces + ? WHERE game_session_id = ?',
      [points, dealer.aces, gameSessionID],
      (err, rows) => {
        if (err) {
          logger.error(`DB error on /blackjack/stand update (${req.ip}):`);
          // next(err);
          return;
        }
      }
    );
  });
});

function playDealer(points, usedAces) {
  let aces = usedAces;
  points = points + (aces == 1 ? 10 : 0);
  let newCards = [];
  while (points < 17) {
    let card = drawCard();
    newCards.push(card);
    points += calCardValue(card.value);
    if (card.value == 0) {
      aces++;
      if (points <= 11) {
        points += 10;
        usedAces++;
      }
    }
    if (points > 21 && usedAces > 0) {
      points -= 10;
      usedAces--;
    }
  }
  return { newCards, points, aces };
}

async function blackjack(ip, userID, gameSessionID, next) {
  //Ratio - 3:2, round-up
  let bet = await getBet(gameSessionID, next);
  let winnings = Math.ceil(bet * 2.5);
  updateBalance(winnings, ip, userID, next);

  dbPool.query(
    'UPDATE play_history SET winnings = bet * 1.5, ended = TRUE WHERE id = ?',
    [gameSessionID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /blackjack (blackjack) (${ip}):`);
        next(err);
      }
    }
  );
}

async function won(ip, userID, gameSessionID, next) {
  let bet = await getBet(gameSessionID, next);
  let winnings = bet * 2;
  updateBalance(winnings, ip, userID, next);
  dbPool.query(
    'UPDATE play_history SET winnings = bet, ended = TRUE WHERE id = ?',
    [gameSessionID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /blackjack (won) (${ip}):`);
        next(err);
      }
    }
  );
}

function lost(ip, gameSessionID, next) {
  dbPool.query(
    'UPDATE play_history SET winnings = bet * -1, ended = TRUE WHERE id = ?',
    [gameSessionID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /blackjack (lost) (${ip}):`);
        next(err);
      }
    }
  );
}

async function tie(ip, userID, gameSessionID, next) {
  let bet = await getBet(gameSessionID, next);
  updateBalance(bet, ip, userID, next);
  dbPool.query(
    'UPDATE play_history SET winnings = 0, ended = TRUE WHERE id = ?',
    [gameSessionID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /blackjack (tie) (${ip}):`);
        next(err);
      }
    }
  );
}

function getBet(gameSessionID, next) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT bet FROM play_history WHERE id = ?',
      [gameSessionID],
      (err, rows) => {
        if (err) {
          logger.error(`DB error on /blackjack (getBet) (${ip}):`);
          reject(err);
        }
        resolve(rows[0].bet);
      }
    );
  }).catch(err => {
    next(err);
  });
}

function updateBalance(amount, ip, userID, next) {
  dbPool.query(
    'UPDATE users SET balance = balance + ? WHERE id = ?',
    [amount, userID],
    (err, rows) => {
      if (err) {
        logger.error(`DB error on /blackjack (updateBalance) (${ip}):`);
        next(err);
        return;
      }
    }
  );
}
function calCardValue(val) {
  if (val > 9) return 10;
  else return val + 1;
}

let n = 0;
let vals = [1, 0, 8, 9];

function drawCard() {
  return {
    value: vals[n++ % 4],
    suit: Math.floor(Math.random() * 4), // 1 - ♠, 2 - ♥, 3 - ♦, 4 - ♣
  };

  return {
    value: Math.floor(Math.random() * 13), // A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
    suit: Math.floor(Math.random() * 4), // 1 - ♠, 2 - ♥, 3 - ♦, 4 - ♣
  };
}

module.exports = router;
