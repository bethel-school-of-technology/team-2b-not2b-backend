var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/user');

var tokenService = require('../services/auth');
var passwordService = require('../services/password');

// route for user signup (add User) - /signup
router.post('/signup', async (req,res, next) => {
  try{
    // console.log(req.body);
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: passwordService.hashPassword(req.body.password)
    });
    // console.log(newUser);
    let result = await newUser.save();
    // console.log(result);
    res.json({
      message: 'This is a true shinobi',
      status: 200,
    })
  }
  catch(err){
    console.log(err);
    res.json({
      message: 'True Shinobis would know their passwords',
      status: 403,
    })
  }
})

//route for login => /login
router.post('/login', async (req,res, next) => {
  // console.log(req.body);

  // Using the username to check DB to see if it exists
  User.findOne({username: req.body.username}, function(err, user){
    if(err){
      console.log(err);
      res.json({
        message: 'Something far deeper is wrong here sensei',
        status: 500,
      })
    }
    console.log(user);
    if(user){
      let passwordMatch = passwordService.comparePasswords(req.body.password, user.password);
      if(passwordMatch){
        // Creating the token
        let token = tokenService.assignToken(user);
        res.json({
          message: 'You are a true shinobi, you may continue your journey',
          status: 200,
          token
        })
      }
      else{
        console.log('Wrong Password');
        res.json({
          message: 'True Shinobis would know their passwords',
          status: 403,
        })
      }
    }
    else{
      res.json({
        message: 'Reveal your true identity',
        status: 403,
      })
    }
  })
  
})

// route to get profile info => /profile
router.get('/profile', async (req,res, next) => {
  console.log(req.headers);
  let userToken = req.headers.auth;
  console.log(userToken);

  if(userToken){
    let currentUser = await tokenService.verifyToken(userToken);
    console.log(currentUser);

    if(currentUser){
      let responseUser = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username
      }
      res.json({
        message: 'User Profile info loaded successfully',
        status: 200,
        user: responseUser
      })
    }
    else{
      res.json({
        message: 'Token was invalid or expired',
        status: 403,
      })
    }
  }
  else{
    res.json({
      message: 'No token received',
      status: 403,
    })
  }
})

module.exports = router;
