const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  projectType: { type: String, required: true },
  service: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  date: { type: Date, required: true },
  message: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
