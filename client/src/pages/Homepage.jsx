import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Button, Grid, Container } from '@mui/material';
import Header from '../components/Header';
import Si from '../components/Footer';

const StyledContainer = styled('div')(({ theme }) => ({
  hero: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    textAlign: 'center',
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  features: {
    padding: theme.spacing(8, 0),
  },
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const HomePage = () => {
 

  return (
    <StyledContainer>
      <Header />
      <main>
        <div className="hero">
          <Container className="heroContent">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Welcome to Finance App
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Manage your finances with ease. Track expenses, set budgets, and achieve your financial goals.
            </Typography>
            <div className="heroButtons">
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" component={Link} to="/register">
                    Get Started
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" component={Link} to="/login">
                    Login
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        {/* Add more sections as needed */}
      </main>
  
    </StyledContainer>
  );
};

export default HomePage;