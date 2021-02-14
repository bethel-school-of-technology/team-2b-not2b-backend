var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/user');

var tokenService = require('../services/auth');
var passwordService = require('../services/password');
// var checkAuth = require("../public/middleware/check-auth");

// route for user signup-page (add User) - /signup-page
router.post('/signup-page', async (req, res, next) => {
  try {
    console.log(req.body);
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: passwordService.hashPassword(req.body.password),
      pathChoice: req.body.pathChoice,
      progress: 0
    });
    console.log(newUser);
    let result = await newUser.save();
    // let token = tokenService.assignToken(newUser);
    // console.log(result);
    res.json({
      message: 'Your shinobi journey begins today',
      status: 200,
      // token: token
    });

  }
  catch (err) {
    console.log(err);
    res.json({
      message: 'This Shinobi already exists',
      status: 403
    });
  }
});


//route for login => /login
router.post('/login-page', async (req, res, next) => {
  // console.log(req.body);
  // Using the EMAIL to check DB to see if it exists
  User.findOne({ username: req.body.username }, function (err, user) {
    // console.log(req.body);
    if (err) {
      console.log(err);
      res.json({
        message: 'Something far deeper is wrong here sensei',
        status: 500
      });
    }
    if (user) {
      let passwordMatch = passwordService.comparePasswords(req.body.password, user.password);
      // console.log(passwordMatch);
      if (passwordMatch) {
        // Creating the token if the password matches
        let token = tokenService.assignToken(user);
        // console.log(token);
        res.json({
          message: 'You are a true shinobi, you may continue your journey',
          status: 200,
          token: token
        });
      }
      else {
        console.log('Wrong Password');
        res.json({
          message: 'True Shinobis would know their passwords',
          status: 403
        });
      }
    }
    else {
      res.json({
        message: 'Reveal your true identity',
        status: 403
      });
    }

  });

});

// route to get profile info => /profile
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
      res.json({
        message: 'User Profile info loaded successfully',
        status: 200,
        user: responseUser
      });
    }
    else {
      res.json({
        message: 'Token was invalid or expired',
        status: 403
      });
    }
  }
  else {
    res.json({
      message: 'No token received',
      status: 403
    });
  }
});




router.get('/dashboard', async (req, res, next) => {
  console.log(req.headers);
  let userToken = req.headers.authorization;
  // console.log(userToken);
  if (userToken) {
    let currentUser = await tokenService.verifyToken(userToken);
    console.log(currentUser);

    if (currentUser) {
      let responseUser = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username,
        pathChoice: currentUser.pathChoice
      };
      res.json({
        message: 'User Profile info loaded successfully',
        status: 200,
        user: responseUser
      });
    }
    else {
      res.json({
        message: 'Token was invalid or expired',
        status: 403
      });
    }
  }
  else {
    res.json({
      message: 'No token received',
      status: 403
    });
  }
});




module.exports = router;
