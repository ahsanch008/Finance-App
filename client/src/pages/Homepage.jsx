import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Button, Grid, Container, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';

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
  featureIcon: {
    fontSize: 48,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    { icon: AccountBalanceWalletIcon, title: 'Expense Tracking', description: 'Easily track and categorize your expenses' },
    { icon: TimelineIcon, title: 'Budget Planning', description: 'Set and manage budgets to reach your financial goals' },
    { icon: SecurityIcon, title: 'Secure & Private', description: 'Your financial data is encrypted and secure' },
  ];

  return (
    <StyledContainer>
      <Box className="root">
        <Header />
        <main className="content">
          <Box className="hero">
            <Container className="heroContent">
              <Typography component="h1" variant="h2" gutterBottom fontWeight="bold">
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
            <Container>
              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                      <feature.icon className="featureIcon" />
                      <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </main>
        <Footer />
      </Box>
    </StyledContainer>
  );
};

export default HomePage;