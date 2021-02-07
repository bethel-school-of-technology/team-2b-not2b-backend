var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/user');

var tokenService = require('../services/auth');
var passwordService = require('../services/password');
var checkAuth = require("../public/middleware/check-auth");

// route for user signup-page (add User) - /signup-page
router.post('/signup-page', async (req, res, next) => {
  try {
    // console.log(req.body);
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: passwordService.hashPassword(req.body.password)
    });
    console.log(newUser);
    let result = await newUser.save();
    console.log(result);
    res.status(200).json({
      message: 'This is a true shinobi',
      id: newUser._id
    });

  }
  catch (err) {
    console.log(err);
    res.status(403).json({
      message: 'This Shinobi already exists',
    });
  }
});

// router.post('/decision/:userId.:path', async (req, res, next) => {
//   console.log(req.params);
//   res.send();
// })

//route for login => /login
router.post('/login-page', async (req, res, next) => {
  // console.log(req.body);
  // Using the EMAIL to check DB to see if it exists
  User.findOne({ email: req.body.email }, function (err, user) {
    // console.log(req.body);
    if (err) {
      console.log(err);
      res.status(500).json({
        message: 'Something far deeper is wrong here sensei'
      });
    }
    if (user) {
      let passwordMatch = passwordService.comparePasswords(req.body.password, user.password);
      // console.log(passwordMatch);
      if (passwordMatch) {
        // Creating the token if the password matches
        let token = tokenService.assignToken(user);
        // console.log(token);
        res.status(200).json({
          message: 'You are a true shinobi, you may continue your journey',
          token: token
        });
      }
      else {
        console.log('Wrong Password');
        res.status(403).json({
          message: 'True Shinobis would know their passwords',
        });
      }
    }
    else {
      res.status(403).json({
        message: 'Reveal your true identity'
      });
    }

  });

});

// route to get profile info => /profile
router.get('/profile', async (req, res, next) => {
  console.log(req.headers);
  let userToken = req.headers.auth;
  // console.log(userToken);
  if (userToken) {
    let currentUser = await tokenService.verifyToken(userToken);
    console.log(currentUser);

    if (currentUser) {
      let responseUser = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username
      };
      res.status(200).json({
        message: 'User Profile info loaded successfully',
        user: responseUser
      });
    }
    else {
      res.status(403).json({
        message: 'Token was invalid or expired'
      });
    }
  }
  else {
    res.status(403).json({
      message: 'No token received'
    });
  }
});



router.get('/decision-page', async (req, res, next) => {
  console.log(req.headers);
  let userToken = req.headers.auth;
  console.log(userToken);

  if (userToken) {
    let currentUser = await tokenService.verifyToken(userToken);
    console.log(currentUser);

    if (currentUser) {
      let responseUser = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username
      };
      res.status(200).json({
        message: 'User Profile info loaded successfully',
        user: responseUser
      });
    }
    else {
      res.status(403).json({
        message: 'Token was invalid or expired'
      });
    }
  }
  else {
    res.status(403).json({
      message: 'No token received'
    });
  }
});

module.exports = router;
