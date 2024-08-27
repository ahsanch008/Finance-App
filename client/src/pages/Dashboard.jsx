import React from 'react';
import { useQuery } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
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
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={4}>
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
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <TransactionHistory transactions={data?.getTransactions || []} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <InvestmentChart />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;