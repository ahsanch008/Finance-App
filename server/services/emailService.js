const nodemailer = require('nodemailer');
const config = require('../config/app');

const transporter = nodemailer.createTransport({
  host: config.emailConfig.host,
  port: config.emailConfig.port,
  auth: {
    user: config.emailConfig.username,
    pass: config.emailConfig.password
  }
});

exports.sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: '"Finance App" <noreply@financeapp.com>',
    to: to,
    subject: "Welcome to Finance App",
    text: `Hello ${name}, welcome to Finance App!`,
    html: `<b>Hello ${name}</b>, welcome to Finance App!`
  });
};

exports.sendPasswordResetEmail = async (to, resetToken) => {
  const resetUrl = `http://yourapp.com/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: '"Finance App" <noreply@financeapp.com>',
    to: to,
    subject: "Password Reset",
    text: `To reset your password, click on this link: ${resetUrl}`,
    html: `<p>To reset your password, click on this link: <a href="${resetUrl}">${resetUrl}</a></p>`
  });
};

exports.sendBudgetAlertEmail = async (to, category, budgetAmount, spentAmount) => {
  await transporter.sendMail({
    from: '"Finance App" <noreply@financeapp.com>',
    to: to,
    subject: "Budget Alert",
    text: `You've exceeded your budget for ${category}. Budget: $${budgetAmount}, Spent: $${spentAmount}`,
    html: `<p>You've exceeded your budget for <b>${category}</b>.</p><p>Budget: $${budgetAmount}</p><p>Spent: $${spentAmount}</p>`
  });
};