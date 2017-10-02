const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user').User;
const bcrypt = require('bcrypt');

module.exports = function (passport) {

  passport.serializeUser((loggedInUser, cb) => {
    cb(null, loggedInUser._id);
  });

  passport.deserializeUser((userIdFromSession, cb) => {
    User.findById(userIdFromSession, (err, userDocument) => {
      if (err) {
        cb(err);
        return;
      }

      cb(null, userDocument);
    });
  });

  passport.use('local-login', new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: 'Something went wrong while logging.' });
        return;
      }

      next(null, foundUser);
    });
  }));

  passport.use('local-signup', new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    process.nextTick(() => {
      User.findOne({ username }, '_id', (err, foundUser) => {
        if (foundUser) {
          next(null, true, {message: 'Username already exist'});
          return;
        }

        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        const theUser = new User({
          username,
          password: hashPass
        });

        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }

          next(null, theUser);
        });
      });
    });
  }));
};
