import React from 'react';
import { Typography, Paper, Grid, List, ListItem, ListItemText, Box, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { styled } from '@mui/material/styles';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StyledList = styled(List)(({ theme }) => ({
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.primary.dark,
  },
}));

const MonthlyReport = ({ report }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (!report) return null;

  const { totalIncome, totalExpenses, netSavings, categoryBreakdown } = report;
  const remainingBalance = totalIncome - totalExpenses;

  const pieData = {
    labels: ['Remaining', 'Spent'],
    datasets: [
      {
        data: [remainingBalance, totalExpenses],
        backgroundColor: [theme.palette.primary.main, theme.palette.grey[300]],
        borderColor: [theme.palette.primary.main, theme.palette.grey[300]],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: '75%',
  };


  const barData = {
    labels: categoryBreakdown.map(item => item.category),
    datasets: [
      {
        label: 'Amount',
        data: categoryBreakdown.map(item => item.amount),
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Expenses by Category',
        font: {
          size: isMobile ? 14 : 18,
          weight: 'bold',
        },
        color: theme.palette.text.primary,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 4, bgcolor: 'background.paper' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 3, textAlign: 'center' }}>
        Monthly Financial Report
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: { xs: 250, sm: 300 }, mb: 3, position: 'relative' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'medium' }}>Remaining Balance</Typography>
            <Pie data={pieData} options={pieOptions} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">${remainingBalance.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">Remaining</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: { xs: 250, sm: 300 }, mb: 3 }}>
            <Bar data={barData} options={barOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default', height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Summary</Typography>
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
            <StyledList sx={{ maxHeight: 250, overflow: 'auto' }}>
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
            </StyledList>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MonthlyReport;