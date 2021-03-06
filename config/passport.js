const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user').User;
const bcrypt = require('bcrypt');

function configure(passport) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    user = user ? new User(user) : null;
    done(null, user);
  });

  passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({
      username
    }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(null, false, {
          error: 'Something wrong while loggin'
        });
      }

      return next(null, user);
    });
  }));
}

module.exports = configure;
