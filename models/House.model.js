// models/House.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const HouseSchema = new Schema({
  // ... other fields like owner, address, etc. ...
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
  },
  rentAmount: {
    type: Number,
    required: [true, 'Rent amount is required'],
  },

  // ===============================================
  //     UPDATED PHONE NUMBER FIELD FOR INDIA
  // ===============================================
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        // This regex validates a 10-digit Indian mobile number.
        // It can optionally start with +91, +91<space>, or 0.
        // The 10-digit number itself must start with a 6, 7, 8, or 9.
        return /^(?:\+91 ?|0)?[6-9][0-9]{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian mobile number!`
    },
    required: [true, 'A contact phone number is required'],
    trim: true,
  },
  // ===============================================

  description: {
    type: String,
    required: false,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('House', HouseSchema);