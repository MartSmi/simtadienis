const appRoot = require('app-root-path');
const express = require('express');
const dbPool = require(appRoot + '/db').pool;
const logger = require(appRoot + '/logger');
const router = express.Router();
const balance = require(appRoot + '/services/balance');
const playHistory = require(appRoot + '/services/playHistory');
const gameID = 1; //Blackjack's game id
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /blackjack without logging in');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() < enterTimestamp) {
    logger.warn('attempt to access /blackjack before time');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() > endTimestamp) {
    logger.warn('attempt to access /blackjack after time');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance,
    };
    res.render('games/blackjack', opts);
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
  balance
    .get(userID)
    .then(bal => {
      if (bal < bet) {
        logger.warn(`User bet more than he has (${req.ip}) /blackjack :`);
        res.status(406).json({ error: 'Bet too big' });
        reject();
        // reject({ message: 'You cannot bet more than you have', status: 406 });
      }
    })
    .then(
      () =>
        new Promise((resolve, reject) => {
          balance.update(bet * -1, userID).catch(err => {
            reject(err);
          });
          req.session.balance -= bet;
          playHistory.insert(userID, gameID, bet, 0, false).then(row => {
            resolve(row.insertId);
          });
        })
    )
    .then(gameSessionID => {
      playerCards = [drawCard(), drawCard()];
      dealerCards = [drawCard()];
      if (
        (playerCards[0].value == 0 && playerCards[1].value >= 9) ||
        (playerCards[1].value == 0 && playerCards[0].value >= 9)
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
          if (err) reject(err);
        }
      );
    })
    .catch(err => {
      logger.error(`DB error on /blackjack (${req.ip}):`);
      next(err);
    });
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
  const bet = req.body.bet;
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
    if (dealer.points == 21) {
      req.session.balance += bet;
    } else {
      req.session.balance += bet * 2;
    }
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
        if (safePlayerPoints == dealer.points) {
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
              // next(err);
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
  const bet = req.body.bet;
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

    if (dealer.points > 21 || playerPoints > dealer.points) {
      //Player won
      req.session.balance += bet * 2;
      won(req.ip, userID, gameSessionID, next);
    } else if (playerPoints < dealer.points) {
      //Dealer won
      lost(req.ip, gameSessionID, next);
    } else {
      //Draw
      req.session.balance += bet;
      tie(req.ip, userID, gameSessionID, next);
    }

    // req.session.balance;
    res.send({
      cards: dealer.newCards,
    });

    dbPool.query(
      'UPDATE blackjack SET dealer_points = ?, dealer_aces = ? WHERE game_session_id = ?',
      [dealer.points, dealer.aces, gameSessionID],
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

  balance.update(winnings, userID).catch(err => {
    logger.error(`DB error on /blackjack (blackjack) (balance) (${req.ip}):`);
    next(err);
    return;
  });

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
  balance.update(winnings, userID).catch(err => {
    logger.error(`DB error on /blackjack (won) (${ip}):`);
    next(err);
    return;
  });

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
  balance.update(bet, userID).catch(err => {
    logger.error(`DB error on /blackjack (tie) (balance) (${ip}):`);
    next(err);
    return;
  });

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

function calCardValue(val) {
  if (val > 9) return 10;
  else return val + 1;
}

// For debugging specific hand combinations
// let i = 0;
// const c = [0, 5, 2, 3];

function drawCard() {
  // For debugging specific hand combinations
  // return {
  //   value: c[i++ % c.length],
  //   suit: Math.floor(Math.random() * 4),
  // };
  return {
    value: Math.floor(Math.random() * 13), // A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
    suit: Math.floor(Math.random() * 4), // 0 - ♠, 1 - ♥, 2- ♦, 3 - ♣
  };
}

module.exports = router;
