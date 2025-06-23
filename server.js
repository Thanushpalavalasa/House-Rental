// =================================================================
//                      IMPORTS
// =================================================================
const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Node.js module for working with file paths

// Import your custom modules
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const houseRoutes = require('./routes/houseRoutes');


// =================================================================
//                      INITIAL CONFIGURATION
// =================================================================
// Load environment variables from your .env file
dotenv.config();

// Initialize the Express application
const app = express();


// =================================================================
//                      DATABASE CONNECTION
// =================================================================
// Connect to MongoDB
connectDB();


// =================================================================
//                      MIDDLEWARE
// =================================================================
// Body Parser Middleware: Allows the server to accept and parse JSON data from request bodies
app.use(express.json());
// Body Parser for URL-encoded data (like from HTML forms)
app.use(express.urlencoded({ extended: true }));


// --- THE CRUCIAL FIX IS HERE ---
// Static Folder Middleware: This is the most important part for your issue.
// It tells Express that if it receives a request that doesn't match an API route,
// it should look inside the 'public' folder for a matching file.
// This is how the browser can find /css/style.css, /js/tenant.js, and your images.
// This line MUST come BEFORE your API routes.
app.use(express.static(path.join(__dirname, 'public')));


// =================================================================
//                      API ROUTES
// =================================================================
// Mount your routers. Any request starting with '/api/auth' will be handled
// by your authRoutes file, and so on.
app.use('/api/auth', authRoutes);
app.use('/api/houses', houseRoutes);


// =================================================================
//                      SERVER STARTUP
// =================================================================
// Get the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming connections
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});