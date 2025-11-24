# PetCare Journal

A web application for pet owners to track important pet care information including vet visits, grooming appointments, vaccinations, medications, and general care notes.

## Author
**Aysha Chowdhury**  
Course: INFR3120 - Assignment 3  
Date: November 21, 2025

## Live Demo
🔗 [https://petcare-journal.onrender.com](https://petcare-journal.onrender.com)

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** Passport.js with passport-local-mongoose
- **Template Engine:** EJS
- **CSS Framework:** Bootstrap 5
- **Cloud Deployment:** Render
- **Version Control:** Git & GitHub

## Database Schema

### PetCareEntry Collection
```javascript
{
  petName: String,          // Name of the pet
  petType: String,          // Type of pet (Dog, Cat, etc.)
  age: String,              // Age of the pet
  entryType: String,        // Type of care event
  date: Date,               // Date of the care event
  vetName: String,          // Veterinarian name (optional)
  nextAppointment: Date,    // Next appointment (optional)
  notes: String             // Additional notes
}
```

### User Collection
```javascript
{
  username: String,         // Unique username
  password: String,         // Hashed password
  email: String,            // User email
  displayName: String,      // Display name
  created: Date            // Account creation date
}
```

## CSS Customization
Custom CSS styles are located in `/public/Content/app.css`. The application uses Bootstrap 5 as a base framework with custom modifications to differentiate it from the in-class example.



## Contact
For questions or issues, please contact through the course portal.
