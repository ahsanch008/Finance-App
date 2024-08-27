import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3, 0),
  marginTop: 'auto', // This pushes the footer to the bottom
  width: '100%',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" align="center" sx={{ mb: { xs: 2, sm: 0 } }}>
              © {new Date().getFullYear()} Finance App. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <FooterLink href="/privacy" sx={{ mr: 2 }}>
                Privacy Policy
              </FooterLink>
              <FooterLink href="/terms">
                Terms of Service
              </FooterLink>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </StyledFooter>
  );
};

export default Footer;