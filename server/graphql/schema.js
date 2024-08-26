const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    googleId: String
    isEmailVerified: Boolean!
    transactions: [Transaction!]
    investments: [Investment!]
    savingsGoals: [SavingsGoal!]
    budgets: [Budget!]
    cards: [Card!]
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Transaction {
    id: ID!
    amount: Float!
    category: String!
    description: String
    date: String!
    type: TransactionType!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  enum TransactionType {
    INCOME
    EXPENSE
  }

  type Investment {
    id: ID!
    type: String!
    amount: Float!
    date: String!
    currentValue: Float
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type SavingsGoal {
    id: ID!
    name: String!
    targetAmount: Float!
    currentAmount: Float!
    deadline: String
    progress: Float!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Budget {
    id: ID!
    category: String!
    limit: Float!
    spent: Float!
    period: BudgetPeriod!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  enum BudgetPeriod {
    DAILY
    WEEKLY
    MONTHLY
    YEARLY
  }

  type Card {
    id: ID!
    last4: String!
    brand: String!
    expirationMonth: Int!
    expirationYear: Int!
    isDefault: Boolean!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type FinancialSummary {
    totalIncome: Float!
    totalExpenses: Float!
    netSavings: Float!
    investmentValue: Float!
  }

  input TransactionInput {
    amount: Float!
    category: String!
    description: String
    date: String!
    type: TransactionType!
  }

  input InvestmentInput {
    type: String!
    amount: Float!
    date: String!
  }

  input SavingsGoalInput {
    name: String!
    targetAmount: Float!
    deadline: String
  }

  input BudgetInput {
    category: String!
    limit: Float!
    period: BudgetPeriod!
  }

  type Query {
    me: User
    user(id: ID!): User
    getSavingsGoals: [SavingsGoal!]!
    getSavingsGoal(id: ID!): SavingsGoal
    getCards: [Card!]!
    getTransactions(startDate: String, endDate: String, category: String): [Transaction!]!
    getBudgets: [Budget!]!
    getBudget(id: ID!): Budget
    getInvestments(startDate: String, endDate: String, type: String): [Investment!]!
    getInvestment(id: ID!): Investment
    financialSummary(startDate: String, endDate: String): FinancialSummary!
    
  
    getPaginatedTransactions(page: Int, limit: Int, startDate: String, endDate: String, category: String, sortBy: String, sortOrder: String): TransactionConnection!
    
    
    getTransactionCategories: [String!]!
    
    
    getMonthlyReport(year: Int!, month: Int!): MonthlyReport!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    googleLogin(token: String!): AuthPayload!
    updateProfile(name: String): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!
    createSavingsGoal(input: SavingsGoalInput!): SavingsGoal!
    updateSavingsGoal(id: ID!, input: SavingsGoalInput!): SavingsGoal!
    deleteSavingsGoal(id: ID!): Boolean!
    addCard(token: String!): Card!
    updateCard(id: ID!, isDefault: Boolean): Card!
    deleteCard(id: ID!): Boolean!
    createTransaction(input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
    createBudget(input: BudgetInput!): Budget!
    updateBudget(id: ID!, input: BudgetInput!): Budget!
    deleteBudget(id: ID!): Boolean!
    createInvestment(input: InvestmentInput!): Investment!
    updateInvestment(id: ID!, input: InvestmentInput!): Investment!
    deleteInvestment(id: ID!): Boolean!
    createCharge(amount: Float!, currency: String!, cardId: ID!): Boolean!
    

    addTransactionCategory(name: String!): Boolean!
    
 
    updateNotificationPreferences(preferences: NotificationPreferencesInput!): User!
  }

  type TransactionConnection {
    edges: [TransactionEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type TransactionEdge {
    node: Transaction!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type MonthlyReport {
    month: Int!
    year: Int!
    totalIncome: Float!
    totalExpenses: Float!
    netSavings: Float!
    categoryBreakdown: [CategoryAmount!]!
  }

  type CategoryAmount {
    category: String!
    amount: Float!
  }

  input NotificationPreferencesInput {
    emailNotifications: Boolean!
    pushNotifications: Boolean!

  }
`;

module.exports = typeDefs;