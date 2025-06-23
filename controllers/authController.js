// controllers/authController.js

const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signupUser = async (req, res) => {
  // Get email, password, and role from the request body
  const { email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 2. Create a new user instance
    user = new User({
      email,
      password,
      role,
    });

    // 3. Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
    user.password = await bcrypt.hash(password, salt); // Hash the password

    // 4. Save the user to the database
    await user.save();

    // 5. Create and return a JSON Web Token (JWT) so the user is logged in right away
    const payload = {
      user: {
        id: user.id, // The user's unique ID from the database
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from the .env file
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Send the token back to the client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Login an existing user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' }); // Use a generic message for security
    }

    // 3. If credentials are correct, create and return a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};