var express = require('express');
var v = require('express-validator/check');
var vs = require('express-validator/filter');
var bcrypt = require('bcrypt');
var dbPool = require('../db').pool;
var logger = require('../logger');
var router = express.Router();
const adminPassHash = process.env.ADMIN_PASS_HASH;

router.get('/', function (req, res, next) {
  if (!req.session.adminLoggedIn) {
    logger.warn(`${req.ip} accessed /admin (not logged in)`);
    res.redirect(303, req.baseUrl + '/login');
  } else {
    logger.info(`${req.ip} accessed /admin (logged in)`);
    res.redirect(303, req.baseUrl + '/main');
  }
});

router.get(
  '/login',
  [
    vs.sanitizeQuery('badcreds').toBoolean(true),
    vs.sanitizeQuery('logout').toBoolean(true),
  ],
  function (req, res, next) {
    if (req.session.adminLoggedIn) {
      res.redirect(303, req.baseUrl);
      return;
    }
    res.render('admin-login', {
      badcreds: req.query.badcreds,
      logout: req.query.logout,
    });
  }
);

router.post('/login', v.body('password').isString(), function (req, res, next) {
  if (req.session.adminLoggedIn) {
  } else {
    bcrypt.compare(req.body.password, adminPassHash, function (err, valid) {
      if (err) {
        logger.error(`bcrypt error on admin login (by ${req.ip}): ${err}`);
        next(err);
      } else if (!valid) {
        logger.warn(`wrong password for admin by ${req.ip}`);
        res.redirect(303, '/admin/login?badcreds=true');
      } else {
        logger.warn(`successful admin login by ${req.ip}`);
        req.session.adminLoggedIn = true;
        res.redirect(303, req.baseUrl + '/');
      }
    });
  }
});

router.post('/logout', function (req, res, next) {
  logger.info(`admin logout by ${req.ip}`);
  req.session.adminLoggedIn = false;
  res.redirect(303, '/admin/login?logout=true');
});

// --- login-gated subpages ---

router.use(function (req, res, next) {
  if (!req.session.adminLoggedIn) {
    logger.warn(`${req.ip} attempted to access /admin/* while not logged in`);
    res.redirect(303, req.baseUrl);
    return;
  }
  next();
});

router.get('/main', function (req, res, next) {
  res.render('admin');
});

router.get('/users', function (req, res, next) {
  logger.info(`${req.ip} accessed /admin/users`);
  dbPool.query(
    'SELECT * FROM users ORDER BY id ASC',
    function (err, rows, fields) {
      if (err) {
        logger.error(`DB error on /admin/users (${req.ip}):`);
        next(err);
        return;
      }
      res.render('admin-users', {
        users: rows,
      });
    }
  );
});

router.get('/transactions', function (req, res, next) {
  logger.info(`${req.ip} accessed /admin/transactions`);
  dbPool.query(
    `
		SELECT
			t.id AS id,
			u1.id AS from_id,
			u1.full_name AS \`from\`,
			u2.id AS to_id,
			u2.full_name AS \`to\`,
			amount,
			\`time\`,
			reverted
		FROM transactions t
		JOIN users u1 ON t.id_from = u1.id
		JOIN users u2 ON t.id_to = u2.id
		ORDER BY t.id DESC
	`,
    function (err, rows, fields) {
      if (err) {
        logger.error(`DB error on /admin/transactions (${req.ip}):`);
        next(err);
        return;
      }
      res.render('admin-transactions', {
        transactions: rows,
      });
    }
  );
});

module.exports = router;
