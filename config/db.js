// config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // To access environment variables from .env file

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB Atlas cluster
    await mongoose.connect(process.env.MONGO_URI, {
      // These options are recommended by MongoDB to avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected Successfully...');

  } catch (err) {
    // If the connection fails, log the error and exit the application
    console.error('MongoDB Connection Failed:', err.message);
    // Exit process with failure code
    process.exit(1);
  }
};

// Export the function so it can be used in other files (like server.js)
module.exports = connectDB;