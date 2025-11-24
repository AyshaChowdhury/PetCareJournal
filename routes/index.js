var express = require('express');
var router = express.Router();
const passport = require('passport');
let User = require('../models/usermodel'); // Fixed: Direct import

// Import the PetCareEntry Mongoose model
let PetCareEntry = require('../models/entrymodel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'PetCare Journal',
    displayName: req.user ? req.user.displayName : ''
  });
});

router.get('/home', function (req, res, next) {
  res.redirect('/');
});

// GET method for login
router.get('/login', function (req, res, next) {
  if (!req.user){
    res.render('auth/login', 
      { 
        title: 'Login', 
        messages: req.flash('loginMessage'),
        displayName: ''
      });
  } else {
    return res.redirect('/');
  }
});

// POST method for login
router.post('/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    // server error?
    if (err){
      return next(err);
    }
    // is there a user login error?
    if (!user){
      req.flash('loginMessage', 'Authentication Error');
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      // server error?
      if (err){
        return next(err);
      }
      return res.redirect('/entries');
    });
  })(req, res, next);
});

// GET method for register
router.get('/register', function (req, res, next) {
  if (!req.user){
    res.render('auth/register', 
      { 
        title: 'Register', 
        messages: req.flash('registerMessage'),
        displayName: ''
      });
  } else {
    return res.redirect('/');
  }
});

// POST method for register - FIXED VERSION
router.post('/register', function (req, res, next) {
  // Create new user object
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });
  
  // Attempt to register the new user
  User.register(newUser, req.body.password, function(err){
    if(err){
      console.log("Error: Inserting New User");
      if (err.name == "UserExistsError"){
        req.flash('registerMessage', 'Registration Error: User Already Exists!');
      }
      return res.render('auth/register', 
        { 
          title: 'Register', 
          messages: req.flash('registerMessage'),
          displayName: ''
        });
    } else {
      // if no error exists, then registration is successful
      // redirect the user and authenticate them
      return passport.authenticate('local')(req, res, function(){
        res.redirect('/entries'); // Changed to /entries
      });
    }
  });
});

// GET method for logout
router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;