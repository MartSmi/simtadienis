var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if (req.session.loggedIn) {
		res.redirect(303, '/account');
	}
	else {
		res.redirect(303, '/login');
	}
});

module.exports = router;
