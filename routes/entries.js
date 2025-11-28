    let express = require('express');
    let router = express.Router();
    let mongoose = require('mongoose');

    // Load the PetCareEntry model (models/entrymodel.js)
    let PetCareEntry = require('../models/entrymodel');

    // Import authentication middleware
    // This will protect routes so only logged-in users can access them
    const { requireAuth } = require('../config/auth');
    

    // READ - Display all journal entries
    // GET route for displaying all journal entries - Read Operation
    router.get('/', requireAuth, async (req, res, next) => {
    try {
        // Fetch all entries from database, sorted by date (newest first)
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


    // CREATE - Display Add Entry Form
    //GET route for displaying the Add Entry page - Create Operation
    router.get('/addentry',requireAuth, async (req, res, next) => {
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

    // CREATE - Process Add Entry Form
    //POST route for processing the Add Entry form - Create Operation
    router.post('/addentry', requireAuth, async (req, res, next) => {
        try {
            // Create new entry object from form data
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
                res.redirect('/entries'); // Redirect to entries list after successful creation
            })
        } catch (err) {
            console.error(err);
            next(err);
        }   
    });


    // UPDATE - Display Edit Entry Form
    //GET route for displaying the Edit Entry page - Update Operation
    router.get('/edit/:id',requireAuth, async (req, res, next) => {
        try {
            const entryId = req.params.id;
            // Find the entry by ID
            const entryToEdit = await PetCareEntry.findById(entryId);

            if (!entryToEdit) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Entry not found'
                });
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


    // UPDATE - Process Edit Entry Form
    //POST route for processing the Edit Entry form - Update Operation
    router.post('/edit/:id',requireAuth, async (req, res, next) => {
        try {
            // Create updated entry object
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
            // Update the entry in database
            PetCareEntry.findByIdAndUpdate(entryId, updatedEntry).then(() => {
                res.redirect('/entries');
            })  
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

    // DELETE - Display Delete Confirmation
    //GET route for deleting an entry - Delete Operation
    router.get('/delete/:id',requireAuth, async (req, res, next) => { 
        try {
            let entryId = req.params.id;
            // Find the entry to delete
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

    // DELETE - Process Delete Confirmation
    // POST route for deleting the entry - Delete Operation
    router.post('/delete/:id',requireAuth, async (req, res, next) => {
        try {
            let entryId = req.params.id;
            // Delete the entry from database
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
