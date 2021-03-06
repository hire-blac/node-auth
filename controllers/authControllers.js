require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: ''};

  // duplicate error code
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // validation errors
  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

const maxAge = 3 * 24 * 60* 60;
const tokenKey = process.env.TOKEN_KEY;

// create jwt
const createToken = (id) => {
  return jwt.sign({id}, tokenKey, {
    expiresIn: maxAge
  })
}


module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({email, password});
    const token =  createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })
    res.redirect('/smoothies');
  } 
  catch (err) {
    res.status(401).json({ errors });
    const errors = handleErrors(err);
    console.log(err);
    res.status(401).json({ errors });
  }
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token =  createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })
    res.redirect('/smoothies');
  }
  catch (err){
    res.status(400).json({message: 'invalid login credentials'})
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1})
  res.redirect('/')
}