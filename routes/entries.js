    let express = require('express');
    let router = express.Router();
    let mongoose = require('mongoose');

    // Load the PetCareEntry model (models/entrymodel.js)
    let PetCareEntry = require('../models/entrymodel');

    // Read all pet care journal entries
    router.get('/', async (req, res, next) => {
    try {
        const entries = await PetCareEntry.find().sort({ date: -1 });
        res.render('entries', {
        title: 'Journal Entries',
        entries: entries
        });
    } catch (err) {
        next(err);
    }
    });

    // Export the router so app.js can use it
    module.exports = router;
