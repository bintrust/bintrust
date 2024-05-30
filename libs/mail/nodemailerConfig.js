const nodemailerConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
};

module.exports = nodemailerConfig;
