const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const passport = require('passport');

const response = require('./helpers/response');
const passportSetup = require('./config/passport');

const index = require('./routes/index');
const users = require('./routes/users');
const painting = require('./routes/painting');

passportSetup(passport);
const app = express();

mongoose.connect('mongodb://localhost/app-canvasweb-db');

app.use(session({
  secret: 'angular auth passport secret shh',
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/auth', authRoutes);
app.use('/users', users);
app.use('/paintings', painting);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  response.notFound(res);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if (!res.headersSent) {
      response.unexpectedError(req, res, err);
  }
});

module.exports = app;
