var express = require('express');
var router = express.Router();
const enterTimestamp = process.env.ENTER_TIMESTAMP;
const endTimestamp = process.env.END_TIMESTAMP;
const appRoot = require('app-root-path');
const balance = require(appRoot + '/services/balance');

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

    const userID = req.session.userID;
    var opts = {
      balance: req.session.balance,
    };
    balance.get(userID).then (bal => {
      req.session.balance = bal;
      opts.balance = bal;
      res.render('root', opts);
    }).catch(err => {
      logger.warn(err);
      res.render('root', opts);  
    });
  }
});
module.exports = router;
