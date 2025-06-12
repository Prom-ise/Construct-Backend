const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { createBooking, getBookings, markBookingCompleted } = require('../controllers/bookingController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware.js');

// ✅ Create a new booking (public)
router.post('/', createBooking);

// ✅ Get all bookings (admin only)
router.get('/', authenticateUser, isAdmin, getBookings);

// ✅ Mark a booking as completed
router.patch('/:id/complete', authenticateUser, isAdmin, markBookingCompleted);

// ✅ Delete a booking
router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Booking not found' });

    res.status(200).json({ msg: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete booking', error: err.message });
  }
});

module.exports = router;
