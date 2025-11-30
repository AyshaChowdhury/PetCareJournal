const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/usermodel').User;


// Determine the base URL (production vs development)
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// GOOGLE OAUTH STRATEGY

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/google/callback`,
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in database
      let existingUser = await User.findOne({ providerId: profile.id, provider: 'google' });
      
      if (existingUser) {
        // User exists - log them in
        return done(null, existingUser);
      }
      
      // User doesn't exist - create new user
      const newUser = new User({
        providerId: profile.id,
        provider: 'google',
        username: profile.emails[0].value, // Use email as username
        email: profile.emails[0].value,
        displayName: profile.displayName,
        photo: profile.photos[0]?.value || ''
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }
));


// GITHUB OAUTH STRATEGY

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/github/callback`,
    proxy: true,
    scope: ['user:email'] // Request email from GitHub
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in database
      let existingUser = await User.findOne({ providerId: profile.id, provider: 'github' });
      
      if (existingUser) {
        // User exists - log them in
        return done(null, existingUser);
      }
      
      // Get email from profile (GitHub might not provide it directly)
      const email = profile.emails && profile.emails[0] 
        ? profile.emails[0].value 
        : `${profile.username}@github.com`;
      
      // User doesn't exist - create new user
      const newUser = new User({
        providerId: profile.id,
        provider: 'github',
        username: profile.username,
        email: email,
        displayName: profile.displayName || profile.username,
        photo: profile.photos[0]?.value || ''
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;