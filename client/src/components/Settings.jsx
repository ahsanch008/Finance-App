import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../graphql/queries';
import { UPDATE_USER_PROFILE, CHANGE_PASSWORD } from '../graphql/mutations';
import { Typography, Paper, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Box, Divider, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import SecurityIcon from '@mui/icons-material/Security';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LockIcon from '@mui/icons-material/Lock';

const Settings = () => {
  const [userId, setUserId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    if (data && data.me) {
      setName(data.me.name);
      setEmail(data.me.email);
    }
  }, [data]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ variables: { name } });
      setUpdateStatus({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateStatus({ type: 'error', message: 'Error updating profile' });
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword({ variables: { currentPassword, newPassword } });
      setUpdateStatus({ type: 'success', message: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setUpdateStatus({ type: 'error', message: 'Error changing password' });
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handlePrivacyToggle = () => {
    setPrivacyEnabled(!privacyEnabled);
  };

  const handleExportData = () => {
    setUpdateStatus({ type: 'info', message: 'Your data export has been initiated. You will receive an email with the download link shortly.' });
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <SettingsIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
        <Typography variant="h4" color="primary">Settings</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        </Grid>

        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mb={1}>
            <LanguageIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Language Preference</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              onChange={handleLanguageChange}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mb={1}>
            <SecurityIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Privacy Settings</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={privacyEnabled}
                onChange={handlePrivacyToggle}
                color="primary"
              />
            }
            label="Enable enhanced privacy mode"
          />
        </Grid>

        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mb={1}>
            <CloudDownloadIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Export Data</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={handleExportData} startIcon={<CloudDownloadIcon />}>
            Export My Data
          </Button>
        </Grid>

        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mb={1}>
            <LockIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Change Password</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleChangePassword}>
            Change Password
          </Button>
        </Grid>
      </Grid>
      {updateStatus && (
        <Alert severity={updateStatus.type} sx={{ mt: 2 }}>
          {updateStatus.message}
        </Alert>
      )}
    </Paper>
  );
};

export default Settings;