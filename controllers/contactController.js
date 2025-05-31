const nodemailer = require('nodemailer');

const sendContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message || !phone) {
    return res.status(400).json({ error: 'All fields are required including phone number.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.TO_EMAIL,
      subject: `Contact Form: ${subject}`,
      text: `You received a message from:\n
Name: ${name}
Email: ${email}
Phone: ${phone}

Subject: ${subject}
Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ error: 'Something went wrong. Try again later.' });
  }
};

module.exports = { sendContactForm };