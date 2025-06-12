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
  const { clientName, email, phone, projectType, message } = booking;

  return transporter.sendMail({
    from: `"Construct HQ" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // admin email
    subject: 'New Project Booking Submitted',
    html: `
      <h3>New Booking Received</h3>
      <p><strong>Name:</strong> ${clientName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Project Type:</strong> ${projectType}</p>
      <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
    `,
  });
};

const sendUserConfirmationEmail = async (booking) => {
  const { clientName, email, projectType } = booking;

  return transporter.sendMail({
    from: `"Construct HQ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Booking Confirmation – Construct HQ',
    html: `
      <p>Hi ${clientName},</p>
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

const sendProjectCompletionEmail = async ({ clientName, email, projectType }) => {
  return transporter.sendMail({
    from: `"Construct HQ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Project Completed – Thank You for Choosing Construct HQ!',
    html: `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #eee; padding: 32px;">
          <h2 style="color: #fe5d14; text-align: center;">Congratulations, ${clientName}!</h2>
          <p style="font-size: 16px; color: #333;">
            We are excited to let you know that your <strong>${projectType}</strong> project has been <span style="color: #28a745; font-weight: bold;">successfully completed</span>!
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for trusting Construct HQ with your vision. We hope the results exceed your expectations and bring you lasting comfort and satisfaction.
          </p>
          <p style="font-size: 16px; color: #333;">
            If you have any feedback or need further assistance, our team is always here for you.
          </p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="https://construction-website-beryl-one.vercel.app/services" style="background: #fe5d14; color: #fff; padding: 12px 28px; border-radius: 5px; text-decoration: none; font-weight: bold;">See More Projects</a>
          </div>
          <p style="font-size: 15px; color: #888; text-align: center;">
            We look forward to working with you again.<br>
            <strong>– The Construct HQ Team</strong>
          </p>
        </div>
      </div>
    `,
  });
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
  sendProjectCompletionEmail,
};
