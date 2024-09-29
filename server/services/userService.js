const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../utils/security');

exports.createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({ ...userData, password: hashedPassword });
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

exports.generatePasswordResetToken = async (userId) => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  const user = await User.findByPk(userId);
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  return resetToken;
};

exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: Date.now() }
    }
  });
  if (!user) {
    throw new Error('Password reset token is invalid or has expired');
  }
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
};

exports.updateUser = async (userId, userData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  Object.assign(user, userData);
  await user.save();
  return user;
};