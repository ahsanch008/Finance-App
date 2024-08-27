import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { GET_INVESTMENTS } from '../graphql/queries';

const InvestmentPortfolio = () => {
  const { loading, error, data } = useQuery(GET_INVESTMENTS);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  // Check if data and getInvestments exist before calculating totalValue
  const totalValue = data?.getInvestments
    ? data.getInvestments.reduce((sum, investment) => sum + (investment.currentValue || 0), 0)
    : 0;

  return (
    <>
      <Typography variant="h6" gutterBottom>Investment Portfolio</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Value: ${totalValue.toFixed(2)}
      </Typography>
      <List>
        {data?.getInvestments?.map((investment) => (
          <ListItem key={investment.id}>
            <ListItemText 
              primary={investment.type} 
              secondary={`Initial: $${investment.amount?.toFixed(2) || '0.00'} | Current: $${investment.currentValue?.toFixed(2) || '0.00'}`} 
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default InvestmentPortfolio;