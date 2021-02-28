var createError = require('http-errors');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var logger = require('./logger');
var split = require('split');
var session = require('express-session');
var session_store = require('express-mysql-session')(session);
var helmet = require('helmet');
var dbPool = require('./db').pool;
const sessionSecret = process.env.SESSION_SECRET;

let rootRouter = require('./routes/root');
let loginRouter = require('./routes/login');
let logoutRouter = require('./routes/logout');
let accountRouter = require('./routes/account');
let accountActionRouter = require('./routes/account-action');
let adminRouter = require('./routes/admin');
let adminActionRouter = require('./routes/admin-action');
let gamePacman = require('./routes/games/pacman');
let gameTetris = require('./routes/games/tetris');
let gameBlackjack = require('./routes/games/blackjack');
let gameSlots = require('./routes/games/slots');
let gameRoulette = require('./routes/games/roulette');
let gameSnake = require('./routes/games/snake');
let auctionRouter = require('./routes/auction');
let auctionAdminRouter = require('./routes/auction-admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  helmet({
    hsts: false,
    xssFilter: false,
    noSniff: false,
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://code.jquery.com',
        'https://stackpath.bootstrapcdn.com',
      ],
      styleSrc: ["'self'", 'https://stackpath.bootstrapcdn.com'],
      objectSrc: ["'none'"],
    },
  })
);
app.use(
  morgan(
    ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    {
      stream: split().on('data', line => logger.verbose(line)),
    }
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    cookie: {
      secure: false, // set to false if using localhost TODO: make auto change
      maxAge: 86400000,
    },
    name: 'simtadienis_session',
    resave: true,
    saveUninitialized: false,
    secret: sessionSecret,
    store: new session_store({}, dbPool),
  })
);
app.use('/javascripts/admin', function (req, res, next) {
  if (!req.session.adminLoggedIn) {
    logger.warn(`${req.ip} attempted to access admin scripts`);
    res.redirect(303, '/');
    return;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/account', accountRouter);
app.use('/account-action', accountActionRouter);
app.use('/admin', adminRouter);
app.use('/admin-action', adminActionRouter);
app.use('/games/pacman', gamePacman);
app.use('/games/tetris', gameTetris);
app.use('/games/blackjack', gameBlackjack);
app.use('/games/slots', gameSlots);
app.use('/games/roulette', gameRoulette);
app.use('/games/snake', gameSnake);
app.use('/auction', auctionRouter);
app.use('/auction-admin', auctionAdminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.redirect(303, '/');
});

// error handler
app.use(function (err, req, res, next) {
  logger.error(err.message);
  logger.verbose('Stack: ' + err.stack);

  // set locals, only providing error in development
  if (req.app.get('env') === 'development') {
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  } else {
    res.status(err.status || 500);
    res.render('error-prod');
  }
});

module.exports = app;
