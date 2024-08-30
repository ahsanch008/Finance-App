import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Modal, TextField, Divider, Avatar, Tooltip, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GoogleIcon from '@mui/icons-material/Google';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';
import { GOOGLE_LOGIN_MUTATION, LOGIN_MUTATION } from '../graphql/mutations';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(45deg, #6a11cb 30%, #8d4de2 90%)',
  color: theme.palette.primary.contrastText,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Header = ({ open, handleDrawerOpen, handleDrawerClose }) => {
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
  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
    setError('');
    setEmail('');
    setPassword('');
  };

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
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
          <AccountBalanceIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Finance App
          </Typography>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user && user.name && (
                <Tooltip title={user.name}>
                  <Avatar sx={{ mr: 2, bgcolor: 'secondary.main', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                    {user.name[0]}
                  </Avatar>
                </Tooltip>
              )}
              <StyledButton 
                color="inherit" 
                onClick={() => navigate('/profile')}
                sx={{ mr: 1 }}
                startIcon={<PersonIcon />}
              >
                Profile
              </StyledButton>
              <StyledButton 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </StyledButton>
            </Box>
          ) : (
            <StyledButton 
              color="inherit" 
              onClick={handleLoginModalOpen}
            >
              Login
            </StyledButton>
          )}
        </Toolbar>
      </StyledAppBar>

      <Modal
        open={loginModalOpen}
        onClose={handleLoginModalClose}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 0,
            borderRadius: 2,
            display: 'flex',
          }}
        >
          <Box
            sx={{
              flex: 1,
              bgcolor: 'primary.dark',
              color: 'primary.contrastText',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <AssuredWorkloadIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography component="h1" variant="h4" gutterBottom>
              Welcome to Finance App
            </Typography>
            <Typography variant="body1" paragraph>
              Join our community to manage your finances, track expenses, and achieve your financial goals.
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li">Track your expenses</Typography>
              <Typography component="li">Set and monitor budgets</Typography>
              <Typography component="li">Analyze your spending habits</Typography>
              <Typography component="li">Plan for your financial future</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography component="h2" variant="h5" align="center" gutterBottom>
              Log in to your account
            </Typography>
            <Button
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={() => googleLogin()}
              sx={{ mb: 2 }}
            >
              Continue with Google
            </Button>
            <Divider sx={{ my: 2 }}>OR</Divider>
            <Box component="form" onSubmit={handleEmailLogin} noValidate>
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
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Header;