var express = require('express');
var v = require('express-validator/check');
var vs = require('express-validator/filter');
var bcrypt = require('bcrypt');
var dbPool = require('../db').pool;
var logger = require('../logger');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.session.adminLoggedIn) {
    logger.warn(`${req.ip} accessed /auction-admin (not logged in)`);
    res.redirect(303, '/admin/login');
  } else {
    logger.info(`${req.ip} accessed /auction-admin (logged in)`);
    res.render('auction-admin');
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
        'SELECT full_name, balance, can_send, is_station, is_frozen FROM users WHERE id = ?',
        [fromID],
        (err, rows) => {
          console.log("wow");
          if (err) {
            // logger.error(`DB error on /blackjack (${req.ip}):`);
            next(err);
            reject(err);
          } else if (rows[0].length < 1) {
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


        const balance = row.balance;
        if (req.body.amount > balance) {
          logger.info(
            `${from_full_name} attempted a transfer with insufficient funds (${req.body.amount} > ${balance})`
          );
          res.json({
            success: false,
            error: `neužtenka pinigų (dabartinis balansas: ${balance})`,
          });
          throw new Error("not money");
        } else if (row.is_frozen || !row.can_send) {
          const frozen = row.is_frozen ? 'frozen' : 'non-can_send';
          logger.warn(
            `attempted transfer by ${frozen} account ${from_full_name}`
          );
          res.json({
            success: false,
            error: 'tavo sąskaitai neleidžiama daryti mokėjimų',
          });
          throw new Error("frozen account");
        }

        return new Promise ((resolve, reject) => {
          dbPool.query(
          'SELECT * FROM auction ORDER BY id DESC LIMIT 1',
          (err, rows) => {
            if (err) {
              next(err);
              reject(err);
            } else if (rows[0].length < 1) {
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
          });
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
            error: `per mažas statymas (didžiausias statymas kol kas: ${biggestBet})`,
          });
          throw new Error("bet less than biggest");
        } else if (!inProgress) {
          logger.info(
            `${from_full_name} attempted to bet when not in progress (auction)`
          );
          res.json({
            success: false,
            error: `statymas pasibaigęs`,
          });
          throw new Error ("bet not in progress");
        }
        //resolve();
        //return Q.ninvoke(dbConn, 'beginBet');
      })
      .then(() => {
        dbPool.query(
          'UPDATE auction SET biggest_bet = ? WHERE id = ?',
          [req.body.amount, rowId],
          (err) => {
            if (err) {
              // logger.error(`DB error on /blackjack (${req.ip}):`);
              next(err);
              throw err;
            }
          }
        );
      })
      .then(() => {
        dbPool.query(
          'UPDATE auction SET bettor_id = ? WHERE id = ?',
          [fromID, rowId],
          (err) => {
            if (err) {
              // logger.error(`DB error on /blackjack (${req.ip}):`);
              next(err);
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
      .catch((err) => {
        logger.error('transfer error: ' + err);
        // dbConn.rollback(function () {
        //   dbConn.release();
        //   res.json({
        //     success: false,
        //     error: 'techninė.',
        //   });
        // });
      })
      .done();
  }
);

module.exports = router;
