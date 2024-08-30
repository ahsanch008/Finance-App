import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 0),
  marginTop: 'auto',
  width: '100%',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth={false}>
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" align="center" sx={{ mb: { xs: 2, sm: 0 } }}>
              © {new Date().getFullYear()} Finance App. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <FooterLink href="/privacy" sx={{ mr: 2 }}>
                Privacy Policy
              </FooterLink>
              <FooterLink href="/terms" sx={{ mr: 2 }}>
                Terms of Service
              </FooterLink>
              <FooterLink href="/contact">
                Contact Us
              </FooterLink>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <SocialIcon aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon aria-label="Twitter" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon aria-label="LinkedIn" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
              </SocialIcon>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </StyledFooter>
  );
};

export default Footer;