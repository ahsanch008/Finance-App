import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import theme from './styles/theme';
import Layout from './components/Layout';
import HomePage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Transactions from './components/Transactions';
import Investments from './components/InvestmentPortfolio';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Budgets from './components/Budgets';
import Settings from './components/Settings';
import AnnualSummary from './pages/AnnualSummary';
import SavingsGoals from './components/SavingsGoals';
import HelpSupport from './pages/HelpSupport';
import PlaidLink from './components/PlaidLink';
import ProtectedRoute from './components/ProtectedRoute';
import { ApolloProvider ,useQuery} from '@apollo/client';
import client from './apolloClient';
import MonthlyReport from './pages/MonthlyReport';
import { GET_MONTHLY_REPORT } from './graphql/queries';

function App() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { loading, error, data } = useQuery(GET_MONTHLY_REPORT, {
    variables: {
      month: currentDate.getMonth() + 1,
      year: currentYear
    }
  });
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/accounts" element={<ProtectedRoute><PlaidLink /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/savings-goals" element={<ProtectedRoute><SavingsGoals /></ProtectedRoute>} />
                <Route path="/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
                <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
                <Route path="/reports/annual" element={<ProtectedRoute><AnnualSummary year={currentYear} /></ProtectedRoute>} />
                <Route path="/reports/monthly" element={<ProtectedRoute><MonthlyReport report={data?.getMonthlyReport} /></ProtectedRoute>} />
              </Routes>
            </Layout>
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;