var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// handle auth log in

router.get('/login', function(req, res, next) {
  // Check if the user is already logged in
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('login');
  }
});

router.post('/login', function(req, res, next) {
  // Check if the user is already logged in
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    // Extract the username and password from the request body
    const { username, password } = req.body;

    console.log("Username: " + username);


    // Find the user by their username
    User.findByUsername(username)
      .then(user => {
        // If the user is not found, redirect to the login page
        if (!user) {
          console.log('User not found');
          res.redirect('/users/login');
        } else {
          console.log("user found comparing passwords");
          // Compare the password with the stored hash
          bcrypt.compare(password, user.password)
            .then(result => {
              console.log("passwords compared");
              // If the password is correct, store the user in the session
              if (result) {
                console.log("passwords matched. Storing user in session");
                req.session.user = user;
                res.redirect('/dashboard');
              } else {
                console.log("passwords did not match");
                // If the password is incorrect, redirect to the login page
                res.redirect('/users/login');
              }
            });
        }
      });
  }
});

module.exports = router;
