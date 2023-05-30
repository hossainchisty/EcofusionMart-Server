// Basic Lib Imports
require("dotenv").config();
const nodemailer = require('nodemailer');

// mail service provider's SMTP configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
});


/**
 * 
 * @desc  Function to send the verification email
 * 
 */
const sendVerificationEmail = (email, verificationLink) => {
  const mailOptions = {
    from: 'eCommerce@example.com',
    to: email,
    subject: 'Account Verification',
    text: `Please click the following link to verify your account: ${verificationLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};


module.exports = sendVerificationEmail;