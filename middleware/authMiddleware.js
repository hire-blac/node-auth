require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenKey = process.env.TOKEN_KEY;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if jwt exists and verify
  if(token) {
    jwt.verify(token, tokenKey, (err, decodedToken) => {
      if(err) {
        console.log(err.message);
        res.redirect('/login');
      }
      else {
        next();
      }
    })
  }
  else {
    res.redirect('/login');
  }
}

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if jwt exists and verify
  if(token) {
    jwt.verify(token, tokenKey, async (err, decodedToken) => {
      if(err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      }
      else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  }
  else {
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };