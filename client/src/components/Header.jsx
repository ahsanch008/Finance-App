import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Modal, TextField, Divider, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';
import { GOOGLE_LOGIN_MUTATION, LOGIN_MUTATION } from '../graphql/mutations';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: 400,
}));

const Header = ({ open, handleDrawerOpen }) => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [googleLoginMutation] = useMutation(GOOGLE_LOGIN_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.login && data.login.token) {
        login(data.login.token, data.login.user);
        handleLoginModalClose();
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const { data } = await googleLoginMutation({ 
          variables: { token: codeResponse.access_token }
        });
        if (data && data.googleLogin && data.googleLogin.token) {
          login(data.googleLogin.token, data.googleLogin.user);
          handleLoginModalClose();
          navigate('/dashboard');
        } else {
          setError('Unexpected response from server. Please try again.');
        }
      } catch (err) {
        console.error('Google login error:', err);
        setError('Google login failed. Please try again or contact support.');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again or contact support.');
    }
  });

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Finance App
          </Typography>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user && user.name && (
                <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
              )}
              <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleLoginModalOpen}>Login</Button>
          )}
        </Toolbar>
      </StyledAppBar>

      <StyledModal
        open={loginModalOpen}
        onClose={handleLoginModalClose}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <ModalContent>
          <Typography id="login-modal-title" variant="h6" component="h2" align="center" gutterBottom>
            Sign in
          </Typography>
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
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => googleLogin()}
          >
            Sign in with Google
          </Button>
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </ModalContent>
      </StyledModal>
    </>
  );
};

export default Header;