let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

// Define the User Schema
// IMPORTANT: Do NOT include a password field here!
// passport-local-mongoose plugin automatically adds password handling with proper hashing
let User = mongoose.Schema({
    // Username - will be used for login
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'Username is required'
    },
    
    // Email address
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'Email address is required'
    },
    
    // Display name - shown in the navbar when logged in
    displayName: {
        type: String,
        default: '',
        trim: true,
        required: 'Display Name is required'
    },
    
    // Timestamp when user was created
    created: {
        type: Date,
        default: Date.now
    },
    
    // Timestamp when user was last updated
    updated: {
        type: Date,
        default: Date.now
    }
}, 
{
    // Specify the collection name in MongoDB
    collection: "users"
});

// Configure passport-local-mongoose options
let options = {
    missingPasswordError: 'Wrong / Missing Password',
    usernameLowerCase: true,  // Store usernames in lowercase for case-insensitive login
    limitAttempts: true,      // Limit login attempts to prevent brute force attacks
    maxAttempts: 5,           // Maximum number of login attempts before locking
    errorMessages: {
        MissingPasswordError: 'No password was given',
        IncorrectPasswordError: 'Password is incorrect',
        IncorrectUsernameError: 'Username does not exist',
        UserExistsError: 'A user with the given username is already registered'
    }
};

// Apply the passport-local-mongoose plugin to the User schema
// This plugin automatically adds:
// - password field (hashed with salt)
// - salt field
// - hash field
// - authenticate() method
// - serializeUser() method
// - deserializeUser() method
// - register() method
// - findByUsername() method
User.plugin(passportLocalMongoose, options);

// Export the User model
// Note: We export as { User: model } so we can destructure when importing
module.exports.User = mongoose.model('User', User);