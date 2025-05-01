const mongoose = require('mongoose');

let riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  vehicle_type: {
    type: String,
    required: true
  },
  vehicle_number: {
    type: String,
    required: true
  },
  account_holder_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  iban: {
    type: String,
    required: true
  },
  bank_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  retypePassword: {
    type: String,
    required: true
  },
  ratings: {
    type: String,
  },
  availability: {
    type: String,
  },
  completed_orders: {
    type: Number,
  },
  joining_date: {
    type: Date,
  },
  address: {
    text: { type: String, required: true },  // Store address as text
    latitude: { type: Number, required: true }, // Store initial latitude
    longitude: { type: Number, required: true } // Store initial longitude
  },
  // Add live location fields
  live_location: {
    latitude: { type: Number, required: true }, // Store live latitude
    longitude: { type: Number, required: true }, // Store live longitude
    last_updated: { type: Date, default: Date.now } // Timestamp for when location was last updated
  }
});

let riderModel = mongoose.model('rider', riderSchema);

module.exports = riderModel;
