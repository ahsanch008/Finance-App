const { AuthenticationError, UserInputError, ForbiddenError, ApolloError } = require('apollo-server-express');
const authService = require('../services/authService');
const userService = require('../services/userService');
const savingsGoalService = require('../services/savingGoalService');
const cardService = require('../services/cardService');
const transactionService = require('../services/transactionService');
const budgetService = require('../services/budgetService');
const investmentService = require('../services/investmentService');
//const financialSummaryService = require('../services/financialSummaryService');
const { authorize } = require('../middlewares/auth');
const { Transaction, Account } = require('../models');
const { Op } = require('sequelize');
const plaidService = require('../services/plaidService');

const resolvers = {
  Query: {
    me: authorize()(async (_, __, { user }) => {
      return user;
    }),
    user: authorize()(async (_, { id }) => {
      return await userService.getUser(id);
    }),
    getSavingsGoals: authorize()(async (_, __, { user}) => {
      return await savingsGoalService.getSavingsGoals(user.id);
    }),
    // getSavingsGoal: authorize()(async (_, { id }, { user }) => {
    //   const goal = await savingsGoalService.getSavingsGoal(id);
    //   if (goal.userId !== user.id) throw new ForbiddenError('Not authorized to view this savings goal');
    //   return goal;
    // }),
    getCards: authorize()(async (_, __, { user }) => {
      return await cardService.getCards(user.id);
    }),
    getTransactions: authorize()(async (_, { startDate, endDate, category, limit }, { user }) => {
      return await transactionService.getTransactions(user.id, startDate, endDate, category, limit);
    }),
    getBudgets: authorize()(async (_, __, { user }) => {
      try {
        const budgets = await budgetService.getBudgets(user.id);
        return budgets.filter(budget => budget && budget.id != null).map(budget => ({
          id: budget.id,
          category: budget.category,
          limit: budget.limit,
          amount: budget.amount,// You'll need to calculate this
          period: budget.period,
          createdAt: budget.createdAt,
          updatedAt: budget.updatedAt
        }));
      } catch (error) {
        console.error('Error fetching budgets:', error);
        throw new ApolloError('Failed to fetch budgets', 'BUDGET_FETCH_ERROR');
      }
    }),
    getBudget: authorize()(async (_, { id }, { user }) => {
      const budget = await budgetService.getBudgets(id);
      if (budget.userId !== user.id) throw new ForbiddenError('Not authorized to view this budget');
      return budget;
    }),
    getInvestments: authorize()(async (_, { startDate, endDate, type }, { user }) => {
      return await investmentService.getInvestments(user.id, startDate, endDate, type);
    }),
    getInvestment: authorize()(async (_, { id }, { user }) => {
      const investment = await investmentService.getInvestment(id);
      if (investment.userId !== user.id) throw new ForbiddenError('Not authorized to view this investment');
      return investment;
    }),
    getMonthlyReport: async (_, { year, month }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const transactions = await Transaction.findAll({
        where: {
          UserId: user.id,
          date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netSavings = totalIncome - totalExpenses;

      const categoryBreakdown = transactions.reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0;
        acc[t.category] += Math.abs(t.amount);
        return acc;
      }, {});

      return {
        month,
        year,
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netSavings: parseFloat(netSavings.toFixed(2)),
        categoryBreakdown: Object.entries(categoryBreakdown).map(([category, amount]) => ({
          category,
          amount
        }))
      };
    },
    getAnnualSummary: async (_, { year }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      const transactions = await Transaction.findAll({
        where: {
          UserId: user.id,
          date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const totalIncome = transactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const netSavings = totalIncome - totalExpenses;

      const categoryBreakdown = transactions.reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0;
        acc[t.category] += Math.abs(t.amount);
        return acc;
      }, {});

      return {
        year,
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netSavings: parseFloat(netSavings.toFixed(2)),
        categoryBreakdown: Object.entries(categoryBreakdown).map(([category, amount]) => ({
          category,
          amount
        }))
      };
    },
    getAccounts: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');

      return await Account.findAll({
        where: { UserId: user.id }
      });
    },
    getPaginatedTransactions: async (_, args, { user }) => {
      if (!user) throw new Error('Authentication required');

      const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        category,
        sortBy = 'date',
        sortOrder = 'DESC'
      } = args;

      const offset = (page - 1) * limit;

      const whereClause = { UserId: user.id };
      if (startDate && endDate) {
        whereClause.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }
      if (category) {
        whereClause.category = category;
      }

      const { count, rows } = await Transaction.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset
      });

      const hasNextPage = offset + rows.length < count;
      const endCursor = rows.length > 0 ? rows[rows.length - 1].id : null;

      return {
        edges: rows.map(transaction => ({
          node: transaction,
          cursor: transaction.id.toString()
        })),
        pageInfo: {
          hasNextPage,
          endCursor: endCursor ? endCursor.toString() : null
        },
        totalCount: count
      };
    },
    getPlaidLinkToken: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to create a Plaid link token');
      }
      try {
        const linkToken = await plaidService.createLinkToken(user.id);
        return linkToken;
      } catch (error) {
        console.error('Error creating Plaid link token:', error);
        throw new Error('Failed to create Plaid link token');
      }
    },
    getPlaidAccounts: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to view accounts');
      }
      const { accounts, error } = await plaidService.getAccounts(user.id);
      if (error) {
        console.error('Error fetching Plaid accounts:', error);
        return [];
      }
      return accounts;
    },
    getPlaidTransactions: async (_, { startDate, endDate }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to view transactions');
      }
      const { transactions, error } = await plaidService.getTransactions(user.id, startDate, endDate);
      if (error) {
        console.error('Error fetching Plaid transactions:', error);
        return [];
      }
      return transactions;
    },
  },
  SavingsGoal: {
    progress: (savingsGoal) => {
      if (savingsGoal.targetAmount === 0) return 0; // Avoid division by zero
      return (savingsGoal.currentAmount / savingsGoal.targetAmount) * 100;
    },
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      try {
        const { user, token } = await authService.register(name, email, password);
        return { token, user };
      } catch (error) {
        throw new UserInputError(error.message);
      }
    },
    login: async (_, { email, password }) => {
      try {
        const { user, token } = await authService.login(email, password);
        return { token, user };
      } catch (error) {
        throw new AuthenticationError(error.message);
      }
    },
    googleLogin: async (_, { token }) => {
      try {
        const googleUser = await authService.verifyGoogleToken(token);
        const { user, token: authToken } = await authService.googleAuth(googleUser);
        return { token: authToken, user };
      } catch (error) {
        throw new AuthenticationError('Google authentication failed: ' + error.message);
      }
    },
    updateProfile: authorize()(async (_, { name }, { user }) => {
      try {
        return await userService.updateProfile(user.id, { name });
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    changePassword: authorize()(async (_, { currentPassword, newPassword }, { user }) => {
      try {
        await authService.changePassword(user.id, currentPassword, newPassword);
        return true;
      } catch (error) {
        throw new AuthenticationError(error.message);
      }
    }),
    createSavingsGoal: authorize()(async (_, { input }, { user }) => {
      try {
        return await savingsGoalService.createSavingsGoal({ ...input, userId: user.id });
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    updateSavingsGoal: authorize()(async (_, { id, input }, { user }) => {
      try {
        const goal = await savingsGoalService.getSavingsGoal(id);
        if (goal.userId !== user.id) throw new ForbiddenError('Not authorized to update this savings goal');
        return await savingsGoalService.updateSavingsGoal(id, input);
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    deleteSavingsGoal: authorize()(async (_, { id }, { user }) => {
      try {
        const goal = await savingsGoalService.getSavingsGoal(id);
        if (goal.userId !== user.id) throw new ForbiddenError('Not authorized to delete this savings goal');
        await savingsGoalService.deleteSavingsGoal(id);
        return true;
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    addCard: authorize()(async (_, { token }, { user }) => {
      try {
        return await cardService.addCard(token, user.id);
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    updateCard: authorize()(async (_, { id, isDefault }, { user }) => {
      try {
        const card = await cardService.getCard(id);
        if (card.userId !== user.id) throw new ForbiddenError('Not authorized to update this card');
        return await cardService.updateCard(id, { isDefault });
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    deleteCard: authorize()(async (_, { id }, { user }) => {
      try {
        const card = await cardService.getCard(id);
        if (card.userId !== user.id) throw new ForbiddenError('Not authorized to delete this card');
        await cardService.deleteCard(id);
        return true;
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    createTransaction: authorize()(async (_, { input }, { user }) => {
      try {
        return await transactionService.createTransaction({ ...input, userId: user.id });
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    updateTransaction: authorize()(async (_, { id, input }, { user }) => {
      try {
        const transaction = await transactionService.getTransaction(id);
        if (transaction.userId !== user.id) throw new ForbiddenError('Not authorized to update this transaction');
        return await transactionService.updateTransaction(id, input);
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    deleteTransaction: authorize()(async (_, { id }, { user }) => {
      try {
        const transaction = await transactionService.getTransaction(id);
        if (transaction.userId !== user.id) throw new ForbiddenError('Not authorized to delete this transaction');
        await transactionService.deleteTransaction(id);
        return true;
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    createBudget: authorize()(async (_, { input }, { user }) => {
      try {
        return await budgetService.createBudget({ ...input, userId: user.id });
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    updateBudget: authorize()(async (_, { id, input }, { user }) => {
      try {
        const budget = await budgetService.getBudget(id);
        if (budget.userId !== user.id) throw new ForbiddenError('Not authorized to update this budget');
        return await budgetService.updateBudget(id, input);
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    deleteBudget: authorize()(async (_, { id }, { user }) => {
      try {
        const budget = await budgetService.getBudget(id);
        if (budget.userId !== user.id) throw new ForbiddenError('Not authorized to delete this budget');
        await budgetService.deleteBudget(id);
        return true;
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    createInvestment: authorize()(async (_, { input }, { user }) => {
      try {
        return await investmentService.createInvestment({ ...input, userId: user.id });
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    
    updateInvestment: authorize()(async (_, { id, input }, { user }) => {
      try {
        const investment = await investmentService.getInvestment(id);
        if (investment.userId !== user.id) throw new ForbiddenError('Not authorized to update this investment');
        return await investmentService.updateInvestment(id, input);
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    deleteInvestment: authorize()(async (_, { id }, { user }) => {
      try {
        const investment = await investmentService.getInvestment(id);
        if (investment.userId !== user.id) throw new ForbiddenError('Not authorized to delete this investment');
        await investmentService.deleteInvestment(id);
        return true;
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    createCharge: authorize()(async (_, { amount, currency, cardId }, { user }) => {
      try {
        const card = await cardService.getCard(cardId);
        if (card.userId !== user.id) throw new ForbiddenError('Not authorized to use this card');
        return await cardService.createCharge(amount, currency, cardId);
      } catch (error) {
        throw new UserInputError(error.message);
      }
    }),
    exchangePlaidPublicToken: async (_, { publicToken }, { req, res }) => {
      try {
        const result = await plaidService.exchangePublicToken(publicToken, req, res);
        console.log('Exchange result:', result);
        return result;
      } catch (error) {
        console.error('Error exchanging Plaid public token:', error);
        throw new ApolloError('Failed to exchange Plaid public token', 'PLAID_API_ERROR', {
          message: error.message,
          stack: error.stack
        });
      }
    },
  },
  
};


module.exports = resolvers;