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
const MongoStore = require('connect-mongo')(session);

const response = require('./helpers/response');
const passportSetup = require('./config/passport');

const index = require('./routes/index');
const users = require('./routes/users');
const painting = require('./routes/painting');
const render = require('./routes/render');

passportSetup(passport);
const app = express();

mongoose.connect(process.env.MONGO_DB_);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'todo-app',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie : { httpOnly: true, maxAge: 24192 }
}));

app.use(cors({
  credentials: true,
  origin: ['http://localhost:8080']
  })
);

passportSetup(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/auth', authRoutes);
app.use('/users', users);
app.use('/paintings', painting);
app.use('/render', render);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  response.notFound(req, res);
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
