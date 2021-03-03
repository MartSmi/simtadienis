var express = require('express');
var dbPool = require('../db').pool;
var mysql = require('mysql');
var Q = require('q');
var logger = require('../logger');
var router = express.Router();
var vs = require('express-validator/filter');

router.get('/', [
  vs.sanitizeQuery('nottime').toBoolean(true),
  vs.sanitizeQuery('auctionNotStarted').toBoolean(true),
],
function (req, res, next) {
  if (!req.session.loggedIn) {
    logger.warn('attempt to access /account without logging in');
    res.redirect(303, '/');
    return;
  }

  var opts = { title: 'Tavo sąskaita' };
  var id = req.session.userID;

  opts.nottime = req.query.nottime;
  opts.auctionNotStarted = req.query.auctionNotStarted;

  Q.ninvoke(dbPool, 'query', 'SELECT * FROM users WHERE id = ?', id)
    .then(function (rows) {
      var row = rows[0][0];
      opts.name = row.full_name;
      opts.username = row.username;
      opts.balance = row.balance;
      opts.can_send = row.can_send;
      opts.can_receive = row.can_receive;
      opts.frozen = row.is_frozen;
      return Q.ninvoke(
        dbPool,
        'query',
        `
				SELECT
					IF(t.id_from = ?, u2.full_name, u1.full_name) AS name,
					t.id_from = ? AS outgoing,
					amount,
					\`time\`,
					reverted
				FROM transactions t
				JOIN users u1 ON t.id_from = u1.id
				JOIN users u2 ON t.id_to = u2.id
				WHERE t.id_from = ? OR t.id_to = ?
				ORDER BY t.id DESC
			`,
        [id, id, id, id]
      );
    })
    .then(function (rows) {
      opts.transactions = rows[0];
      res.render('account', opts);
    })
    .catch(function (err) {
      logger.error('Error on account page:');
      next(err);
    })
    .done();
});

module.exports = router;
