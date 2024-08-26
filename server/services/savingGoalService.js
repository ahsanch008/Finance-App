const { SavingsGoal } = require('../models');

exports.createSavingsGoal = async (goalData) => {
  return await SavingsGoal.create(goalData);
};

exports.getSavingsGoals = async (userId) => {
  return await SavingsGoal.findAll({ where: { UserId: userId } });
};

exports.updateSavingsGoal = async (id, userId, updateData) => {
  const goal = await SavingsGoal.findOne({ where: { id, UserId: userId } });
  if (!goal) {
    throw new Error('Savings goal not found');
  }
  Object.assign(goal, updateData);
  await goal.save();
  return goal;
};

exports.deleteSavingsGoal = async (id, userId) => {
  const goal = await SavingsGoal.findOne({ where: { id, UserId: userId } });
  if (!goal) {
    throw new Error('Savings goal not found');
  }
  await goal.destroy();
};

exports.updateSavingsGoalProgress = async (id, userId, amount) => {
  const goal = await SavingsGoal.findOne({ where: { id, UserId: userId } });
  if (!goal) {
    throw new Error('Savings goal not found');
  }
  goal.currentAmount += amount;
  await goal.save();
  return goal;
};