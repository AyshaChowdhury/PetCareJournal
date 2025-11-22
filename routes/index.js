var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PetCare Journal' });
});

router.get('/home', function (req, res, next) {
  res.redirect('/');
});

/*
  GET /entries
  - Journal entries list page.
  - temporrary sample data for development
*/

router.get('/entries', function (req, res) {
  // temporary sample data that matches the project plan fields
  const entries = [
    {
      _id: 1,
      date: '2025-03-10',
      petName: 'Luna',
      category: 'Vet Visit',
      summary: 'Annual check-up and vaccines'
    },
    {
      _id: 2,
      date: '2025-03-14',
      petName: 'Milo',
      category: 'Grooming',
      summary: 'Full grooming + nails trimmed'
    },
    {
      _id: 3,
      date: '2025-03-20',
      petName: 'Bella',
      category: 'Medication',
      summary: 'Started flea prevention treatment'
    }
  ];

  res.render('entries', {
    title: 'Journal Entries',
    entries: entries
  });
});

module.exports = router;
