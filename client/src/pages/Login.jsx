import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Typography, Container, Box } from '@mui/material';
import { gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';

const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($token: String!) {
    googleLogin(token: $token) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [googleLoginMutation] = useMutation(GOOGLE_LOGIN_MUTATION);

  const [googleLoginStarted, setGoogleLoginStarted] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setGoogleLoginStarted(false);
      try {
        console.log('Google login success, token:', codeResponse.access_token);
        const { data } = await googleLoginMutation({ 
          variables: { token: codeResponse.access_token }
        });
        console.log('Google login mutation response:', data);
        if (data && data.googleLogin && data.googleLogin.token) {
          console.log('Google login mutation successful');
          login(data.googleLogin.token);
          navigate('/dashboard');
        } else {
          console.error('Unexpected response from googleLogin mutation:', data);
          setError('Unexpected response from server. Please try again.');
        }
      } catch (err) {
        console.error('Google login mutation error:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
        if (err.graphQLErrors) {
          console.error('GraphQL errors:', err.graphQLErrors);
          const errorMessage = err.graphQLErrors[0]?.message || 'Unknown error';
          setError(`Google login failed: ${errorMessage}. Please try again or contact support.`);
        } else if (err.networkError) {
          console.error('Network error:', err.networkError);
          setError('Network error occurred. Please check your internet connection and try again.');
        } else {
          setError('An unexpected error occurred. Please try again or contact support.');
        }
      }
    },
    onError: (errorResponse) => {
      setGoogleLoginStarted(false);
      console.error('Google login error:', errorResponse);
      setError('Google login failed. Please try again or contact support.');
    },
    onNonOAuthError: (nonOAuthError) => {
      setGoogleLoginStarted(false);
      console.error('Non-OAuth error:', nonOAuthError);
      setError('An error occurred during login. Please try again.');
    }
  });

  useEffect(() => {
    if (googleLoginStarted) {
      const checkPopupClosed = setInterval(() => {
        if (!window.opener || window.opener.closed) {
          setGoogleLoginStarted(false);
          clearInterval(checkPopupClosed);
        }
      }, 1000);

      return () => clearInterval(checkPopupClosed);
    }
  }, [googleLoginStarted]);

  const handleGoogleLogin = () => {
    setGoogleLoginStarted(true);
    googleLogin();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleGoogleLogin}
            disabled={googleLoginStarted}
          >
            {googleLoginStarted ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </Box>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Login;