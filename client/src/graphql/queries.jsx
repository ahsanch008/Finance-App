import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      googleId
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      googleId
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`;

export const GET_SAVINGS_GOALS = gql`
  query GetSavingsGoals {
    getSavingsGoals {
      id
      name
      targetAmount
      currentAmount
      targetDate
      progress
      createdAt
      updatedAt
    }
  }
`;

export const GET_SAVINGS_GOAL = gql`
  query GetSavingsGoal($id: ID!) {
    getSavingsGoal(id: $id) {
      id
      name
      targetAmount
      currentAmount
      progress
      targetDate
      createdAt 
      updatedAt
    }
  }
`;

export const GET_CARDS = gql`
  query GetCards {
    getCards {
      id
      last4
      brand
      expirationMonth
      expirationYear
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($startDate: String, $endDate: String, $category: String, $limit: Int) {
    getTransactions(startDate: $startDate, endDate: $endDate, category: $category, limit: $limit) {
      id
      amount
      category
      description
      date
      type
    }
  }
`;

export const GET_BUDGETS = gql`
  query GetBudgets {
    getBudgets {
      id
      category
      limit
      spent
      period
      createdAt
      updatedAt
    }
  }
`;

export const GET_BUDGET = gql`
  query GetBudget($id: ID!) {
    getBudget(id: $id) {
      id
      category
      limit
      spent
      period
      createdAt
      updatedAt
    }
  }
`;

export const GET_INVESTMENTS = gql`
  query GetInvestments($startDate: String, $endDate: String, $type: String) {
    getInvestments(startDate: $startDate, endDate: $endDate, type: $type) {
      id
      type
      amount
      date
      currentValue
    
    }
  }
`;

export const GET_INVESTMENT = gql`
  query GetInvestment($id: ID!) {
    getInvestment(id: $id) {
      id
      type
      amount
      date
      currentValue
      createdAt
      updatedAt
    }
  }
`;

export const GET_FINANCIAL_SUMMARY = gql`
  query GetFinancialSummary($startDate: String, $endDate: String) {
    financialSummary(startDate: $startDate, endDate: $endDate) {
      totalIncome
      totalExpenses
      netSavings
      investmentValue
    }
  }
`;

export const GET_PAGINATED_TRANSACTIONS = gql`
  query GetPaginatedTransactions($page: Int, $limit: Int, $startDate: String, $endDate: String, $category: String, $sortBy: String, $sortOrder: String) {
    getPaginatedTransactions(page: $page, limit: $limit, startDate: $startDate, endDate: $endDate, category: $category, sortBy: $sortBy, sortOrder: $sortOrder) {
      edges {
        node {
          id
          amount
          category
          description
          date
          type
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_TRANSACTION_CATEGORIES = gql`
  query GetTransactionCategories {
    getTransactionCategories
  }
`;

export const GET_MONTHLY_REPORT = gql`
  query GetMonthlyReport($year: Int!, $month: Int!) {
    getMonthlyReport(year: $year, month: $month) {
      month
      year
      totalIncome
      totalExpenses
      netSavings
      categoryBreakdown {
        category
        amount
      }
    }
  }
`;
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($currentYear: Int!, $currentMonth: Int!) {
    me {
      id
      name
    }
    getTransactions(limit: 5) {
      id
      amount
      category
      description
      date
      type
    }
    getSavingsGoals {
      id
      name
      targetAmount
      currentAmount
      progress
    }
    getBudgets {
      id
      category
      limit
      spent
    }
    getMonthlyReport(year: $currentYear, month: $currentMonth) {
      month
      year
      totalIncome
      totalExpenses
      netSavings
      categoryBreakdown {
        category
        amount
      }
    }
  }
`;
export const GET_ACCOUNTS = gql`
  query GetAccounts {
    getAccounts {
      id
      name
      type
      balance
      institution
      lastUpdated
    }
  }
`;
export const GET_PLAID_LINK_TOKEN = gql`
  query GetPlaidLinkToken {
    getPlaidLinkToken {
      link_token
    }
  }
`;

export const GET_PLAID_ACCOUNTS = gql`
  query GetPlaidAccounts {
    getPlaidAccounts {
      id
      name
      type
      subtype
      mask
      balances {
        available
        current
        limit
        isoCurrencyCode
      }
    }
  }
`;

export const GET_PLAID_TRANSACTIONS = gql`
  query GetPlaidTransactions($startDate: String!, $endDate: String!) {
    getPlaidTransactions(startDate: $startDate, endDate: $endDate) {
      id
      accountId
      amount
      date
      name
      merchantName
      category
      pending
    }
  }
`;