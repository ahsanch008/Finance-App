import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const useStyles = styled((theme) => ({
  // ... existing styles ...
}));

const FinancialSummary = ({ data }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" gutterBottom>
        Financial Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Typography variant="subtitle1">Total Income</Typography>
          <Typography variant="h6">${data.totalIncome.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="subtitle1">Total Expenses</Typography>
          <Typography variant="h6">${data.totalExpenses.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="subtitle1">Net Savings</Typography>
          <Typography variant="h6">${data.netSavings.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="subtitle1">Investment Value</Typography>
          <Typography variant="h6">${data.investmentValue.toFixed(2)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FinancialSummary;