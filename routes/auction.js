const appRoot = require('app-root-path');
const express = require('express');
const dbPool = require(appRoot + '/db').pool;
// var mysql = require('mysql');
const logger = require(appRoot + '/logger');
const router = express.Router();
const v = require('express-validator/check');
const { ConsoleTransportOptions } = require('winston/lib/winston/transports');
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const auctionStartTimestamp = process.env.AUCTION_START_TIMESTAMP;
const streamLink = process.env.AUCTION_STREAM_LINK;
const chatLink = process.env.AUCTION_CHAT_LINK;
const balance = require(appRoot + '/services/balance');

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /auction without logging in');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() < enterTimestamp) {
    logger.warn('attempt to access /auction before time');
    res.redirect(303, '/');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() < auctionStartTimestamp) {
    logger.warn('attempt to access /auction before auction time');
    res.redirect(303, '/account?auctionNotStarted=true');
    return;
  } else {
    const userID = req.session.userID;
    var opts = {
      balance: req.session.balance,
      streamLink: streamLink,
      chatLink: chatLink,
    };
    balance.get(userID).then (bal => {
      req.session.balance = bal;
      opts.balance = bal;
      res.render('auction', opts);
    }).catch(err => {
      logger.warn(err);
      res.render('auction', opts);  
    });
  }
});

router.post(
  '/bet',
  [
    v
      .body('amount')
      .isNumeric({ no_symbols: true })
      .withMessage('suma privalo būti teigiama'),
  ],
  function (req, res, next) {
    if (!req.session.loggedIn) {
      logger.warn(`attempted transfer by a non-logged-in session`);
      res.json({
        success: false,
        error: '',
        refresh: true,
      });
      return;
    }

    if (req.body.amount < 1) {
      logger.warn(
        `negative amount (secondary) (userID: ${req.session.userID})`
      );
      res.json({
        success: false,
        error: 'suma privalo būti teigiama',
      });
      return;
    }

    var fromID = req.session.userID;
    // var toID;
    // var dbConn;
    var from_full_name;
    // var to_full_name;
    var from_is_station;
    var rowId;

    // getting a dedicated connection is necessary since we're using transactions
    new Promise((resolve, reject) => {
      dbPool.query(
        'SELECT full_name, balance, can_send, is_station, is_frozen, klase FROM users WHERE id = ?',
        [fromID],
        (err, rows) => {
          if (err) {
            // logger.error(`DB error on /blackjack (${req.ip}):`);
            reject(err);
          } else if (rows.length < 1) {
            logger.error(`non-existant logged-in user: ${req.session.userID}`);
            res.json({
              success: false,
              error: 'tavo sąskaita neegzistuoja.',
            });
            reject(err);
          }

          resolve(rows);
        }
      );
    })
      .then(rows => {
        const row = rows[0];
        from_full_name = row.full_name;
        from_is_station = row.is_station;
        let clas = row.klase;
        console.log(clas);

        const balance = row.balance;
        if (req.body.amount > balance) {
          logger.info(
            `${from_full_name} attempted a transfer with insufficient funds (${req.body.amount} > ${balance})`
          );
          res.json({
            success: false,
            error: `neužtenka pinigų`,
          });
          throw new Error('not money');
        } else if (row.is_station || row.is_frozen || !row.can_send || clas == 'III') {
          const frozen = row.is_frozen ? 'frozen' : 'non-can_send';
          logger.warn(
            `attempted transfer by ${frozen} account ${from_full_name}`
          );
          res.json({
            success: false,
            error: 'tavo sąskaitai neleidžiama daryti mokėjimų',
          });
          throw new Error('frozen account');
        }

        return new Promise((resolve, reject) => {
          dbPool.query(
            'SELECT * FROM auction ORDER BY id DESC LIMIT 1',
            (err, rows) => {
              if (err) {
                reject(err);
              } else if (rows.length < 1) {
                logger.info(
                  `${from_full_name} attempted to bet but auction has not started`
                );
                res.json({
                  success: false,
                  error: 'aukcionas neprasidėjęs',
                });
                reject(err);
              }

              resolve(rows);
            }
          );
        });
        // SELECT * FROM auction WHERE id = (SELECT MAX(id) FROM auction)
      })
      .then(rows => {
        const row = rows[0];
        let inProgress = row.in_progress;
        let biggestBet = row.biggest_bet;
        rowId = row.id;

        if (req.body.amount <= biggestBet) {
          logger.info(
            `${from_full_name} attempted to bet less than biggest bet (${req.body.amount} < ${biggestBet})`
          );
          res.json({
            success: false,
            error: `per mažas statymas`,
          });
          throw new Error('bet less than biggest');
        } else if (!inProgress) {
          logger.info(
            `${from_full_name} attempted to bet when not in progress (auction)`
          );
          res.json({
            success: false,
            error: `statymas pasibaigęs`,
          });
          throw new Error('bet not in progress');
        }
        //resolve();
        //return Q.ninvoke(dbConn, 'beginBet');
      })
      .then(() => {
        dbPool.query(
          'UPDATE auction SET biggest_bet = ? WHERE id = ?',
          [req.body.amount, rowId],
          err => {
            if (err) {
              // logger.error(`DB error on /blackjack (${req.ip}):`);
              throw err;
            }
          }
        );
      })
      .then(() => {
        dbPool.query(
          'UPDATE auction SET bettor_id = ? WHERE id = ?',
          [fromID, rowId],
          err => {
            if (err) {
              // logger.error(`DB error on /blackjack (${req.ip}):`);
              throw err;
            }
          }
        );
      })
      .then(() => {
        const now = new Date();

        logger.log(
          'info',
          `bet in auction: [${req.body.amount}] ${from_full_name}`
        );

        res.json({
          success: true,
          amount: req.body.amount,
          time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        });
      })
      .catch(err => {
        logger.error('transfer error: ' + err);
      });
  }
);

router.get('/get-biggest-bet', function (req, res, next) {
  var biggestBet;
  var itemName;

  // console.log("here");

  new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT * FROM auction ORDER BY id DESC LIMIT 1',
      (err, rows) => {
        if (err) {
          // logger.error(`DB error on /blackjack (${req.ip}):`);
          next(err);
          reject(err);
        } else if (rows.length < 1) {
          logger.error(`auction has not started`);
          // res.json({
          //   success: false,
          //   error: 'aukcionas neprasidėjęs.',
          // });
          reject(err);
        }
        resolve(rows);
      }
    );
  })
    .then(rows => {
      const row = rows[0];
      biggestBet = row.biggest_bet;
      let bettorId = row.bettor_id;
      itemName = row.item_name;
// console.log("hhhh");
// console.log("biggest Bet = " + biggestBet + "  bettorId = " + bettorId);
      return new Promise((resolve, reject) => {
        dbPool.query(
          'SELECT * FROM users WHERE id = ?',
          [bettorId],
          (err, rows) => {
            if (err) {
              next(err);
              reject(err);
              // res.json({
              //   success: false,
              //   error: err,
              // });
            } else if (rows.length < 1) {
              console.log("user was not found...");
              reject(new Error('user not found'));
            } else {
              resolve(rows);
            }
          }
        );
      });
    })
    .then(rows => {
      const row = rows[0];
      let bettorName = row.full_name;

      // console.log("herehhrerhehrehs");

      res.send({
        biggest_bet: biggestBet,
        bettor_name: bettorName,
        item_name: itemName,
      });
    })
    .catch(err => {
      logger.error('transfer error: ' + err);
    });
});

module.exports = router;
