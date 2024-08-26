import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNTS } from '../graphql/queries';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Accounts = () => {
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Accounts</Typography>
      <Paper>
        <List>
          {data.accounts.map((account) => (
            <ListItem key={account.id}>
              <ListItemText
                primary={account.name}
                secondary={`Type: ${account.type}, Balance: $${account.balance.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default Accounts;