var express = require('express');
var router = express.Router();
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;

router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    res.redirect(303, '/login');
  } else if (!req.session.adminLoggedIn && Date.now() < enterTimestamp) {
    res.redirect(303, '/account?nottime=true');
    return;
  } else if (!req.session.adminLoggedIn && Date.now() > endTimestamp) {
    res.redirect(303, '/auction');
    return;
  } else {
    var opts = {
      // name: req.session.fullName,
      balance: req.session.balance
    }
    res.render('root', opts);
  }
});
module.exports = router;
