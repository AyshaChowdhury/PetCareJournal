    let express = require('express');
    let router = express.Router();
    let mongoose = require('mongoose');

    // Load the PetCareEntry model (models/entrymodel.js)
    let PetCareEntry = require('../models/entrymodel');
    
    // GET route for displaying all journal entries - Read Operation
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

    //GET route for displaying the Add Entry page - Create Operation
    router.get('/addentry', async (req, res, next) => {
        try {
            res.render('addentry', {
                title: 'Add New Entry'
            });
        } catch (err) {
            next(err);
        }
    });

    //POST route for processing the Add Entry form - Create Operation
    router.post('/addentry', async (req, res, next) => {
        try {
            let newEntry = new PetCareEntry({
                "petName": req.body.petName,
                "petType": req.body.petType,
                "age": req.body.age,
                "entryType": req.body.entryType,
                "date": req.body.date,
                "vetName": req.body.vetName,
                "nextAppointment": req.body.nextAppointment,
                "notes": req.body.notes
            });

            PetCareEntry.create(newEntry).then(() => {
                res.redirect('/entries');
            })
        } catch (err) {
            next(err);
        }   
    });

    //GET route for displaying the Edit Entry page - Update Operation
    router.get('/edit/:id', async (req, res, next) => {

    });

    //POST route for processing the Edit Entry form - Update Operation
    router.post('/edit/:id', async (req, res, next) => {

    });

    //GET route for deleting an entry - Delete Operation
    router.get('/delete/:id', async (req, res, next) => {   

    });

    // Export the router so app.js can use it
    module.exports = router;
