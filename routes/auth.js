const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const response = require('../helpers/response');

const User = require('../models/user').User;

const authRoutes = express.Router();

authRoutes.post('/signup', (req, res, next) => {
  passport.authenticate('local-login', (err, theUser, failureDetails) => {
    privateLoginStuff(err, req, res, theUser, failureDetails);
  })(req, res, next);
});


authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, theUser, failureDetails) => {
    privateLoginStuff(err, req, res, theUser, failureDetails);
  }) (req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  response.unauthorized(req, res, err);
});

authRoutes.get('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});

function privateLoginStuff(err, req, res, theUser, failureDetails) {
  if (err) {
    response.unexpectedError(req, res, err);
    return;
  }

  if (!theUser) {
    res.status(401).json(failureDetails);
    return;
  }

  req.login(theUser, (err) => {
    if (err) {
      response.unexpectedError(req, res, err);
      return;
    }
    res.status(200).json(req.user);
  });
}

module.exports = authRoutes;
