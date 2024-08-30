import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Typography, Box, CircularProgress, Paper, Alert, useTheme, useMediaQuery } from '@mui/material';
import { GET_PLAID_LINK_TOKEN } from '../graphql/queries';
import { EXCHANGE_PLAID_PUBLIC_TOKEN } from '../graphql/mutations';
import Cookies from 'js-cookie';
import LinkIcon from '@mui/icons-material/Link';
import UpdateIcon from '@mui/icons-material/Update';

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const { loading, error, data } = useQuery(GET_PLAID_LINK_TOKEN);
  const [exchangePublicToken] = useMutation(EXCHANGE_PLAID_PUBLIC_TOKEN);
  const [linkStatus, setLinkStatus] = useState('');
  const [isLinkOpening, setIsLinkOpening] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (data?.getPlaidLinkToken) {
      setLinkToken(data.getPlaidLinkToken);
    }
  }, [data]);

  const onSuccess = useCallback(
    async (public_token, metadata) => {
      try {
        const { data } = await exchangePublicToken({ 
          variables: { publicToken: public_token }
        });
        if (data.exchangePlaidPublicToken.success) {
          Cookies.set('plaidAccessToken', data.exchangePlaidPublicToken.accessToken, { 
            expires: 30, 
            secure: true 
          });
          setLinkStatus('success');
        } else {
          setLinkStatus('error');
        }
        setIsLinkOpening(false);
      } catch (error) {
        console.error('Error exchanging public token:', error);
        setLinkStatus('error');
        setIsLinkOpening(false);
      }
    },
    [exchangePublicToken]
  );

  const config = {
    token: linkToken,
    onSuccess,
    onExit: () => {
      setIsLinkOpening(false);
      setLinkStatus('');
    },
  };

  const { open, ready } = usePlaidLink(config);

  const handleOpen = () => {
    if (!isLinkOpening && ready) {
      setIsLinkOpening(true);
      open();
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ mt: 2 }}>
      Error: {error.message}
    </Alert>
  );

  const isLinked = Cookies.get('plaidAccessToken');

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, margin: 'auto', mt: 6 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button 
          onClick={handleOpen} 
          disabled={!ready || isLinkOpening} 
          variant="contained" 
          color="primary"
          startIcon={isLinked ? <UpdateIcon /> : <LinkIcon />}
          sx={{ mb: 2, width: isMobile ? '100%' : 'auto' }}
        >
          {isLinked ? 'Update Plaid Link' : 'Link Bank Account'}
        </Button>
        {linkStatus && (
          <Alert severity={linkStatus} sx={{ mb: 2, width: '100%' }}>
            {linkStatus === 'success' ? 'Account successfully linked!' : 'Error linking account. Please try again.'}
          </Alert>
        )}
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          {isLinked 
            ? 'Your Plaid account is linked. Click the button above to update or relink.'
            : 'Click to link a Bank Account and view updated real time data.'}
        </Typography>
        {!isLinked && (
          <Alert severity="info" sx={{ width: '100%' }}>
            No Bank Account is linked. Please link your account to view updated transactions and summary.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default PlaidLink;