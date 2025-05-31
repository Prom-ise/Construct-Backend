const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const ADMIN_EMAIL = process.env.EMAIL_USER;

let resetCode;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL)
      return res.status(403).json({ message: 'Not authorized' });

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin)
      return res.status(403).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: admin.name, email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendResetCode = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ADMIN_EMAIL,
      subject: 'Admin Password Reset Code',
      text: `Your reset code is: ${resetCode}`,
    });

    res.json({ message: 'Reset code sent to email' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { code, newPassword } = req.body;

    if (code !== resetCode)
      return res.status(400).json({ message: 'Invalid reset code' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { email: ADMIN_EMAIL, isAdmin: true },
      { password: hash }
    );

    resetCode = null;

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  login,
  sendResetCode,
  resetPassword,
};