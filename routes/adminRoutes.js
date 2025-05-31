const express = require('express');
const Contact = require('../models/Contact');
const Booking = require('../models/Booking');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// 📨 Get all contact messages
router.get('/contacts', authenticateUser, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch contacts', error: err.message });
  }
});

// 📆 Get all bookings
router.get('/bookings', authenticateUser, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch bookings', error: err.message });
  }
});

// 📊 Get summary stats
router.get('/stats/summary', authenticateUser, isAdmin, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const completed = await Booking.countDocuments({ status: 'completed' });
    const pending = await Booking.countDocuments({ status: 'pending' });

    res.json({ total, completed, pending });
  } catch (err) {
    res.status(500).json({ message: "Failed to get summary stats", error: err.message });
  }
});
router.get('/stats/monthly', authenticateUser, isAdmin, async (req, res) => {
  try {
    // Group bookings by month and count
    const monthly = await Booking.aggregate([
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // "YYYY-MM"
          bookings: { $sum: 1 }
        }
      },
      {
        $project: {
          month: "$_id",
          bookings: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);
    res.json(monthly);
  } catch (err) {
    res.status(500).json({ message: "Failed to get monthly stats", error: err.message });
  }
});
module.exports = router;
