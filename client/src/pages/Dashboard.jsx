import React from 'react';
import { useQuery } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import InvestmentPortfolio from '../components/InvestmentPortfolio';
import SavingsGoals from '../pages/SavingsGoals';
import Budgets from '../pages/Budgets';
import Transactions from '../pages/Transactions';
import PlaidLink from '../components/PlaidLink';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import InvestmentChart from '../components/InvestmentChart';
import AccountBalances from '../components/AccountBalances';
import MonthlyReport from '../components/MonthlyReport'; // Add this import

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const Dashboard = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA, {
    variables: { currentYear, currentMonth }
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading dashboard: {error.message}</Typography>;
  const validBudgets = data?.getBudgets?.filter(budget => budget && budget.id != null) || [];
  const monthlyReport = data?.getMonthlyReport;

  // ... rest of the component
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>Chaudhary's Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <AccountBalances />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <InvestmentPortfolio investments={data?.getInvestments || []} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom></Typography>
            <SavingsGoals />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Transactions />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Budgets</Typography>
            <Budgets budgets={validBudgets} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Monthly Report</Typography>
            <MonthlyReport report={monthlyReport} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Investment Timeline</Typography>
            <InvestmentChart />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;