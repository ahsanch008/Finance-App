import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PLAID_ACCOUNTS } from '../graphql/queries';
import { Typography, List, ListItem, ListItemText, CircularProgress, Box, Paper, Divider, useTheme, useMediaQuery } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const AccountBalances = () => {
  const { loading, error, data } = useQuery(GET_PLAID_ACCOUNTS);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
      <Typography variant="h6">Error loading accounts</Typography>
      <Typography>{error.message}</Typography>
    </Paper>
  );

  if (!data.getPlaidAccounts || data.getPlaidAccounts.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">Linked Accounts</Typography>
        <Typography>No accounts linked yet. Use the "Connect a bank account" button to link an account.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <AccountBalanceIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" color="primary">Linked Accounts</Typography>
      </Box>
      <List>
        {data.getPlaidAccounts.map((account, index) => (
          <React.Fragment key={account.id}>
            <ListItem alignItems="flex-start" sx={{ py: 2 }}>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {account.name} <Typography component="span" variant="body2" color="text.secondary">(*{account.mask})</Typography>
                  </Typography>
                }
                secondary={
                  <Box mt={1}>
                    <Typography variant="body2" color="text.primary">
                      Balance: <Typography component="span" variant="body1" fontWeight="bold" color="primary.main">
                        ${account.balances.current.toFixed(2)}
                      </Typography> {account.balances.isoCurrencyCode}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < data.getPlaidAccounts.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default AccountBalances;