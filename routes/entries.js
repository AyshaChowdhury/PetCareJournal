let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// Load the PetCareEntry model
let PetCareEntry = require('../models/entrymodel');

// Import authentication middleware
const { requireAuth } = require('../config/auth');



// Format date as MM/DD/YYYY for display in tables
function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${month}/${day}/${year}`;
}

// Format date as YYYY-MM-DD 
function formatDateForInput(date) {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}


// READ - Display all journal entries (PUBLIC - anyone can view)

router.get('/', async (req, res, next) => {
  try {
    const entries = await PetCareEntry.find().sort({ date: -1 });
    
    // Format dates for display as MM/DD/YYYY
    const formattedEntries = entries.map(entry => {
      return {
        _id: entry._id,
        petName: entry.petName,
        petType: entry.petType,
        age: entry.age,
        entryType: entry.entryType,
        date: formatDate(entry.date),
        vetName: entry.vetName,
        nextAppointment: formatDate(entry.nextAppointment),
        notes: entry.notes
      };
    });
    
    res.render('entries', {
      title: 'Journal Entries',
      entries: formattedEntries,
      isAuthenticated: req.isAuthenticated() // Pass authentication status to view
    });
  } catch (err) {
    console.error('Error fetching entries:', err);
    next(err);
  }
});



// CREATE - Display Add Entry Form (PROTECTED)

router.get('/addentry', requireAuth, async (req, res, next) => {
  try {
    res.render('addentry', {
      title: 'Add New Entry'
    });
  } catch (err) {
    console.error('Error rendering add entry form:', err);
    next(err);
  }
});



// CREATE - Process Add Entry Form (PROTECTED)

router.post('/addentry', requireAuth, async (req, res, next) => {
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

    await PetCareEntry.create(newEntry);
    res.redirect('/entries');
  } catch (err) {
    console.error('Error creating entry:', err);
    next(err);
  }   
});




// UPDATE - Display Edit Entry Form (PROTECTED)

router.get('/edit/:id', requireAuth, async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const entryToEdit = await PetCareEntry.findById(entryId);
    
    if (!entryToEdit) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Entry not found'
      });
    }

    // Format dates (YYYY-MM-DD)
    const formattedEntry = {
      _id: entryToEdit._id,
      petName: entryToEdit.petName,
      petType: entryToEdit.petType,
      age: entryToEdit.age,
      entryType: entryToEdit.entryType,
      date: formatDateForInput(entryToEdit.date),
      vetName: entryToEdit.vetName,
      nextAppointment: formatDateForInput(entryToEdit.nextAppointment),
      notes: entryToEdit.notes
    };

    res.render('edit', {
      title: 'Edit Entry',
      entry: formattedEntry
    });
  } catch (err) {
    console.error('Error fetching entry for edit:', err);
    next(err);
  }
});



// UPDATE - Process Edit Entry Form (PROTECTED)

router.post('/edit/:id', requireAuth, async (req, res, next) => {
  try {
    let entryId = req.params.id;
    
    let updatedEntry = {
      "petName": req.body.petName,
      "petType": req.body.petType,
      "age": req.body.age,
      "entryType": req.body.entryType,    
      "date": req.body.date,
      "vetName": req.body.vetName,
      "nextAppointment": req.body.nextAppointment,
      "notes": req.body.notes
    };
    
    await PetCareEntry.findByIdAndUpdate(entryId, updatedEntry);
    res.redirect('/entries');
  } catch (err) {
    console.error('Error updating entry:', err);
    next(err);
  }
});



// DELETE - Display Delete Confirmation (PROTECTED)

router.get('/delete/:id', requireAuth, async (req, res, next) => { 
  try {
    let entryId = req.params.id;
    const entryToDelete = await PetCareEntry.findById(entryId);
    
    if (!entryToDelete) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Entry not found'
      });
    }
    
    // Format dates MM/DD/YYYY
    const formattedEntry = {
      _id: entryToDelete._id,
      petName: entryToDelete.petName,
      petType: entryToDelete.petType,
      age: entryToDelete.age,
      entryType: entryToDelete.entryType,
      date: formatDate(entryToDelete.date),
      vetName: entryToDelete.vetName,
      nextAppointment: formatDate(entryToDelete.nextAppointment),
      notes: entryToDelete.notes
    };
    
    res.render('delete', {
      title: 'Confirm Delete',
      entry: formattedEntry
    });
  } catch (err) {
    console.error('Error fetching entry for deletion:', err);
    next(err);
  }
});


// DELETE - Process Delete Confirmation (PROTECTED)

router.post('/delete/:id', requireAuth, async (req, res, next) => {
  try {
    let entryId = req.params.id;
    await PetCareEntry.deleteOne({_id: entryId});
    res.redirect('/entries');
  } catch (err) {
    console.error('Error deleting entry:', err);
    next(err);
  }       
});

module.exports = router;