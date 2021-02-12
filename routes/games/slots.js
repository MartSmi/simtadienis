const appRoot = require('app-root-path');
const express = require('express');
// var dbPool = require(appRoot + '/db').pool;
// var mysql = require('mysql');
var logger = require(appRoot + '/logger');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /slots without logging in');
    res.redirect(303, '/');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance
    }
    res.render('games/slots', opts);
  }
});

module.exports = router;
