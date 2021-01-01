var express = require('express');
var logger = require('../logger');
var router = express.Router();

router.post('/', function(req, res, next) {
	logger.info(`logout: ${req.session.fullName} (${req.session.klase})`);
	req.session.loggedIn = false;
	req.session.userID = undefined;
	req.session.fullName = undefined;
	req.session.klase = undefined;
	res.redirect(303, '/login?logout=true');
});

module.exports = router;
