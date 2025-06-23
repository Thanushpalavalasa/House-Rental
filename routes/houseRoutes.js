const express = require('express');
const router = express.Router();

// Import controller functions
const { 
    createHouseListing, 
    searchHouses 
} = require('../controllers/houseController');

// Import middleware
const { protect, isOwner } = require('../middleware/authMiddleware');

// @route   POST /api/houses/add
// @desc    Create a new house listing
// @access  Private (Requires a valid token and the user to be an 'owner')
// The request will first go through 'protect', then 'isOwner', and only then 'createHouseListing'
router.post('/add', protect, isOwner, createHouseListing);


// @route   GET /api/houses/search
// @desc    Search for available houses
// @access  Public
router.get('/search', searchHouses);


module.exports = router;