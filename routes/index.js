var express = require('express');
var router = express.Router();

// Import the PetCareEntry Mongoose model
// This points to models/entry.js where we defined the schema and model
let PetCareEntry = require('../models/entrymodel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PetCare Journal' });
});

router.get('/home', function (req, res, next) {
  res.redirect('/');
});


module.exports = router;
