const Joi = require('joi');

const schemas = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  transaction: Joi.object({
    amount: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string(),
    date: Joi.date(),
  }),

  investment: Joi.object({
    type: Joi.string().required(),
    amount: Joi.number().required(),
    date: Joi.date(),
  }),

  savingsGoal: Joi.object({
    name: Joi.string().required(),
    targetAmount: Joi.number().required(),
    targetDate: Joi.date().required(),
  }),

  budget: Joi.object({
    category: Joi.string().required(),
    amount: Joi.number().required(),
    period: Joi.string().required(),
  }),

  card: Joi.object({
    token: Joi.string().required(),
  }),
};

module.exports = schemas;