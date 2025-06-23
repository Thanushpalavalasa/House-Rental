const mongoose = require('mongoose');

// A Mongoose Schema defines the structure of the document,
// default values, validators, etc.
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'], // The field is mandatory
    unique: true, // No two users can have the same email
    lowercase: true, // Automatically converts email to lowercase
    trim: true, // Removes whitespace from both ends
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    // Note: We will hash this password in the controller before saving it.
    // We never store plain text passwords!
  },

  role: {
    type: String,
    // 'enum' means the value for 'role' MUST be one of the strings in the array.
    // This prevents bad data, like a role of "admin" or "guest".
    enum: ['owner', 'tenant'],
    required: [true, 'User role is required'],
  },

  createdAt: {
    type: Date,
    // 'default' sets a value if one is not provided.
    // Date.now will set the timestamp to the moment the user is created.
    default: Date.now,
  },
});

// A Mongoose Model provides an interface to the database for creating,
// querying, updating, deleting records, etc.
//
// The first argument 'User' is the singular name of the model.
// Mongoose will automatically look for the plural, lowercased version
// of your model name in the database (so, the 'users' collection).
module.exports = mongoose.model('User', UserSchema);