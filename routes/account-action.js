var express = require('express');
var dbPool = require('../db').pool;
var Q = require('q');
var v = require('express-validator/check');
var vs = require('express-validator/filter');
var logger = require('../logger');
var router = express.Router();

router.post('/transfer', [
	v.body('to_account').isString(),
	v.body('amount').isNumeric({no_symbols: true}).withMessage('suma privalo būti teigiama')
], function(req, res, next) {
	if (!req.session.loggedIn) {
		logger.warn(`attempted transfer by a non-logged-in session`);
		res.json({
			success: false,
			error: '',
			refresh: true
		});
		return;
	}

	var errors = v.validationResult(req);
	if (!errors.isEmpty()) {
		logger.warn(`invalid amount or account (userID: ${req.session.userID})`);
		res.json({
			success: false,
			error: errors.array().map(o => o.msg).join(', ')
		});
		return;
	}

	if (req.body.amount < 1) {
		logger.warn(`negative amount (secondary) (userID: ${req.session.userID})`);
		res.json({
			success: false,
			error: 'suma privalo būti teigiama'
		});
		return;
	}

	
	var fromID = req.session.userID;
	var toID;
	var dbConn;
	var from_full_name;
	var to_full_name;
	var from_is_station;

	// getting a dedicated connection is necessary since we're using transactions
	Q.ninvoke(dbPool, 'getConnection')
		.then(function (conn) {
			dbConn = conn;
			return Q.ninvoke(dbConn, 'query', 'SELECT full_name, balance, can_send, is_station, is_frozen FROM users WHERE id = ?', fromID);
		})
		.then(function(rows) {
			if (rows[0].length < 1) {
				logger.error(`non-existant logged-in user: ${req.session.userID}`);
				res.json({
					success: false,
					error: 'tavo sąskaita neegzistuoja.'
				});
				return 'failure';
			}
			const row = rows[0][0];
			from_full_name = row.full_name;
			from_is_station = row.is_station;

			const balance = row.balance;
			if (req.body.amount > balance) {
				logger.info(`${from_full_name} attempted a transfer with insufficient funds (${req.body.amount} > ${balance})`);
				res.json({
					success: false,
					error: `neužtenka pinigų (dabartinis balansas: ${balance})`
				});
				return 'failure';
			}
			else if (row.is_frozen || !row.can_send) {
				const frozen = row.is_frozen ? 'frozen' : 'non-can_send'
				logger.warn(`attempted transfer by ${frozen} account ${from_full_name}`);
				res.json({
					success: false,
					error: 'tavo sąskaitai neleidžiama daryti mokėjimų'
				});
				return 'failure';
			}
			else {
				return Q.ninvoke(dbConn, 'query', 'SELECT id, full_name, balance, can_receive, is_station, is_frozen FROM users WHERE username = ?', req.body.to_account);
			}
		})
		.then(function (rows) {
			if (rows === 'failure') return 'failure';
			else if (rows[0].length < 1) {
				logger.info(`${from_full_name} attempted a transfer to non-existant account`);
				res.json({
					success: false,
					error: 'nėra tokios sąskaitos'
				});
				return 'failure';
			}

			const row = rows[0][0];
			toID = row.id;
			to_full_name = row.full_name;

			if (toID === fromID) {
				logger.warn(`${from_full_name} attempted a transfer to themself`);
				res.json({
					success: false,
					error: 'daryti pervedimų sau negalima'
				});
				return 'failure';
			}
			else if (!row.can_receive) {
				logger.info(`${from_full_name} attempted a transfer to a non-can_send account (${row.full_name})`);
				res.json({
					success: false,
					error: 'sąskaita, kuriai bandoma pervesti, yra nepriimanti pinigų'
				})
				return 'failure';
			}
			else if (row.is_frozen) {
				logger.info(`${from_full_name} attempted a transfer to a frozen account (${row.full_name})`);
				res.json({
					success: false, 
					error: 'sąskaita, kuriai bandoma pervesti, užšaldyta'
				});
				return 'failure';
			}
			else if (from_is_station && row.is_station) {
				logger.warn(`the station ${from_full_name} attempted a transfer to another station (${row.full_name})`);
				res.json({
					success: false,
					error: 'pervedimai tarp punktų negalimi'
				});
				return 'failure';
			}
			else {
				return Q.ninvoke(dbConn, 'beginTransaction');
			}
		})
		.then(function(ret) {
			if (ret === 'failure') return 'failure';
			return Q.ninvoke(
				dbConn, 'query',
				'INSERT INTO transactions (id_from, id_to, amount, time) VALUES (?, ?, ?, CURRENT_TIME())',
				[fromID, toID, req.body.amount]
			)
		})
		.then(function(ret) {
			if (ret === 'failure') return 'failure';
			return Q.ninvoke(dbConn, 'query', 'UPDATE users SET balance = balance - ? WHERE id = ? LIMIT 1', [req.body.amount, fromID]);
		})
		.then(function(rows) {
			if (rows === 'failure') return 'failure';
			return Q.ninvoke(dbConn, 'query', 'UPDATE users SET balance = balance + ? WHERE id = ? LIMIT 1', [req.body.amount, toID]);
		})
		.then(function(rows) {
			if (rows === 'failure') return 'failure';
			return Q.ninvoke(dbConn, 'commit');
		})
		.then(function(ret) {
			dbConn.release();
			if (ret === 'failure') return;
			const now = new Date();
			const high = req.body.amount > 100;

			if (high) logger.warn('large (> 100) transfer:');
			logger.log(high ? 'warn' : 'info', `transfer: [${req.body.amount}] ${from_full_name} -> ${to_full_name}`);

			res.json({
				success: true,
				account: to_full_name,
				amount: req.body.amount,
				time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
			});
		})
		.catch(function(err) {
			logger.error('transfer error: ' + err);
			dbConn.rollback(function() {
				dbConn.release();
				res.json({
					success: false,
					error: 'techninė.'
				});
			});
		})
		.done();
});

module.exports = router;
