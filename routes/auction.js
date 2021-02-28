const appRoot = require('app-root-path');
const express = require('express');
const dbPool = require(appRoot + '/db').pool;
// var mysql = require('mysql');
const logger = require(appRoot + '/logger');
const router = express.Router();
const v = require('express-validator/check');
const { Promise } = require('q');
const enterTimestamp = process.env.ENTER_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /auction without logging in');
    res.redirect(303, '/');
    return;
  } else if (Date.now() < enterTimestamp) {
    logger.warn('attempt to access /auction before time');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance,
    };
    res.render('auction', opts);
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
    var dbConn;
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
          if (err) {
            // logger.error(`DB error on /blackjack (${req.ip}):`);
            next(err);
            reject();
          } else if (rows[0].length < 1) {
            logger.error(`non-existant logged-in user: ${req.session.userID}`);
            res.json({
              success: false,
              error: 'tavo sąskaita neegzistuoja.',
            });
            reject();
          }
          resolve(rows);
        }
      );
    })
      .then(rows => {
        const row = rows[0][0];
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
          return 'failure';
        } else if (row.is_frozen || !row.can_send) {
          const frozen = row.is_frozen ? 'frozen' : 'non-can_send';
          logger.warn(
            `attempted transfer by ${frozen} account ${from_full_name}`
          );
          res.json({
            success: false,
            error: 'tavo sąskaitai neleidžiama daryti mokėjimų',
          });
          return 'failure';
        } else {
          dbPool.query(
            'SELECT * FROM auction ORDER BY id DESC LIMIT 1',
            (err, rows) => {}
          );
          // SELECT * FROM auction WHERE id = (SELECT MAX(id) FROM auction)
        }
      })
      .then(function (rows) {
        if (rows === 'failure') return 'failure';
        else if (rows[0].length < 1) {
          logger.info(
            `${from_full_name} attempted to bet but auction has not started`
          );
          res.json({
            success: false,
            error: 'aukcionas neprasidėjęs',
          });
          return 'failure';
        }

        const row = rows[0][0];
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
          return 'failure';
        } else if (!inProgress) {
          logger.info(
            `${from_full_name} attempted to bet when not in progress (auction)`
          );
          res.json({
            success: false,
            error: `statymas pasibaigęs`,
          });
          return 'failure';
        }

        //return Q.ninvoke(dbConn, 'beginBet');
      })
      .then(function (ret) {
        if (ret === 'failure') return 'failure';
        return Q.ninvoke(
          dbConn,
          'query',
          'UPDATE auction SET biggest_bet = ? WHERE id = ?',
          [req.body.amount, rowId]
        );
      })
      .then(function (ret) {
        if (ret === 'failure') return 'failure';
        return Q.ninvoke(
          dbConn,
          'query',
          'UPDATE auction SET bettor_id = ? WHERE id = ?',
          [req.body.fromID, rowId]
        );
      })
      .then(function (rows) {
        if (rows === 'failure') return 'failure';
        return Q.ninvoke(dbConn, 'commit');
      })
      .then(function (ret) {
        dbConn.release();
        if (ret === 'failure') return;
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
      .catch(function (err) {
        logger.error('transfer error: ' + err);
        dbConn.rollback(function () {
          dbConn.release();
          res.json({
            success: false,
            error: 'techninė.',
          });
        });
      })
      .done();
  }
);

module.exports = router;
