var express = require('express');
var logger = require('../logger');
var router = express.Router();

router.post('/', function(req, res, next) {
	logger.info(`logout: ${req.session.fullName} (${req.session.klase})`);
	req.session.loggedIn = false;
	req.session.guest = false;
	req.session.userID = undefined;
	req.session.fullName = undefined;
	req.session.klase = undefined;
	req.session.balance = undefined;
	res.redirect(303, '/login?logout=true');
});

module.exports = router;
