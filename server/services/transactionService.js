const { Transaction } = require('../models');
const { Op } = require('sequelize');

exports.createTransaction = async (transactionData) => {
  return await Transaction.create(transactionData);
};

exports.getTransactions = async (userId, startDate, endDate, category, limit) => {
  const where = { UserId: userId };
  if (startDate && endDate) {
    where.date = { [Op.between]: [startDate, endDate] };
  }
  if (category) {
    where.category = category;
  }

  const options = { 
    where, 
    order: [['date', 'DESC']]
  };

  if (limit && !isNaN(limit)) {
    options.limit = parseInt(limit, 10);
  }

  return await Transaction.findAll(options);
};

exports.updateTransaction = async (id, userId, updateData) => {
  const transaction = await Transaction.findOne({ where: { id, UserId: userId } });
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  Object.assign(transaction, updateData);
  await transaction.save();
  return transaction;
};

exports.deleteTransaction = async (id, userId) => {
  const transaction = await Transaction.findOne({ where: { id, UserId: userId } });
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  await transaction.destroy();
};

exports.getMonthlySpending = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return await Transaction.sum('amount', {
    where: {
      UserId: userId,
      date: { [Op.between]: [startDate, endDate] },
      amount: { [Op.lt]: 0 } // Only consider expenses
    }
  });
};