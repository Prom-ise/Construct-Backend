const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g., constructhq@gmail.com
    pass: process.env.EMAIL_PASS  // app password
  }
});

const sendResetCode = async (to, code) => {
  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Code for Admin Panel',
    html: `<h3>Your reset code is:</h3><p style="font-size: 20px;">${code}</p>`,
  });
};

const sendAdminEmail = async (booking) => {
  const { name, email, phone, projectType, message } = booking;

  return transporter.sendMail({
    from: `"Construct HQ" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // admin email
    subject: 'New Project Booking Submitted',
    html: `
      <h3>New Booking Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Project Type:</strong> ${projectType}</p>
      <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
    `,
  });
};

const sendUserConfirmationEmail = async (booking) => {
  const { name, email, projectType } = booking;

  return transporter.sendMail({
    from: `"Construct HQ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Booking Confirmation – Construct HQ',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for booking a <strong>${projectType}</strong> project with us!</p>
      <p>We’ve received your request and will get in touch shortly.</p>
      <p>– The Construct HQ Team</p>
    `,
  });
};

const handleBooking = async (newBooking) => {
  try {
    await newBooking.save();
    await sendAdminEmail(newBooking);
    await sendUserConfirmationEmail(newBooking);
  } catch (error) {
    console.error('Error in handleBooking:', error);
    throw error;
  }
};

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `"Construct Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendResetCode,
  sendAdminEmail,
  sendUserConfirmationEmail,
  handleBooking,
  sendEmail,
};
