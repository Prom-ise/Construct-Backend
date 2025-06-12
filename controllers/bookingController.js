const Booking = require('../models/Booking');
const { handleBooking, sendProjectCompletionEmail } = require('../utils/sendEmail');

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

exports.markBookingCompleted = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Send completion email to client
    await sendProjectCompletionEmail({
      name: booking.clientName,
      email: booking.email,
      projectType: booking.projectType
    });

    res.status(200).json({ message: 'Booking marked as completed and email sent!', booking });
  } catch (err) {
    console.error('Error marking booking as completed:', err);
    res.status(500).json({ error: err.message || 'Server error' });
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
