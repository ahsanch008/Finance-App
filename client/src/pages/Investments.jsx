import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_INVESTMENTS } from '../graphql/queries';
import { Typography, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';

const Investments = () => {
  const { loading, error, data } = useQuery(GET_INVESTMENTS);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Investments</Typography>
      <Paper>
        <List>
          {data.getInvestments.map((investment) => (
            <ListItem key={investment.id}>
              <ListItemText
                primary={investment.type}
                secondary={`Amount: $${investment.amount.toFixed(2)}, Date: ${new Date(investment.date).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default Investments;