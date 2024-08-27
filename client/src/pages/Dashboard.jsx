import React from 'react';
import { useQuery } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, CircularProgress } from '@mui/material';
import InvestmentPortfolio from '../components/InvestmentPortfolio';
import SavingsGoals from '../components/SavingsGoals';
import Budgets from '../components/Budgets';
import TransactionHistory from '../components/TransactionHistory';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import InvestmentChart from '../components/InvestmentChart';

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
            <InvestmentPortfolio investments={data?.getInvestments || []} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <SavingsGoals savingsGoals={data?.getSavingsGoals || []} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Budgets budgets={data?.getBudgets || []} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <TransactionHistory transactions={data?.getTransactions || []} />
          </StyledPaper>
          <StyledPaper><InvestmentChart /></StyledPaper>
          
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;