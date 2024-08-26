import React from 'react';
import { Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';

const Budgets = ({ budgets }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Budgets</Typography>
      <List>
        {budgets.map((budget) => (
          <ListItem key={budget.id}>
            <ListItemText
              primary={budget.category}
              secondary={`${budget.period}: $${budget.amount}`}
            />
            <Typography variant="body2">${budget.remainingAmount} left</Typography>
            <LinearProgress
              variant="determinate"
              value={(budget.currentSpending / budget.amount) * 100}
              style={{ width: '100%', marginTop: 8 }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Budgets;