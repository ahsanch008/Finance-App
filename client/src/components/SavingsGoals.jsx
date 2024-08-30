import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, List, ListItem, ListItemText, LinearProgress, CircularProgress, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { GET_SAVINGS_GOALS } from '../graphql/queries';
import SavingsIcon from '@mui/icons-material/Savings';

const SavingsGoals = () => {
  const { loading, error, data } = useQuery(GET_SAVINGS_GOALS, {
    onError: (error) => {
      console.error('GraphQL error:', error);
      console.error('GraphQL error details:', error.graphQLErrors);
      console.error('Network error details:', error.networkError);
    }
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
      <Typography variant="h6">Error loading savings goals</Typography>
      <Typography>{error.message}</Typography>
    </Paper>
  );

  const savingsGoals = data?.getSavingsGoals || [];
  
  if (savingsGoals.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">Savings Goals</Typography>
        <Typography>No savings goals available. Create a goal to get started!</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <SavingsIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" color="primary">Savings Goals</Typography>
      </Box>
      <List>
        {savingsGoals.map((goal) => (
          <ListItem key={goal.id} sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight="medium">{goal.name}</Typography>
              
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2">
                Progress: ${(goal.targetAmount * goal.progress / 100).toFixed(2)} of ${goal.targetAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" fontWeight="bold" color={goal.progress >= 100 ? 'success.main' : 'primary.main'}>
                {goal.progress.toFixed(2)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={goal.progress > 100 ? 100 : goal.progress}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: goal.progress >= 100 ? theme.palette.success.main : theme.palette.primary.main,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SavingsGoals;