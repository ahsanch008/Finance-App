const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { User } = require('../models'); // Add this line to import the User model

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Add this function to create a link token
const createLinkToken = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Your App Name',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    return { link_token: response.data.link_token };
  } catch (error) {
    console.error('Error creating Plaid link token:', error);
    throw error;
  }
};

const getAccounts = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = user.plaidAccessToken;
    if (!accessToken) {
      return { accounts: [], error: 'Plaid account not linked' };
    }

    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    return { accounts: response.data.accounts, error: null };
  } catch (error) {
    console.error('Error fetching Plaid accounts:', error);
    return { accounts: [], error: error.message };
  }
};

const getTransactions = async (userId, startDate, endDate) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = user.plaidAccessToken;
    if (!accessToken) {
      return { transactions: [], error: 'Plaid account not linked' };
    }

    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    });

    return { transactions: response.data.transactions, error: null };
  } catch (error) {
    console.error('Error fetching Plaid transactions:', error);
    return { transactions: [], error: error.message };
  }
};

module.exports = {
  createLinkToken,
  getAccounts,
  getTransactions,
};