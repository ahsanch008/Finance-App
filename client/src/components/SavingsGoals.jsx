import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, List, ListItem, ListItemText, LinearProgress, CircularProgress } from '@mui/material';
import { GET_SAVINGS_GOALS } from '../graphql/queries';

const SavingsGoals = () => {
  const { loading, error, data } = useQuery(GET_SAVINGS_GOALS, {
    onError: (error) => {
      console.error('GraphQL error:', error);
      console.error('GraphQL error details:', error.graphQLErrors);
      console.error('Network error details:', error.networkError);
    }
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  

  const savingsGoals = data?.getSavingsGoals || [];
  
  if (savingsGoals.length === 0) {
    return <Typography>No savings goals available.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>Savings Goals</Typography>
      <List>
        {savingsGoals.map((goal) => (
          <ListItem key={goal.id}>
            <ListItemText
              primary={goal.name}
              secondary={`Target: $${goal.targetAmount} by ${new Date(goal.targetDate).toLocaleDateString()}`}
            />
            <Typography variant="body2">{goal.progress.toFixed(2)}%</Typography>
            <LinearProgress
              variant="determinate"
              value={goal.progress}
              style={{ width: '100%', marginTop: 8 }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SavingsGoals;