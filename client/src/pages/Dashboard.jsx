import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, CircularProgress, Box, Button, useTheme, useMediaQuery } from '@mui/material';
import { Scrollbars } from 'react-custom-scrollbars-2';
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
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-4px)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
}));

const CustomScrollbars = ({ children, maxHeight }) => {
  const theme = useTheme();
  
  return (
    <Scrollbars
      style={{ height: maxHeight }}
      renderThumbVertical={({ style, ...props }) =>
        <div {...props} style={{
          ...style,
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.2)',
          borderRadius: '3px',
        }}/>
      }
    >
      {children}
    </Scrollbars>
  );
};

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
      <CircularProgress size={50} thickness={4} />
    </Box>
  );
  if (error) return (
    <Box p={2} bgcolor="error.light" color="error.contrastText" borderRadius={2}>
      <Typography variant="h6">Error loading dashboard: {error.message}</Typography>
    </Box>
  );

  const validBudgets = data?.getBudgets?.filter(budget => budget && budget.id != null) || [];
  const monthlyReport = data?.getMonthlyReport;

  return (
    <Box sx={{ 
      flexGrow: 1, 
      padding: { xs: 2, sm: 3, md: 2 },
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      overflow: 'auto'
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        mb: 2 ,mt:-3, 
        fontWeight: 'bold',
        fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
        color: theme.palette.primary.main,
        textAlign: 'center',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }}>
        Chaudhary's Financial Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Financial Summary and PlaidLink */}
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <SectionTitle variant="h5">Financial Summary</SectionTitle>
              <Button 
                variant="outlined" 
                color="primary" 
                size="small"
                onClick={() => setShowAnnualSummary(!showAnnualSummary)}
                sx={{ 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }
                }}
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
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <SectionTitle variant="h5">Link Account</SectionTitle>
            <PlaidLink />
          </StyledPaper>
        </Grid>

        {/* Recent Transactions and Investment Portfolio */}
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={3}>
            <SectionTitle variant="h5">Recent Transactions</SectionTitle>
            <CustomScrollbars maxHeight={400}>
              <Transactions />
            </CustomScrollbars>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <SectionTitle variant="h5">Investment Portfolio</SectionTitle>
            <CustomScrollbars maxHeight={400}>
              <InvestmentPortfolio investments={data?.getInvestments || []} />
            </CustomScrollbars>
          </StyledPaper>
        </Grid>

        {/* Savings Goals and Budget Overview */}
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <SectionTitle variant="h5">Savings Goals</SectionTitle>
            <CustomScrollbars maxHeight={400}>
              <SavingsGoals />
            </CustomScrollbars>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={3}>
            <SectionTitle variant="h5">Budget Overview</SectionTitle>
            <CustomScrollbars maxHeight={400}>
              <Budgets budgets={validBudgets} />
            </CustomScrollbars>
          </StyledPaper>
        </Grid>

        {/* Investment Timeline */}
        <Grid item xs={12}>
          <StyledPaper elevation={3}>
            <SectionTitle variant="h5">Investment Timeline</SectionTitle>
            <InvestmentChart />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
