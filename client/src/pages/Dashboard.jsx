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

const useStyles = styled((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <FinancialSummary data={data.financialSummary} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <InvestmentPortfolio investments={data.investments} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <SavingsGoals savingsGoals={data.savingsGoals} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Budgets budgets={data.budgets} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <TransactionHistory transactions={data.recentTransactions} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;