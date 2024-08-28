import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { GET_PLAID_LINK_TOKEN } from '../graphql/queries';
import { EXCHANGE_PLAID_PUBLIC_TOKEN } from '../graphql/mutations';
import Cookies from 'js-cookie';

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const { loading, error, data } = useQuery(GET_PLAID_LINK_TOKEN);
  const [exchangePublicToken] = useMutation(EXCHANGE_PLAID_PUBLIC_TOKEN);
  const [linkStatus, setLinkStatus] = useState('');
  const [isLinkOpening, setIsLinkOpening] = useState(false);

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
        console.log('Exchange result:', data);
        if (data.exchangePlaidPublicToken.success) {
          Cookies.set('plaidAccessToken', data.exchangePlaidPublicToken.accessToken, { 
            expires: 30, 
            secure: true 
          });
          console.log('Account successfully linked!', data);
          setLinkStatus('Account successfully linked!');
        } else {
          setLinkStatus('Error linking account. Please try again.');
        }
        setIsLinkOpening(false);
      } catch (error) {
        console.error('Error exchanging public token:', error);
        setLinkStatus('Error linking account. Please try again.');
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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box>
      <Button 
        onClick={handleOpen} 
        disabled={!ready || isLinkOpening} 
        variant="contained" 
        color="primary"
        sx={{ mb: 2 }}
      >
        {Cookies.get('plaidAccessToken') ? 'Update Plaid Link' : 'Link Bank Account'}
      </Button>
      {linkStatus && (
        <Typography color={linkStatus.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {linkStatus}
        </Typography>
      )}
      <Typography variant="body2">
        {Cookies.get('plaidAccessToken') 
          ? 'Your Plaid account is linked. Click the button above to update or relink.'
          : 'Click to link a Bank Account and view updated real time data.'}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Note: No Bank Account is linked. Please link your account to view updated transactions and summary.
      </Typography>
    </Box>
  );
};

export default PlaidLink;