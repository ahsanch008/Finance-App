import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PLAID_ACCOUNTS } from '../graphql/queries';
import { Typography, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';

const AccountBalances = () => {
  const { loading, error, data } = useQuery(GET_PLAID_ACCOUNTS);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading accounts: {error.message}</Typography>;

  if (!data.getPlaidAccounts || data.getPlaidAccounts.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Linked Accounts</Typography>
        <Typography>No accounts linked yet. Use the "Connect a bank account" button to link an account.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Linked Accounts</Typography>
      <List>
        {data.getPlaidAccounts.map((account) => (
          <ListItem key={account.id}>
            <ListItemText
              primary={`${account.name} (${account.mask})`}
              secondary={`Balance: $${account.balances.current.toFixed(2)} ${account.balances.isoCurrencyCode}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AccountBalances;