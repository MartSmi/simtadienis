const appRoot = require('app-root-path');
const express = require('express');
var dbPool = require(appRoot + '/db').pool;
var mysql = require('mysql');
var Q = require('q');
var logger = require(appRoot + '/logger');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /rock_paper_scissors without logging in');
    res.redirect(303, '/');
    return;
  }
});

module.exports = router;
