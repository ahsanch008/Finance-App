import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, List, ListItem, ListItemText, LinearProgress, CircularProgress } from '@mui/material';
import { GET_BUDGETS } from '../graphql/queries';

const Budgets = () => {
  const { loading, error, data } = useQuery(GET_BUDGETS);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  
  const budgets = data?.getBudgets || [];

  if (budgets.length === 0) {
    return <Typography>No budgets available.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>Budgets</Typography>
      <List>
        {budgets.map((budget) => (
          <ListItem key={budget.id}>
            <ListItemText
              primary={budget.category}
              secondary={`${budget.period}: $${budget.limit}`}
            />
            <Typography variant="body2">${budget.limit - budget.spent} left</Typography>
            <LinearProgress
              variant="determinate"
              value={(budget.spent / budget.limit) * 100}
              style={{ width: '100%', marginTop: 8 }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Budgets;