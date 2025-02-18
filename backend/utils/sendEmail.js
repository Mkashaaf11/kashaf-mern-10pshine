const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const sendEmail = async (to, subject, text) => {
  logger.info(process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Failed to send email", { error: error.message, to, subject });
    throw new Error("Email could not be sent. Please try again later.");
  }
};

module.exports = sendEmail;
