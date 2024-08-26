import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

const Register = () => {
  const navigate = useNavigate();

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
          Register
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
          To register, please sign in with Google:
        </Typography>
        <Login />
      </Box>
    </Container>
  );
};

export default Register;