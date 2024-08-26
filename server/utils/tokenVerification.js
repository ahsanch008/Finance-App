const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.verifyToken = async (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
};