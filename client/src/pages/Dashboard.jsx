import React from 'react';
import { useQuery } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import FinancialSummary from '../components/FinancialSummary';
import TransactionHistory from '../components/TransactionHistory';
import InvestmentPortfolio from '../components/InvestmentPortfolio';
import SavingsGoals from '../components/SavingsGoals';
import Budgets from '../components/Budgets';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <FinancialSummary data={data.financialSummary} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <InvestmentPortfolio investments={data.investments} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <SavingsGoals savingsGoals={data.savingsGoals} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Budgets budgets={data.budgets} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <TransactionHistory transactions={data.recentTransactions} />
          </StyledPaper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;