import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, Button, Grid, Container, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';
import ChartIcon from '@mui/icons-material/InsertChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useAuth } from '../context/AuthContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  borderRadius: '20px',
  padding: theme.spacing(12, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)',
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[4],
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  marginLeft: '300px',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
  },
  transition: 'all 0.3s ease',
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const InfoParagraph = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  opacity: 0.5,
  animation: '$float 6s ease-in-out infinite',
  '&:nth-of-type(1)': { top: '10%', left: '5%', animationDelay: '0s' },
  '&:nth-of-type(2)': { top: '20%', right: '10%', animationDelay: '2s' },
  '&:nth-of-type(3)': { bottom: '15%', left: '15%', animationDelay: '4s' },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: AccountBalanceWalletIcon, title: 'Expense Tracking', description: 'Easily categorize and monitor your daily expenses' },
    { icon: TimelineIcon, title: 'Budget Planning', description: 'Set personalized budgets and track your progress' },
    { icon: ChartIcon, title: 'Financial Insights', description: 'Gain valuable insights into your spending habits' },
    { icon: SecurityIcon, title: 'Secure & Private', description: 'Your financial data is encrypted and protected' },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection>
          <FloatingIcon>
            <MonetizationOnIcon sx={{ fontSize: 100 }} />
          </FloatingIcon>
          <FloatingIcon>
            <AccountBalanceWalletIcon sx={{ fontSize: 80 }} />
          </FloatingIcon>
          <FloatingIcon>
            <ChartIcon sx={{ fontSize: 120 }} />
          </FloatingIcon>
          <Container maxWidth="md">
            <HeroContent>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)', fontSize: { xs: '2rem', sm: '3rem', md: '4rem' } }}>
                Take Control of Your Finances
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4, maxWidth: '800px', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                Finance App helps you track expenses, plan budgets, and achieve your financial goals with ease. Easily connect with your bank accounts and start managing your money smarter.
              </Typography>
              <StyledButton 
                variant="contained" 
                size="large" 
                onClick={handleGetStarted}
                startIcon={<AccountBalanceWalletIcon />}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </StyledButton>
            </HeroContent>
          </Container>
        </HeroSection>

        <StyledContainer maxWidth="lg">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard elevation={2}>
                  <FeatureIcon>
                    <feature.icon fontSize="inherit" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>

          <InfoCard elevation={3}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" align="center" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              Why Choose Finance App?
            </Typography>
            <InfoParagraph>
              Finance App is designed to simplify your financial life. Whether you're saving for a big purchase, 
              trying to stick to a budget, or just want to understand your spending habits better, we've got you covered. 
              Our intuitive interface and powerful features make managing your money easier than ever.
            </InfoParagraph>
            <InfoParagraph>
              Start your journey to financial wellness today. It's free to sign up, and you can connect your accounts 
              in minutes to get a comprehensive view of your finances. With Finance App, you'll have the tools and insights 
              you need to make informed decisions and reach your financial goals faster.
            </InfoParagraph>
          </InfoCard>
        </StyledContainer>
      </Box>
    </Box>
  );
};

export default HomePage;