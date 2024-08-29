import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Paper, Grid, List, ListItem, ListItemText, Box, Divider, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { GET_ANNUAL_SUMMARY } from '../graphql/queries';

const AnnualSummary = ({ year }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loading, error, data } = useQuery(GET_ANNUAL_SUMMARY, {
    variables: { year },
  });

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {error.message}</Typography>;

  const { totalIncome, totalExpenses, netSavings, categoryBreakdown } = data.getAnnualSummary;

  // Prepare data for Pie Chart
  const pieData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: [theme.palette.success.light, theme.palette.error.light],
        borderColor: [theme.palette.success.main, theme.palette.error.main],
        borderWidth: 2,
        hoverBackgroundColor: [theme.palette.success.main, theme.palette.error.main],
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
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        hoverBackgroundColor: theme.palette.primary.main,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Annual Expenses by Category',
        font: {
          size: isMobile ? 14 : 18,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 4, bgcolor: 'background.paper' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 3, textAlign: 'center' }}>
        Annual Financial Summary ({year})
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: { xs: 250, sm: 300 }, mb: 3 }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'medium' }}>Annual Income vs Expenses</Typography>
            <Pie data={pieData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: { xs: 250, sm: 300 }, mb: 3 }}>
            <Bar data={barData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default', height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Annual Summary</Typography>
            <List>
              <ListItem sx={{ py: 1 }}>
                <ListItemText 
                  primary="Total Income" 
                  secondary={`$${totalIncome.toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemText 
                  primary="Total Expenses" 
                  secondary={`$${totalExpenses.toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: 'error.main', fontWeight: 'bold', fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemText 
                  primary="Net Savings" 
                  secondary={`$${netSavings.toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ 
                    color: netSavings >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                    fontSize: '1.3rem'
                  }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default', height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Category Breakdown</Typography>
            <List sx={{ maxHeight: 250, overflow: 'auto' }}>
              {categoryBreakdown.map((item, index) => (
                <ListItem key={index} divider={index !== categoryBreakdown.length - 1} sx={{ py: 1 }}>
                  <ListItemText 
                    primary={item.category} 
                    secondary={`$${item.amount.toFixed(2)}`} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ fontWeight: 'bold', color: 'text.secondary' }}
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