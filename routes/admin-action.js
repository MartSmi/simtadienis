var express = require('express');
var dbPool = require('../db').pool;
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var Q = require('q');
var v = require('express-validator/check');
var vs = require('express-validator/filter');
var vr = require('validator');
var parseCSV = require('csv-parse');
var createError = require('http-errors');
var logger = require('../logger');
var router = express.Router();

function sql_err(res, err) {
	res.json({
		success: false,
		error: `SQL error ${err.code}: ${err.sqlMessage}`
	});
}

function chk_validation_errs(req, res, err_txt) {
	const errors = v.validationResult(req);
	if (!errors.isEmpty()) {
		res.json({
			success: false,
			error: err_txt
		});
		return true;
	}
	return false;
}

function destroy_sessions_pred(res, predicate) {
	dbPool.query('SELECT session_id, data FROM sessions', function(err, rows, fields) {
		if (err) {
			logger.error(`DB error on SELECT while destroying session(s): ${err.code}: ${err.sqlMessage}`);
			sql_err(res, err);
			return;
		}

		var ids = [];

		for (session of rows) {
			if (predicate(JSON.parse(session.data))) {
				ids.push(session.session_id);
			}
		}

		if (ids.length > 0) {
			const ids_qms = 'session_id = ' + ids.map(i => '?').join(' OR session_id = ');
			dbPool.query('DELETE FROM sessions WHERE ' + ids_qms, ids, function(err, rows, fields) {
				if (err) {
					logger.error(`DB error on DELETE while destroying session(s): ${err.code}: ${err.sqlMessage}`);
					sql_err(res, err);
					return;
				}
				logger.info(`${ids.length} sessions destroyed`);
				res.json({ success: true });
			});
		}
		else {
			logger.info('no sessions destroyed');
			res.json({ success: true });
		}
	});
}

router.use(function(req, res, next) {
	if (!req.session.adminLoggedIn) {
		logger.warn(`${req.ip} attempted to access /admin-action without being logged in`);
		if (req.path === '/') {
			next(createError(404));
		}
		else {
			res.json({
				success: false, error: 'not logged in'
			});
		}
		return;
	}
	next();
});

router.post('/add-user', [
	v.body('username').isString(),
	v.body('full_name').isString(),
	v.body('klase').isString().isLength({min: 0, max: 4}),
	v.body('password').isString(),
	v.body('balance').isString().isNumeric(),
	vs.sanitizeBody('can_send').toBoolean(true),
	vs.sanitizeBody('can_receive').toBoolean(true),
	vs.sanitizeBody('is_station').toBoolean(true),
	vs.sanitizeBody('is_frozen').toBoolean(true)
], function(req, res, next) {
	if (chk_validation_errs(req, res, 'invalid username, full name, class, balance, or password')) return;

	logger.warn(`${req.ip} is adding a user`);

	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			logger.error(`bcrypt error while adding a user`);
			next(err);
			return;
		}

		var query = `
			INSERT INTO users (username, password, full_name, klase, balance, can_send, can_receive, is_station, is_frozen)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const insert = [
			req.body.username,
			hash,
			req.body.full_name,
			req.body.klase === '' ? null : req.body.klase,
			req.body.balance,
			req.body.can_send,
			req.body.can_receive,
			req.body.is_station,
			req.body.is_frozen
		];
		query = mysql.format(query, insert);

		dbPool.query(query, function (error, rows, fields) {
			if (error) {
				logger.error(`DB error while adding a user: ${err.code}: ${err.sqlMessage}`);
				sql_err(res, err);
			}
			else {
				logger.info('user successfully added');
				res.json({ success: true });
			}
		});
	});
});

router.post('/add-users-bulk', v.body('table').isString(), function(req, res, next) {
	if (chk_validation_errs(req, res, 'non-string data')) return;

	logger.warn(`${req.ip} is adding users in bulk`);

	parseCSV(req.body.table, function(err, rows) {
		if (err) {
			logger.error('CSV parsing error while adding users in bulk:');
			next(err);
			return;
		}

		for (row of rows) {
			if (row.length !== 9) {
				logger.warn(`wrong number of columns while adding users in bulk`);
				res.json({
					success: false,
					error: 'incorrect number of columns'
				});
				return;
			}
			if (!vr.isLength(row[3], { min: 0, max: 4 })) {
				logger.warn(`invalid class while adding users in bulk`);
				res.json({
					success: false,
					error: 'invalid class'
				});
				return;
			}
			if (!vr.isNumeric(row[4], { no_symbols: false })) {
				logger.warn(`non-numeric balance while adding users in bulk`);
				res.json({
					success: false,
					error: 'non-numeric balance'
				});
				return;
			}
		}

		rows = rows.map(r => {
			r[1] = bcrypt.hashSync(r[1], 10);
			r[3] = r[3] === '' ? null : r[3];
			for (var i = 5; i <= 8; i++)
				r[i] = vr.toBoolean(r[i], true);
			return r;
		});

		const query = 'INSERT INTO users (username, password, full_name, klase, balance, can_send, can_receive, is_station, is_frozen) VALUES ' +
			rows.map(r => '(' + r.map(c => '?').join(',') + ')').join(', ');
		const values = rows.reduce((acc, r) => acc.concat(r), []);

		dbPool.query(query, values, function(err, rows, fields) {
			if (err) {
				logger.error(`DB error while adding users in bulk: ${err.code}: ${err.sqlMessage}`);
				sql_err(res, err);
				return;
			}
			logger.info('successfully added users in bulk');
			res.json({ success: true });
		});
	});
});

router.post('/revert', [
	v.body('id').isString().isNumeric({no_symbols: true}),
	vs.sanitizeBody('rev').toBoolean()
], function(req, res, next) {
	if (chk_validation_errs(req, res, 'invalid id')) return;

	var dbConn;
	var t;
	var r = req.body.rev;
	const un = req.body.rev ? '' : 'un';

	logger.warn(`${req.ip} is ${un}reverting transaction #${req.body.id}`);

	Q.ninvoke(dbPool, 'getConnection')
		.then(function(conn) {
			dbConn = conn;
			return Q.ninvoke(dbConn, 'query', 'SELECT id, id_from, id_to, amount FROM transactions WHERE id = ?', req.body.id);
		})
		.then(function(rows) {
			t = rows[0][0];
			return Q.ninvoke(dbConn, 'beginTransaction');
		})
		.then(function() {
			return Q.ninvoke(dbConn, 'query', 'UPDATE users SET balance = balance + ? WHERE id = ? LIMIT 1', [t.amount, r ? t.id_from : t.id_to]);
		})
		.then(function() {
			return Q.ninvoke(dbConn, 'query', 'UPDATE users SET balance = balance - ? WHERE id = ? LIMIT 1', [t.amount, r ? t.id_to : t.id_from]);
		})
		.then(function() {
			return Q.ninvoke(dbConn, 'query', 'UPDATE transactions SET reverted = ? WHERE id = ? LIMIT 1', [r, t.id]);
		})
		.then(function() {
			return Q.ninvoke(dbConn, 'commit');
		})
		.then(function() {
			dbConn.release();
			logger.info(`transaction #${req.body.id} successfully ${un}reverted`);
			res.json({
				success: true
			});
		})
		.catch(function(err) {
			dbConn.rollback(function() {
				dbConn.release();
				logger.error(`DB error while ${un}reverting transaction #${req.body.id}: ${err.code}: ${err.sqlMessage}`);
				sql_err(res, err);
			});
		})
		.done();
});

