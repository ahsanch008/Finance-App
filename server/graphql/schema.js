const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    googleId: String
    isEmailVerified: Boolean
    transactions: [Transaction!]
    investments: [Investment!]
    savingsGoals: [SavingsGoal!]
    budgets: [Budget!]
    cards: [Card!]
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
  googleLogin(token: String!): AuthPayload!
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
    type: TransactionType
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
    targetDate: String
    progress: Float
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Budget {
    id: ID!
    category: String!
    limit: Float
    spent: Float!
    period: String!
    createdAt: String!
    updatedAt: String!
  }

  enum BudgetPeriod {
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
     type ExchangeTokenResult {
    success: Boolean!
    accessToken: String
    message: String
  }

  type Query {
    me: User
    user(id: ID!): User
    getSavingsGoals: [SavingsGoal!]!
    getSavingsGoal(id: ID!): SavingsGoal
    getCards: [Card!]!
    getTransactions(startDate: String, endDate: String, category: String, limit: Int): [Transaction!]!
    getBudgets: [Budget!]!
    getBudget(id: ID!): Budget
    getInvestments(startDate: String, endDate: String, type: String): [Investment!]!
    getInvestment(id: ID!): Investment
    
  
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
      exchangePlaidPublicToken(publicToken: String!): ExchangeTokenResult!

    addTransactionCategory(name: String!): Boolean!
    
    getPlaidLinkToken: PlaidLinkTokenResponse!
  }

  type PlaidLinkTokenResponse {
    link_token: String!
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

  type Account {
    id: ID!
    name: String!
    type: String!
    balance: Float!
    institution: String!
    lastUpdated: String!
  }

  type PaginatedTransactions {
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


  extend type Query {
    getMonthlyReport(year: Int!, month: Int!): MonthlyReport!
    getAccounts: [Account!]!
    getPaginatedTransactions(
      page: Int
      limit: Int
      startDate: String
      endDate: String
      category: String
      sortBy: String
      sortOrder: String
    ): TransactionConnection!
  }
    type PlaidLinkToken {
  expiration: String!
  link_token: String!
  request_id: String!
}

type PlaidAccount {
  id: ID!
  name: String!
  type: String!
  subtype: String
  mask: String
  balances: PlaidAccountBalance!
}

type PlaidAccountBalance {
  available: Float
  current: Float
  limit: Float
  isoCurrencyCode: String
  unofficialCurrencyCode: String
}

type PlaidTransaction {
  id: ID!
  accountId: String!
  amount: Float!
  date: String!
  name: String!
  merchantName: String
  category: [String]
  pending: Boolean!
}

extend type Query {
  getPlaidLinkToken: PlaidLinkToken!
  getPlaidAccounts: [PlaidAccount!]!
  getPlaidTransactions(startDate: String!, endDate: String!): [PlaidTransaction!]!
}

extend type Mutation {
  exchangePlaidPublicToken(publicToken: String!): ExchangeTokenResult!
}
`;

module.exports = typeDefs;