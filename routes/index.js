var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PetCare Journal' });
});

router.get('/home', function (req, res, next) {
  res.redirect('/');
});

module.exports = router;
