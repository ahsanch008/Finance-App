import React from 'react';
import { Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';

const SavingsGoals = ({ savingsGoals }) => {
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