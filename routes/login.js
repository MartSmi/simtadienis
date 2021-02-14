var express = require('express');
var v = require('express-validator/check');
var vs = require('express-validator/filter');
var mysql = require('mysql');
var dbPool = require('../db').pool;
var querystring = require('querystring');
var bcrypt = require('bcrypt');
var logger = require('../logger');
var router = express.Router();

router.get(
  '/',
  [
    vs.sanitizeQuery('failure').toBoolean(true),
    vs.sanitizeQuery('badcreds').toBoolean(true),
    vs.sanitizeQuery('logout').toBoolean(true),
  ],
  function (req, res, next) {
    if (req.session.loggedIn) res.redirect(303, '/');
    else
      res.render('login', {
        failure: req.query.failure,
        badcreds: req.query.badcreds,
        logout: req.query.logout,
      });
  }
);

router.post(
  '/',
  [v.body('username').isString(), v.body('password').isString()],
  function (req, res, next) {
    var query =
      'SELECT id, full_name, klase, password, is_station, balance FROM users WHERE username = ?';
    dbPool.query(query, req.body.username, function (error, rows, fields) {
      if (error || rows.length > 1) {
        console.log(rows);
        logger.error(
          error ? `DB error on login: ${error}` : '***NON-UNIQUE USERNAME***'
        );
        res.redirect(303, req.baseUrl + '?failure=true');
        return;
      } else if (rows.length < 1) {
        logger.info(`failed login (bad username)`);
        res.redirect(303, req.baseUrl + '?badcreds=true');
        return;
      }

      bcrypt.compare(
        req.body.password,
        rows[0].password,
        function (err, valid) {
          if (err) {
            logger.error(`bcrypt error on ${rows[0].username}`);
            next(err);
          } else if (!valid) {
            logger.info(
              `failed login (bad pw) on ${rows[0].full_name} (${rows[0].klase})`
            );
            res.redirect(303, req.baseUrl + '?badcreds=true');
          } else {
            logger.info(`login: ${rows[0].full_name} (${rows[0].klase})`);
            req.session.loggedIn = true;
            req.session.userID = rows[0].id;
            req.session.fullName = rows[0].full_name;
            req.session.klase = rows[0].klase;
            req.session.balance = rows[0].balance;
            // console.log(req.session.fullName);
            // console.log(req.session.balance);
            // console.log(rows);
            res.redirect(303, '/');
          }
        }
      );
    });
  }
);

module.exports = router;
