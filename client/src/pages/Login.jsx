import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Typography, Container, Box, TextField } from '@mui/material';
import { GOOGLE_LOGIN_MUTATION, LOGIN_MUTATION } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [googleLoginMutation] = useMutation(GOOGLE_LOGIN_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const [googleLoginStarted, setGoogleLoginStarted] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoginStarted(true);
    googleLogin();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setGoogleLoginStarted(false);
      console.log('Google login response:', codeResponse);
      try {
        console.log('Sending token to server:', codeResponse.access_token);
        const { data } = await googleLoginMutation({ 
          variables: { token: codeResponse.access_token }
        });
        console.log('Server response:', data);
        if (data && data.googleLogin && data.googleLogin.token) {
          login(data.googleLogin.token, data.googleLogin.user);
          navigate('/dashboard');
        } else {
          console.error('Unexpected server response:', data);
          setError('Unexpected response from server. Please try again.');
        }
      } catch (err) {
        console.error('Google login error:', err);
        if (err.graphQLErrors) {
          console.error('GraphQL errors:', err.graphQLErrors);
        }
        if (err.networkError) {
          console.error('Network error:', err.networkError);
        }
        setError('Google login failed. Please try again or contact support.');
      }
    },
    onError: (error) => {
      setGoogleLoginStarted(false);
      console.error('Google login error:', error);
      setError('Google login failed. Please try again or contact support.');
    }
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.login && data.login.token) {
        login(data.login.token);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <Box component="form" onSubmit={handleEmailLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
          onClick={handleGoogleLogin}
          disabled={googleLoginStarted}
        >
          {googleLoginStarted ? 'Signing in...' : 'Sign in with Google'}
        </Button>
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