const { Investment } = require('../models');
const { Op } = require('sequelize');

exports.createInvestment = async (investmentData) => {
  return await Investment.create(investmentData);
};

exports.getInvestments = async (userId, startDate, endDate, type) => {
  const where = { UserId: userId };
  if (startDate && endDate) {
    where.date = { [Op.between]: [startDate, endDate] };
  }
  if (type) {
    where.type = type;
  }
  return await Investment.findAll({ where, order: [['date', 'DESC']] });
};

exports.updateInvestment = async (id, userId, updateData) => {
  const investment = await Investment.findOne({ where: { id, UserId: userId } });
  if (!investment) {
    throw new Error('Investment not found');
  }
  Object.assign(investment, updateData);
  await investment.save();
  return investment;
};

exports.deleteInvestment = async (id, userId) => {
  const investment = await Investment.findOne({ where: { id, UserId: userId } });
  if (!investment) {
    throw new Error('Investment not found');
  }
  await investment.destroy();
};

exports.calculateInvestmentReturns = async (userId) => {
  const investments = await Investment.findAll({ where: { UserId: userId } });
  // This is a simplified calculation. In a real-world scenario, you'd need more complex logic
  return investments.reduce((total, inv) => total + (inv.currentValue - inv.initialValue), 0);
};