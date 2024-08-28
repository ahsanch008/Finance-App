import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Button, Grid, Container, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const StyledContainer = styled('div')(({ theme }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  hero: {
    backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: theme.palette.common.white,
    padding: theme.spacing(12, 0, 10),
  },
  heroContent: {
    maxWidth: 700,
    margin: '0 auto',
    textAlign: 'center',
  },
  heroButtons: {
    marginTop: theme.spacing(6),
  },
  features: {
    padding: theme.spacing(10, 0),
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    flexGrow: 1,
  },
}));

const HomePage = () => {
  return (
    <StyledContainer>
      <Box className="root">
        <Header />
        <main className="content">
          <Box className="hero">
            <Container className="heroContent">
              <Typography component="h1" variant="h2" gutterBottom>
                Welcome to Finance App
              </Typography>
              <Typography variant="h5" paragraph>
                Manage your finances with ease. Track expenses, set budgets, and achieve your financial goals.
              </Typography>
              <Box className="heroButtons">
                <Grid container spacing={3} justifyContent="center">
                  <Grid item>
                    <Button variant="contained" size="large" component={Link} to="/login"
                      sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: 'grey.100' } }}>
                      Get Started
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" size="large" component={Link} to="/login"
                      sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.300', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Box>
          <Box className="features">
            {/* Add feature section content here */}
          </Box>
        </main>
        <Footer />
      </Box>
    </StyledContainer>
  );
};

export default HomePage;