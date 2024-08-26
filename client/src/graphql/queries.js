import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser {
    me {
      id
      name
      email
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($startDate: String, $endDate: String, $category: String) {
    transactions(startDate: $startDate, endDate: $endDate, category: $category) {
      id
      amount
      category
      description
      date
    }
  }
`;

export const GET_INVESTMENTS = gql`
  query GetInvestments($startDate: String, $endDate: String, $type: String) {
    investments(startDate: $startDate, endDate: $endDate, type: $type) {
      id
      type
      amount
      date
      currentValue
    }
  }
`;

export const GET_SAVINGS_GOALS = gql`
  query GetSavingsGoals {
    savingsGoals {
      id
      name
      targetAmount
      currentAmount
      targetDate
      progress
    }
  }
`;

export const GET_BUDGETS = gql`
  query GetBudgets {
    budgets {
      id
      category
      amount
      period
      currentSpending
      remainingAmount
    }
  }
`;

export const GET_CARDS = gql`
  query GetCards {
    cards {
      id
      last4
      brand
    }
  }
`;

export const GET_FINANCIAL_SUMMARY = gql`
  query GetFinancialSummary {
    financialSummary {
      totalIncome
      totalExpenses
      netSavings
      investmentValue
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    financialSummary {
      totalIncome
      totalExpenses
      netSavings
      investmentValue
    }
    investments {
      id
      type
      amount
      date
      currentValue
    }
    savingsGoals {
      id
      name
      targetAmount
      currentAmount
      targetDate
      progress
    }
    budgets {
      id
      category
      amount
      period
      currentSpending
      remainingAmount
    }
    recentTransactions: transactions(limit: 5) {
      id
      amount
      category
      description
      date
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      name
      type
      balance
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    user {
      id
      name
      email
    }
  }
`;