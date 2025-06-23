const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access JWT_SECRET from your .env file
const User = require('../models/User.model');

// =================================================================
// 1. "protect" Middleware: Checks if the user is logged in
// =================================================================
// This function will be run before any protected route controller.
const protect = async (req, res, next) => {
  let token;

  // Check if the request headers contain an 'authorization' field
  // and if it starts with 'Bearer '
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token from the header by splitting the string "Bearer <token>"
      // and taking the second part (the token itself).
      token = req.headers.authorization.split(' ')[1];

      // Verify the token is valid and not expired.
      // It uses the JWT_SECRET from your .env file to decode it.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // If the token is valid, 'decoded' will contain the payload we set
      // during login (which includes the user's id).
      // We then find that user in the database and attach them to the request object.
      // We use .select('-password') to exclude the user's hashed password for security.
      req.user = await User.findById(decoded.user.id).select('-password');

      // If we successfully find the user, we call next() to move on
      // to the next piece of middleware or the actual route controller.
      next();

    } catch (error) {
      console.error('Token verification failed:', error);
      // If the token is invalid (e.g., tampered with, expired), an error will be thrown.
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  // If there's no token in the header at all...
  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};


// =================================================================
// 2. "isOwner" Middleware: Checks if the user has the 'owner' role
// =================================================================
// This middleware should ONLY be used AFTER the 'protect' middleware has run.
const isOwner = (req, res, next) => {
  // By this point, 'protect' should have already attached the user object to req.user.
  if (req.user && req.user.role === 'owner') {
    // If the user exists and their role is 'owner', they are authorized.
    next();
  } else {
    // 403 Forbidden is the appropriate status code for a user who is logged in
    // but doesn't have the necessary permissions for the specific action.
    res.status(403).json({ msg: 'Access denied. You must be an owner to perform this action.' });
  }
};


// Export the functions so they can be imported and used in our route files.
module.exports = { protect, isOwner };