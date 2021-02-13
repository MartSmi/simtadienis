var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    res.redirect(303, '/login');
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance
    }
    res.render('root', opts);
  }
});
module.exports = router;