router.post('/change-password', [
	v.body('id').isString().isNumeric({no_symbols: true}),
	v.body('password').isString()
], function(req, res, next) {
	if (chk_validation_errs(req, res, 'invalid id or password')) {
		logger.warn('invalid id or password passed to /admin-action/change-password');
		return;
	}

	logger.warn(`${req.ip} is changing the password of ${req.body.id}`);
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			logger.error(`bcrypt error while changing the password of ${req.body.id}`);
			next(err);
			return;
		}
		dbPool.query('UPDATE users SET password = ? WHERE id = ? LIMIT 1', [hash, req.body.id], function(err, rows, fields) {
			if (err) {
				logger.error(`DB error while changing the password of ${req.body.id}: ${err.code}: ${err.sqlMessage}`);
				sql_err(res, err);
				return;
			}
			logger.info(`successfully changed password of ${req.body.id}`);
			res.json({ success: true });
		});
	});
});

router.post('/destroy-sessions', v.body('id').isString().isNumeric({no_symbols: true}), function(req, res, next) {
	if (chk_validation_errs(req, res, 'invalid id')) {
		logger.warn('invalid id passed to /admin-action/destroy-sessions');
		return;
	}

	const id = parseInt(req.body.id);
	logger.warn(`${req.ip} is destroying sesssions (ID: ${req.body.id})`);
	destroy_sessions_pred(res, sessionData => sessionData.userID === id);
});

router.post('/freeze', [
	v.body('id').isString().isNumeric({no_symbols: true}),
	vs.sanitizeBody('fr').toBoolean(true)
], function(req, res, next) {
	if (chk_validation_errs(req, res, 'invalid id')) {
		logger.warn('invalid id passed to /admin-action/freeze');
		return;
	}

	const un = req.body.fr ? '' : 'un'
	logger.warn(`${req.ip} is ${un}freezing ${req.body.id}`);

	dbPool.query('UPDATE users SET is_frozen = ? WHERE id = ? LIMIT 1', [req.body.fr, req.body.id], function(err, rows, fields) {
		if (err) {
			logger.error(`DB error while ${un}freezing ${req.body.id}: ${err.code}: ${err.sqlMessage}`);
			sql_err(res, err);
		}
		else if (rows.length < 1) {
			logger.error(`no rows affected while ${un}freezing ${req.body.id}`);
			res.json({
				success: false,
				error: 'no rows affected'
			});
		}
		else {
			logger.info(`${req.body.id} was successfully ${un}frozen`);
			res.json({ success: true });
		}
	});
});

router.post('/destroy-all-admin-sessions', function(req, res, next) {
	logger.warn(`${req.ip} is destroying admin sessions`);
	destroy_sessions_pred(res, sessionData => sessionData.adminLoggedIn);
});

module.exports = router;
