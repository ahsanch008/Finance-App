import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($token: String!) {
    googleLogin(token: $token) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile($name: String!) {
    updateProfile(name: $name) {
      id
      name
      email
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

export const CREATE_SAVINGS_GOAL = gql`
  mutation CreateSavingsGoal($input: SavingsGoalInput!) {
    createSavingsGoal(input: $input) {
      id
      name
      targetAmount
      currentAmount
      deadline
      progress
    }
  }
`;

export const UPDATE_SAVINGS_GOAL = gql`
  mutation UpdateSavingsGoal($id: ID!, $input: SavingsGoalInput!) {
    updateSavingsGoal(id: $id, input: $input) {
      id
      name
      targetAmount
      currentAmount
      deadline
      progress
    }
  }
`;

export const DELETE_SAVINGS_GOAL = gql`
  mutation DeleteSavingsGoal($id: ID!) {
    deleteSavingsGoal(id: $id)
  }
`;

export const ADD_CARD = gql`
  mutation AddCard($token: String!) {
    addCard(token: $token) {
      id
      last4
      brand
      expirationMonth
      expirationYear
      isDefault
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $isDefault: Boolean) {
    updateCard(id: $id, isDefault: $isDefault) {
      id
      isDefault
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      category
      description
      date
      type
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      amount
      category
      description
      date
      type
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

export const CREATE_BUDGET = gql`
  mutation CreateBudget($input: BudgetInput!) {
    createBudget(input: $input) {
      id
      category
      limit
      spent
      period
    }
  }
`;

export const UPDATE_BUDGET = gql`
  mutation UpdateBudget($id: ID!, $input: BudgetInput!) {
    updateBudget(id: $id, input: $input) {
      id
      category
      limit
      spent
      period
    }
  }
`;

export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id)
  }
`;

export const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($input: InvestmentInput!) {
    createInvestment(input: $input) {
      id
      type
      amount
      date
      currentValue
    }
  }
`;

export const UPDATE_INVESTMENT = gql`
  mutation UpdateInvestment($id: ID!, $input: InvestmentInput!) {
    updateInvestment(id: $id, input: $input) {
      id
      type
      amount
      date
      currentValue
    }
  }
`;

export const DELETE_INVESTMENT = gql`
  mutation DeleteInvestment($id: ID!) {
    deleteInvestment(id: $id)
  }
`;

export const CREATE_CHARGE = gql`
  mutation CreateCharge($amount: Float!, $currency: String!, $cardId: ID!) {
    createCharge(amount: $amount, currency: $currency, cardId: $cardId)
  }
`;

export const ADD_TRANSACTION_CATEGORY = gql`
  mutation AddTransactionCategory($name: String!) {
    addTransactionCategory(name: $name)
  }
`;

export const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences($preferences: NotificationPreferencesInput!) {
    updateNotificationPreferences(preferences: $preferences) {
      id
      name
      email
    }
  }
`;
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
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
    financialSummary {
      totalIncome
      totalExpenses
      netSavings
    }
  }
`;
export const EXCHANGE_PLAID_PUBLIC_TOKEN = gql`
  mutation ExchangePlaidPublicToken($publicToken: String!) {
    exchangePlaidPublicToken(publicToken: $publicToken)
  }
`;
