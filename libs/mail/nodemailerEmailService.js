const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (option) => {
  const { to, subject, text, html } = option;

  try {
    const info = await transporter.sendMail({
      from: process.env.email || "",
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports = { sendEmail };
