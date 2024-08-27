import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, List, ListItem, ListItemText, LinearProgress, CircularProgress } from '@mui/material';
import { GET_SAVINGS_GOALS } from '../graphql/queries';

const SavingsGoals = ({savingsGoals}) => {
  const { loading, error, data } = useQuery(GET_SAVINGS_GOALS);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  if (!savingsGoals || savingsGoals.length === 0) {
    return <Typography>No savings goals available.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>Savings Goals</Typography>
      <List>
        {data.getSavingsGoals.map((goal) => (
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