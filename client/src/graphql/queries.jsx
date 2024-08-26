import { gql } from '@apollo/client';

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

// Add more queries as needed
