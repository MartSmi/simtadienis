var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    res.redirect(303, '/login');
  } else {
    res.render('root');
  }
});
module.exports = router;
