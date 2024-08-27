const { AuthenticationError, UserInputError, ForbiddenError } = require('apollo-server-express');
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

const resolvers = {
  Query: {
    me: authorize()(async (_, __, { user }) => {
      return user;
    }),
    user: authorize()(async (_, { id }) => {
      return await userService.getUser(id);
    }),
    getSavingsGoals: authorize()(async (_, __, { user }) => {
      return await savingsGoalService.getSavingsGoals(user.id);
    }),
    getSavingsGoal: authorize()(async (_, { id }, { user }) => {
      const goal = await savingsGoalService.getSavingsGoal(id);
      if (goal.userId !== user.id) throw new ForbiddenError('Not authorized to view this savings goal');
      return goal;
    }),
    getCards: authorize()(async (_, __, { user }) => {
      return await cardService.getCards(user.id);
    }),
    getTransactions: authorize()(async (_, { startDate, endDate, category, limit }, { user }) => {
      return await transactionService.getTransactions(user.id, startDate, endDate, category, limit);
    }),
    getBudgets: authorize()(async (_, __, { user }) => {
      return await budgetService.getBudgets(user.id);
    }),
    getBudget: authorize()(async (_, { id }, { user }) => {
      const budget = await budgetService.getBudget(id);
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
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netSavings = totalIncome - totalExpenses;

      const categoryBreakdown = transactions.reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0;
        acc[t.category] += Math.abs(t.amount);
        return acc;
      }, {});

      return {
        month,
        year,
        totalIncome,
        totalExpenses,
        netSavings,
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
  },
};


module.exports = resolvers;