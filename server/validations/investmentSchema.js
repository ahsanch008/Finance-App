const Joi = require('joi');
const { INVESTMENT_TYPES } = require('../utils/constants');

exports.investmentSchema = Joi.object({
  type: Joi.string().valid(...INVESTMENT_TYPES).required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().max('now').required()
});

exports.savingsGoalSchema = Joi.object({
  name: Joi.string().required(),
  targetAmount: Joi.number().positive().required(),
  targetDate: Joi.date().greater('now').required()
});