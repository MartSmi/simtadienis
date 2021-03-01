var express = require('express');
var v = require('express-validator/check');
var vs = require('express-validator/filter');
var bcrypt = require('bcrypt');
var dbPool = require('../db').pool;
var logger = require('../logger');
const appRoot = require('app-root-path');
const balance = require(appRoot + '/services/balance');
var router = express.Router();
const auctionID = 419;

router.get('/', function (req, res, next) {
  if (!req.session.adminLoggedIn) {
    logger.warn(`${req.ip} accessed /auction-admin (not logged in)`);
    res.redirect(303, '/admin/login');
  } else {
    logger.info(`${req.ip} accessed /auction-admin (logged in)`);
    res.render('auction-admin');
  }
});

router.post('/stopCurrent', [], function (req, res, next) {
  if (!req.session.adminLoggedIn) {
    logger.warn(`${req.ip} attempted to stop current bet by not logged in auction-admin`);
    res.json({
      success: false,
      error: 'neprisijungta prie admin',
      refresh: true,
    });
    return;
  }

  var rowId;
  var biggestBet;
  var bettorId;
  new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT * FROM auction ORDER BY id DESC LIMIT 1',
      (err, rows) => {
        if (err) {
          next(err);
          reject(err);
        } else if (rows.length < 1) {
          logger.info(
            `${req.ip} attempted to stop bet but auction has not started`
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
  }).then(rows => {
    const row = rows[0];
    rowId = row.id;
    biggestBet = row.biggest_bet;
    bettorId = row.bettor_id;
    let inProgress = row.in_progress;

    if (!inProgress) {
      logger.info(
        `${req.ip} tried to stop the bet while already not in progress`
      );
      res.json({
        success: false,
        error: `statymas pasibaigęs`,
      });
      throw new Error("bet is already not in progress");
    } 
    dbPool.query(
      'UPDATE auction SET in_progress = 0 WHERE id = ?', [rowId],
      (err) => {
        if (err) {
          next(err);
          throw err;
        }
      }
    );

    logger.info(
      `${req.ip} stopped betting process current`
    );
  }).then (() => {
    balance.update (-biggestBet, bettorId).catch(err => {
      next(err);
      throw err;
    });
    logger.info(
      `Amount ${biggestBet} was taken from ${bettorId} due to auction (got the item)`
    );
  }).then(() => {
    const now = new Date();
    res.json({
      success: true,
      time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    });
  }).catch((err) => {
    logger.error('stop betting error: ' + err);
  }); 
});

router.post(
  '/newItem', 
  [
    v.body('item_name').isString(),
    v.body('min_bet').isString().isNumeric()
  ],
  function (req, res, next) {
    if (!req.session.adminLoggedIn) {
      logger.warn(`${req.ip} attempted to stop current bet by not logged in auction-admin`);
      res.json({
        success: false,
        error: 'neprisijungta prie admin',
        refresh: true,
      });
      return;
    }

    // var rowId;
    // var biggestBet;
    // var bettorId;
    new Promise((resolve, reject) => {
      dbPool.query(
        'SELECT * FROM auction ORDER BY id DESC LIMIT 1',
        (err, rows) => {
          if (err) {
            next(err);
            reject(err);
          } else if (rows.length > 0) {
            const row = rows[0];
            let inProgress = row.in_progress;
            // console.log(rows);
            // console.log(inProgress);
            if (inProgress) {
              logger.info(
                `${req.ip} attempted to start new auction item while other is in progress`
              );
              res.json({
                success: false,
                error: 'kito daikto statymas dar nepasibaigęs',
              });
              reject(new Error ("other item betting not ended"));
            }
          }
          resolve();
        }
      );
    }).then(() => {
      const nowDate = new Date();
      dbPool.query(
        'INSERT INTO auction (item_name, biggest_bet, bettor_id, time) VALUES (?, ?, ?, ?)', 
        [req.body.item_name, req.body.min_bet, auctionID, nowDate],
        (err) => {
          if (err) {
            next(err);
            throw err;
          }
        }
      );

    }).then(() => {
      logger.info(
        `${req.ip} added item ${req.body.item_name} with min bet of ${req.body.min_bet}`
      );

      const now = new Date();
      res.json({
        success: true,
        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      });
    }).catch((err) => {
      logger.error('new item start error: ' + err);
    }); 

});

module.exports = router;
