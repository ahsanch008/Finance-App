const Joi = require('joi');

exports.cardSchema = Joi.object({
  token: Joi.string().required()
});

exports.chargeSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  cardId: Joi.string().uuid().required()
});