# Andaman Treek Holidays - Dynamic Website Setup

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
Make sure your MongoDB connection string is correct in `.env` file

### 3. Create First Admin User
```bash
node create-admin.js
```

### 4. Start Server
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

Server will run on: http://localhost:5000

### 5. Access Admin Panel
Open browser and go to: http://localhost:5000/admin.html

**Default Admin Credentials:**
- Username: admin
- Password: admin123

**IMPORTANT:** Change password after first login!

### 6. Open Website
Main website: http://localhost:5000/index.html

## Features

### Admin Panel
- Dashboard with statistics
- Manage All Packages (Add/Edit/Delete)
- Manage Honeymoon Packages (Category-wise view)
- Manage Family Packages (Category-wise view)
- Manage Group Packages (Category-wise view)
- Manage LTC Packages (Category-wise view)
- Manage Activities (Add/Edit/Delete)
- Manage Testimonials (Add/Edit/Delete)
- View Bookings
- View Contact Form Submissions

### Frontend
- Dynamic packages from database
- Dynamic testimonials from database
- Contact form saves to database
- Booking form saves to database

## API Endpoints

### Public APIs
- GET /api/packages - Get all active packages
- GET /api/activities - Get all active activities
- GET /api/testimonials - Get all active testimonials
- POST /api/contact - Submit contact form
- POST /api/bookings - Submit booking

### Admin APIs (Requires Authentication)
- POST /api/admin/login - Admin login
- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/packages - Get all packages
- POST /api/admin/packages - Create package
- PUT /api/admin/packages/:id - Update package
- DELETE /api/admin/packages/:id - Delete package
- Similar routes for activities, testimonials, bookings, contacts

## File Structure
```
AndamanTreekHolidays/
├── server.js              # Express server
├── models.js              # MongoDB models
├── admin.html             # Admin panel
├── admin-style.css        # Admin panel styles
├── admin-script.js        # Admin panel JavaScript
├── api-integration.js     # Frontend API integration
├── index.html             # Main website
├── script.js              # Main website JavaScript
├── package.json           # Dependencies
├── .env                   # Environment variables
└── create-admin.js        # Admin creation script
```

## Notes
- All images should be in `images/` folder
- MongoDB URI is already configured in `.env`
- JWT token is used for admin authentication
- CORS is enabled for all origins
