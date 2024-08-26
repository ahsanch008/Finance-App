const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.generateRandomToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};