const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Card } = require('../models');

exports.addCard = async (token, userId) => {
  const customer = await stripe.customers.create({
    source: token,
    email: req.user.email,
  });
  const card = await Card.create({
    stripeCustomerId: customer.id,
    last4: token.card.last4,
    brand: token.card.brand,
    UserId: userId
  });
  return card;
};

exports.getCards = async (userId) => {
  return await Card.findAll({ where: { UserId: userId } });
};

exports.deleteCard = async (id, userId) => {
  const card = await Card.findOne({ where: { id, UserId: userId } });
  if (!card) {
    throw new Error('Card not found');
  }
  await stripe.customers.deleteSource(card.stripeCustomerId, card.stripeCardId);
  await card.destroy();
};