const { Budget, Transaction } = require('../models');
const { Op } = require('sequelize');

exports.createBudget = async (budgetData) => {
  return await Budget.create(budgetData);
};

exports.getBudgets = async (userId) => {
  return await Budget.findAll({ where: { UserId: userId } });
};

exports.updateBudget = async (id, userId, updateData) => {
  const budget = await Budget.findOne({ where: { id, UserId: userId } });
  if (!budget) {
    throw new Error('Budget not found');
  }
  Object.assign(budget, updateData);
  await budget.save();
  return budget;
};

exports.deleteBudget = async (id, userId) => {
  const budget = await Budget.findOne({ where: { id, UserId: userId } });
  if (!budget) {
    throw new Error('Budget not found');
  }
  await budget.destroy();
};

exports.checkBudgetStatus = async (userId, category) => {
  const budget = await Budget.findOne({ where: { UserId: userId, category } });
  if (!budget) return null;

  const startDate = new Date();
  startDate.setDate(1); // Start of the current month
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // End of the current month

  const spent = await Transaction.sum('amount', {
    where: {
      UserId: userId,
      category,
      date: { [Op.between]: [startDate, endDate] },
      amount: { [Op.lt]: 0 } // Only consider expenses
    }
  });

  return {
    budgeted: budget.amount,
    spent: Math.abs(spent || 0),
    remaining: budget.amount - Math.abs(spent || 0)
  };
};