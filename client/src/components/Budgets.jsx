import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, List, ListItem, ListItemText, LinearProgress, CircularProgress, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { GET_BUDGETS } from '../graphql/queries';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Budgets = () => {
  const { loading, error, data } = useQuery(GET_BUDGETS);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
      <Typography variant="h6">Error loading budgets</Typography>
      <Typography>{error.message}</Typography>
    </Paper>
  );
  
  const budgets = data?.getBudgets || [];

  if (budgets.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">Budgets</Typography>
        <Typography>No budgets available. Create a budget to get started.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <AccountBalanceWalletIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" color="primary">Budgets</Typography>
      </Box>
      <List>
        {budgets.map((budget) => (
          budget && budget.id ? (
            <ListItem key={budget.id} sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight="medium">{budget.category}</Typography>
                <Typography variant="body2" color="text.secondary">{budget.period}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">
                  ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                </Typography>
                <Typography variant="body2" color={budget.limit - budget.spent > 0 ? 'success.main' : 'error.main'} fontWeight="bold">
                  ${(budget.limit - budget.spent).toFixed(2)} left
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(budget.spent / budget.limit) * 100}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: (budget.spent / budget.limit) > 0.9 ? theme.palette.error.main : theme.palette.primary.main,
                  }
                }}
              />
            </ListItem>
          ) : null
        ))}
      </List>
    </Paper>
  );
};

export default Budgets;