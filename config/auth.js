// Authentication Middleware
// This file contains helper functions to check if a user is logged in

/**
 * requireAuth - Middleware to check if user is authenticated
 * Use this on routes that require login (like /entries/addentry)
 * 
 * How it works:
 * - If user is logged in (req.isAuthenticated()), allow them to continue
 * - If user is NOT logged in, redirect them to /login
 * 
 * Usage in routes:
 * router.get('/addentry', requireAuth, function(req, res) { ... });
 */
module.exports.requireAuth = function(req, res, next) {
  // Check if user is authenticated using Passport's isAuthenticated() method
  if (!req.isAuthenticated()) {
    // User is NOT logged in - redirect to login page
    req.flash('loginMessage', 'Please log in to access this page');
    return res.redirect('/login');
  }
  // User IS logged in - proceed to the route handler
  next();
};

/**
 * isLoggedIn - Simple check to see if user is authenticated
 * Returns true/false instead of redirecting
 * Useful for conditional rendering in views
 */
module.exports.isLoggedIn = function(req) {
  return req.isAuthenticated();
};