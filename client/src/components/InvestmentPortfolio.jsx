import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, List, ListItem, ListItemText, CircularProgress, Box, Paper, Divider, useTheme, useMediaQuery } from '@mui/material';
import { GET_INVESTMENTS } from '../graphql/queries';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const InvestmentPortfolio = () => {
  const { loading, error, data } = useQuery(GET_INVESTMENTS);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
      <Typography variant="h6">Error loading investments</Typography>
      <Typography>{error.message}</Typography>
    </Paper>
  );

  const totalValue = data?.getInvestments
    ? data.getInvestments.reduce((sum, investment) => sum + (investment.currentValue || 0), 0)
    : 0;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <AccountBalanceIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" color="primary">Investment Portfolio</Typography>
      </Box>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="success.main">
        Total Value: ${totalValue.toFixed(2)}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        {data?.getInvestments?.map((investment, index) => (
          <React.Fragment key={investment.id}>
            <ListItem alignItems="flex-start" sx={{ py: 2 }}>
              <ListItemText 
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {investment.type}
                  </Typography>
                }
                secondary={
                  <Box mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Initial Investment: <Typography component="span" variant="body2" fontWeight="bold" color="primary.main">
                        ${investment.amount?.toFixed(2) || '0.00'}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Value: <Typography component="span" variant="body2" fontWeight="bold" color="success.main">
                        ${investment.currentValue?.toFixed(2) || '0.00'}
                      </Typography>
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < data.getInvestments.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default InvestmentPortfolio;