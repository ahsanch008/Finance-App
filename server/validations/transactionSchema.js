const Joi = require('joi');
const { TRANSACTION_CATEGORIES, BUDGET_PERIODS } = require('../utils/constants');

exports.transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().valid(...TRANSACTION_CATEGORIES).required(),
  description: Joi.string().max(255)
});

exports.budgetSchema = Joi.object({
  category: Joi.string().valid(...TRANSACTION_CATEGORIES).required(),
  amount: Joi.number().positive().required(),
  period: Joi.string().valid(...Object.values(BUDGET_PERIODS)).required()
});