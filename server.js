const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

async function ensureAdminUser() {
  const adminEmail = process.env.EMAIL_USER;
  const adminName = 'Admin';
  const defaultPassword = 'admin123';

  let admin = await User.findOne({ email: adminEmail, isAdmin: true });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(defaultPassword, salt);
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hash,
      isAdmin: true,
    });
    console.log('Admin user created');
  }
}
ensureAdminUser();

// Routes
app.get('/', (req, res) => res.send('Construction Website Backend Running'));
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/newsletter', newsletterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static('public/uploads')); // Serve static files from 'uploads' directory

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
