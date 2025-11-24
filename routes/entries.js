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
        entries: entries,
        displayName: req.user ? req.user.displayName : ''
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    });

    //GET route for displaying the Add Entry page - Create Operation
    router.get('/addentry', async (req, res, next) => {
        try {
            res.render('addentry', {
                title: 'Add New Entry',
                displayName: req.user ? req.user.displayName : ''
            });
        } catch (err) {
            console.error(err);
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
            console.error(err);
            next(err);
        }   
    });

    //GET route for displaying the Edit Entry page - Update Operation
    router.get('/edit/:id', async (req, res, next) => {
        try {
            const entryId = req.params.id;
            const entryToEdit = await PetCareEntry.findById(entryId);

            // Format dates for HTML date inputs (YYYY-MM-DD)
            if (entryToEdit.date) {
            entryToEdit.date = entryToEdit.date.toISOString().split('T')[0];
            }
            if (entryToEdit.nextAppointment) {
            entryToEdit.nextAppointment = entryToEdit.nextAppointment.toISOString().split('T')[0];
            }

            res.render('edit', {
                title: 'Edit Entry',
                entry: entryToEdit,
                displayName: req.user ? req.user.displayName : ''
            });
        } catch (err) {
            console.error(err);
            next(err);
        }

    });

    //POST route for processing the Edit Entry form - Update Operation
    router.post('/edit/:id', async (req, res, next) => {
        try {
            let entryId = req.params.id;
            let updatedEntry = PetCareEntry({
                "_id": entryId,
                "petName": req.body.petName,
                "petType": req.body.petType,
                "age": req.body.age,
                "entryType": req.body.entryType,    
                "date": req.body.date,
                "vetName": req.body.vetName,
                "nextAppointment": req.body.nextAppointment,
                "notes": req.body.notes
            })
            PetCareEntry.findByIdAndUpdate(entryId, updatedEntry).then(() => {
                res.redirect('/entries');
            })  
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

    //GET route for deleting an entry - Delete Operation
    router.get('/delete/:id', async (req, res, next) => { 
        try {
            let entryId = req.params.id;
            const entryToDelete = await PetCareEntry.findById(entryId);
        res.render('delete', {
            title: 'Confirm Delete',
            entry: entryToDelete
            })
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

    // POST route for deleting the entry - Delete Operation
    router.post('/delete/:id', async (req, res, next) => {
        try {
            let entryId = req.params.id;
            PetCareEntry.deleteOne({_id: entryId}).then(() => {
                res.redirect('/entries');
            })
        } catch (err) {
            console.error(err);
            next(err);
        }       
    });


    // Export the router so app.js can use it
    module.exports = router;
