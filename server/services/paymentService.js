const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Card, Transaction } = require('../models');

exports.createCharge = async (amount, currency, cardId, userId) => {
  const card = await Card.findOne({ where: { id: cardId, UserId: userId } });
  if (!card) {
    throw new Error('Card not found');
  }
  const charge = await stripe.charges.create({
    amount,
    currency,
    customer: card.stripeCustomerId,
  });
  await Transaction.create({
    amount: -amount, // Negative amount for expenses
    category: 'Payment',
    description: `Charge for ${currency}${amount/100}`,
    UserId: userId
  });
  return charge;
};

exports.getCharges = async (userId, startDate, endDate) => {
  const where = { 
    UserId: userId,
    category: 'Payment'
  };
  if (startDate && endDate) {
    where.date = { [Op.between]: [startDate, endDate] };
  }
  return await Transaction.findAll({ where, order: [['date', 'DESC']] });
};