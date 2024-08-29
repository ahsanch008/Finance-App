import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Typography, Container, Box, TextField, Paper, Divider, CircularProgress, Link } from '@mui/material';
import { GOOGLE_LOGIN_MUTATION, LOGIN_MUTATION } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [googleLoginMutation] = useMutation(GOOGLE_LOGIN_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        const { data } = await googleLoginMutation({ 
          variables: { token: codeResponse.access_token }
        });
        if (data && data.googleLogin && data.googleLogin.token) {
          login(data.googleLogin.token, data.googleLogin.user);
          navigate('/dashboard');
        } else {
          setError('Unexpected response from server. Please try again.');
        }
      } catch (err) {
        console.error('Google login error:', err);
        setError('Google login failed. Please try again or contact support.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again or contact support.');
      setIsLoading(false);
    }
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.login && data.login.token) {
        login(data.login.token, data.login.user);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
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
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <LockOutlinedIcon sx={{ m: 1, bgcolor: 'secondary.main', color: 'white', borderRadius: '50%', p: 1 }} />
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
          </Box>
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
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
          >
            Sign in with Google
          </Button>
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;