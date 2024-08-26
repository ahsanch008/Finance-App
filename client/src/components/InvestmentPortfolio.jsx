import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const InvestmentPortfolio = ({ investments }) => {
  const totalValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0);

  return (
    <>
      <Typography variant="h6" gutterBottom>Investment Portfolio</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Value: ${totalValue.toFixed(2)}
      </Typography>
      <List>
        {investments.map((investment) => (
          <ListItem key={investment.id}>
            <ListItemText 
              primary={investment.type} 
              secondary={`Initial: $${investment.amount.toFixed(2)} | Current: $${investment.currentValue.toFixed(2)}`} 
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default InvestmentPortfolio;