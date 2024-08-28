import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Paper, Grid, List, ListItem, ListItemText, Box, Divider, useTheme } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { GET_ANNUAL_SUMMARY } from '../graphql/queries';

const AnnualSummary = ({ year }) => {
  const theme = useTheme();
  const { loading, error, data } = useQuery(GET_ANNUAL_SUMMARY, {
    variables: { year },
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const { totalIncome, totalExpenses, netSavings, categoryBreakdown } = data.getAnnualSummary;

  // Prepare data for Pie Chart
  const pieData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: [theme.palette.success.main, theme.palette.error.main],
        hoverBackgroundColor: [theme.palette.success.dark, theme.palette.error.dark],
      },
    ],
  };

  // Prepare data for Bar Chart
  const barData = {
    labels: categoryBreakdown.map(item => item.category),
    datasets: [
      {
        label: 'Amount',
        data: categoryBreakdown.map(item => item.amount),
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Annual Expenses by Category',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Annual Financial Summary ({year})
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300, mb: 2 }}>
            <Typography variant="h6" gutterBottom align="center">Annual Income vs Expenses</Typography>
            <Pie data={pieData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300, mb: 2 }}>
            <Bar data={barData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom color="primary">Annual Summary</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Total Income" 
                  secondary={`$${totalIncome.toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: 'success.main', fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Total Expenses" 
                  secondary={`$${totalExpenses.toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: 'error.main', fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Net Savings" 
                  secondary={`$${netSavings.toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ 
                    color: netSavings >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom color="primary">Category Breakdown</Typography>
            <List sx={{ maxHeight: 200, overflow: 'auto' }}>
              {categoryBreakdown.map((item, index) => (
                <ListItem key={index} divider={index !== categoryBreakdown.length - 1}>
                  <ListItemText 
                    primary={item.category} 
                    secondary={`$${item.amount.toFixed(2)}`} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AnnualSummary;