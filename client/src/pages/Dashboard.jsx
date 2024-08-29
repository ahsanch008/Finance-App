import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, CircularProgress, Box, Button, useTheme, useMediaQuery } from '@mui/material';
import InvestmentPortfolio from '../components/InvestmentPortfolio';
import SavingsGoals from '../components/SavingsGoals';
import Budgets from '../components/Budgets';
import Transactions from '../components/Transactions';
import PlaidLink from '../components/PlaidLink';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import InvestmentChart from '../components/InvestmentChart';
import MonthlyReport from '../pages/MonthlyReport';
import AnnualSummary from '../pages/AnnualSummary';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [showAnnualSummary, setShowAnnualSummary] = useState(false);

  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA, {
    variables: { currentYear, currentMonth }
  });

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
  if (error) return (
    <Box p={3}>
      <Typography color="error" variant="h6">Error loading dashboard: {error.message}</Typography>
    </Box>
  );

  const validBudgets = data?.getBudgets?.filter(budget => budget && budget.id != null) || [];
  const monthlyReport = data?.getMonthlyReport;

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>Chaudhary's Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={2}>
            <PlaidLink />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={2}>
            <InvestmentPortfolio investments={data?.getInvestments || []} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={2}>
            <SavingsGoals />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={2}>
            <Transactions />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" gutterBottom>Budgets</Typography>
            <Budgets budgets={validBudgets} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper elevation={2}>
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} mb={2}>
              <Typography variant="h6" gutterBottom>Financial Summary</Typography>
              <Button 
                variant="outlined" 
                onClick={() => setShowAnnualSummary(!showAnnualSummary)}
                sx={{ mt: isMobile ? 2 : 0 }}
              >
                {showAnnualSummary ? 'Show Monthly Report' : 'Show Annual Summary'}
              </Button>
            </Box>
            {showAnnualSummary ? (
              <AnnualSummary year={currentYear} />
            ) : (
              <MonthlyReport report={monthlyReport} />
            )}
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" gutterBottom>Investment Timeline</Typography>
            <InvestmentChart />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;