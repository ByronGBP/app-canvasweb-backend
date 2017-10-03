const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const response = require('../helpers/response');

const User = require('../models/user').User;

const authRoutes = express.Router();

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return response.unprocessable(req, res, 'All fields are mandatory');
  }

  User.findOne({ username }, 'username', (err, userExist) => {
    if (err) {
      return next(err);
    }
    if (userExist) {
      return response.unprocessable(req, res, 'Username already in use.');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return response.data(req, res, newUser.asData());
      });
    });
  });
});

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return response.notFound(req, res);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return response.data(req, res, req.user);
    });
  })(req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  return response.ok(req, res);
});

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    return response.data(req, res, user.asData());
  }

  return response.unauthorized(req, res, 'Not logged!');
});

authRoutes.get('/private', (req, res, next) => {
  console.log(req);
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }
  return response.unauthorized(req, res, 'Not logged!');
});

module.exports = authRoutes;
