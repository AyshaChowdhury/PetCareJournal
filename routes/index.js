var express = require('express');
var router = express.Router();
const passport = require('passport');

// FIXED: Destructure User from the export
// The usermodel.js exports as: module.exports.User = mongoose.model('User', User)
// So we need to destructure it: { User }
let { User } = require('../models/usermodel');

// Import the PetCareEntry Mongoose model
let PetCareEntry = require('../models/entrymodel');

/* ============================================
   HOME PAGE
   ============================================ */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'PetCare Journal',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* Redirect /home to / */
router.get('/home', function (req, res, next) {
  res.redirect('/');
});

/* ============================================
   LOGIN - GET (Display Login Page)
   ============================================ */
router.get('/login', function (req, res, next) {
  // If user is already logged in, redirect to home
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

/* ============================================
   LOGIN - POST (Process Login Form)
   ============================================ */
router.post('/login', function (req, res, next) {
  // Use passport's local authentication strategy
  passport.authenticate('local', (err, user, info) => {
    // Check for server error
    if (err){
      console.error('❌ Login Error:', err);
      return next(err);
    }
    
    // Check if authentication failed (wrong username/password)
    if (!user){
      req.flash('loginMessage', 'Authentication Error: Invalid username or password');
      return res.redirect('/login');
    }
    
    // If authentication successful, log the user in
    req.login(user, (err) => {
      // Check for server error during login
      if (err){
        console.error('❌ Session Error:', err);
        return next(err);
      }
      
      // Login successful - redirect to entries page
      console.log('✅ User logged in:', user.username);
      return res.redirect('/entries');
    });
  })(req, res, next);
});

/* ============================================
   REGISTER - GET (Display Registration Page)
   ============================================ */
router.get('/register', function (req, res, next) {
  // If user is already logged in, redirect to home
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

/* ============================================
   REGISTER - POST (Process Registration Form)
   ============================================ */
router.post('/register', function (req, res, next) {
  // Validate that all required fields are filled
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.displayName) {
    req.flash('registerMessage', 'All fields are required!');
    return res.render('auth/register', 
      { 
        title: 'Register', 
        messages: req.flash('registerMessage'),
        displayName: ''
      });
  }

  // Create new user object with form data
  // Note: Password is NOT included here - passport-local-mongoose handles it
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });
  
  // Attempt to register the new user
  // User.register() is provided by passport-local-mongoose plugin
  // It hashes the password automatically
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      // Registration failed - log the error
      console.log("❌ Error: Inserting New User");
      console.error(err);
      
      // Check if username already exists
      if (err.name == "UserExistsError"){
        req.flash('registerMessage', 'Registration Error: User Already Exists!');
      } else {
        // Other error (validation, database, etc.)
        req.flash('registerMessage', 'Registration Error: ' + err.message);
      }
      
      // Re-render registration page with error message
      return res.render('auth/register', 
        { 
          title: 'Register', 
          messages: req.flash('registerMessage'),
          displayName: ''
        });
    } else {
      // Registration successful!
      console.log('✅ New user registered:', user.username);
      
      // Automatically log the user in after successful registration
      return passport.authenticate('local')(req, res, function(){
        res.redirect('/entries');
      });
    }
  });
});

/* ============================================
   LOGOUT
   ============================================ */
router.get('/logout', function(req, res, next){
  // Get username before logging out (for logging purposes)
  let username = req.user ? req.user.username : 'unknown';
  
  // Logout using passport's logout method
  req.logout(function(err){
    if(err){
      console.error('❌ Logout Error:', err);
      return next(err);
    }
    
    // Logout successful
    console.log('✅ User logged out:', username);
    res.redirect('/');
  });
});

module.exports = router;