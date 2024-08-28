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
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';

const HelpSupport = () => {
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
        <Typography variant="h4" component="h1" gutterBottom>
          Help & Support
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Can't find what you're looking for?
          </Typography>
          <Typography gutterBottom>
            Our support team is here to help. Choose your preferred method of contact:
          </Typography>
          
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <EmailIcon color="primary" fontSize="large" />
                <Typography variant="h6" mt={1}>Email Support</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  href="mailto:support@financeapp.com"
                  sx={{ mt: 2 }}
                >
                  Contact Us
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <ChatIcon color="primary" fontSize="large" />
                <Typography variant="h6" mt={1}>Live Chat</Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Start Chat
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <PhoneIcon color="primary" fontSize="large" />
                <Typography variant="h6" mt={1}>Phone Support</Typography>
                <Typography variant="body1" mt={1}>1-800-123-4567</Typography>
                <Typography variant="body2">Mon-Fri, 9am-5pm EST</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Send us a message
          </Typography>
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
            >
              Send Message
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default HelpSupport;