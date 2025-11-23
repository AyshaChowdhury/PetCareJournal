
let mongoose = require("mongoose");

// 1) Create a model class
let petCareEntryModel = mongoose.Schema(
  {
    petName: String,          // Name of the pet (e.g., Luna)
    petType: String,          // Type of pet (Dog, Cat, Bird, etc.)
    age: String,              // Age (we keep as String for flexibility "3 years")
    entryType: String,        // Vet Visit, Grooming, Medication, Vaccination, Other
    date: Date,               // Date of the care event
    vetName: String,          // Optional veterinarian name
    nextAppointment: Date,    // Optional next appointment date
    notes: String             // Additional notes/comments
  },
  {
    // 2) Set the collection name
    collection: "PetCareEntries"
  }
);

// 3) Export the model
// makes the Entry class available to other modules
module.exports = mongoose.model("PetCareEntry", petCareEntryModel); //("ModelName", modelSchema)
