import React from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Button,
  TextField,
  Grid,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';

const HelpSupport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const faqs = [
    { 
      question: 'How do I link my bank account?', 
      answer: 'To link your bank account, go to the Accounts page and click on "Add Account". Follow the prompts to securely connect your bank using our trusted partner, Plaid.'
    },
    { 
      question: 'Is my financial data secure?', 
      answer: 'Yes, we take security very seriously. We use bank-level encryption to protect your data and never store your bank credentials.'
    },
    { 
      question: 'How do I create a budget?', 
      answer: 'Navigate to the Budgets page and click on "Create New Budget". You can set spending limits for various categories and track your progress throughout the month.'
    },
    { 
      question: 'Can I export my financial data?', 
      answer: 'Yes, you can export your transaction history and financial reports. Go to the Reports page and look for the "Export" option.'
    },
  ];

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary" textAlign="center">
          Help & Support
        </Typography>
        
        <Typography variant="h5" gutterBottom mt={4} fontWeight="medium" color="text.secondary">
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: 1 }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                '&.Mui-expanded': { 
                  minHeight: 48,
                  bgcolor: 'primary.light',
                },
              }}
            >
              <Typography fontWeight="medium">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box mt={6}>
          <Typography variant="h5" gutterBottom fontWeight="medium" color="text.secondary">
            Can't find what you're looking for?
          </Typography>
          <Typography gutterBottom variant="body1">
            Our support team is here to help. Choose your preferred method of contact:
          </Typography>
          
          <Grid container spacing={3} mt={2}>
            {[
              { icon: EmailIcon, title: 'Email Support', action: 'Contact Us', href: 'mailto:support@financeapp.com' },
              { icon: ChatIcon, title: 'Live Chat', action: 'Start Chat' },
              { icon: PhoneIcon, title: 'Phone Support', phone: '1-800-123-4567', hours: 'Mon-Fri, 9am-5pm EST' }
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <item.icon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" fontWeight="medium">{item.title}</Typography>
                    {item.phone && (
                      <>
                        <Typography variant="body1" mt={1}>{item.phone}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.hours}</Typography>
                      </>
                    )}
                  </Box>
                  {item.action && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      href={item.href}
                      sx={{ mt: 2, alignSelf: 'center' }}
                    >
                      {item.action}
                    </Button>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={6}>
          <Typography variant="h5" gutterBottom fontWeight="medium" color="text.secondary">
            Send us a message
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <form>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Message"
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                fullWidth={isMobile}
              >
                Send Message
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default HelpSupport;