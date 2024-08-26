const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

// Use the sequelize instance from the config file
const sequelize = config;

// Import models
const User = require('./User');
const Transaction = require('./Transaction');
const Investment = require('./Investment');
const SavingsGoal = require('./SavingGoal');
const Budget = require('./Budget');
const Card = require('./Card');

// Define associations
User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(Investment);
Investment.belongsTo(User);

User.hasMany(SavingsGoal);
SavingsGoal.belongsTo(User);

User.hasMany(Budget);
Budget.belongsTo(User);

User.hasMany(Card);
Card.belongsTo(User);

module.exports = {
  sequelize,
  Sequelize,
  User,
  Transaction,
  Investment,
  SavingsGoal,
  Budget,
  Card,
};