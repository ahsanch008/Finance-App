import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Switch, 
  FormControlLabel, 
  Button, 
  TextField,
  Box
} from '@mui/material';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [currency, setCurrency] = useState('USD');

  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
    // Here you would typically update this setting in your app's state or localStorage
  };

  const handleEmailNotificationsChange = (event) => {
    setEmailNotifications(event.target.checked);
    // Here you would typically update this setting in your backend
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    // Here you would typically update this setting in your backend
  };

  const handleSave = () => {
    // Here you would typically send these settings to your backend
    console.log('Settings saved:', { darkMode, emailNotifications, currency });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={handleDarkModeChange}
              name="darkMode"
              color="primary"
            />
          }
          label="Dark Mode"
        />
        <Box my={2}>
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={handleEmailNotificationsChange}
                name="emailNotifications"
                color="primary"
              />
            }
            label="Email Notifications"
          />
        </Box>
        <Box my={2}>
          <TextField
            select
            label="Currency"
            value={currency}
            onChange={handleCurrencyChange}
            SelectProps={{
              native: true,
            }}
            fullWidth
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            {/* Add more currency options as needed */}
          </TextField>
        </Box>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;