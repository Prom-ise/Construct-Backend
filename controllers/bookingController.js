const Booking = require('../models/Booking');
const { handleBooking } = require('../utils/sendEmail');

// 📝 Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { clientName, email, phone, projectType, message, date, service } = req.body;

    if (!clientName || !email || !phone || !projectType || !date || !service) {
      return res.status(400).json({ error: 'All fields including date and service are required' });
    }

    const newBooking = new Booking({
      clientName,
      email,
      phone,
      projectType,
      message,
      date,
      service,
      status: 'pending'
    });

    await handleBooking(newBooking); // Saves to DB and sends emails

    res.status(201).json({ message: 'Booking submitted successfully!' });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(400).json({ error: err.message || 'Something went wrong' });
  }
};

// 📥 Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};
