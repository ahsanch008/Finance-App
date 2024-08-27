import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../graphql/queries';
import { UPDATE_USER_PROFILE, CHANGE_PASSWORD } from '../graphql/mutations';
import { Typography, Paper, Grid, TextField, Button } from '@mui/material';

const Settings = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { id: userId },
    skip: !userId, // Skip the query if userId is not available
  });
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  React.useEffect(() => {
    if (data && data.me) {
      setName(data.me.name);
      setEmail(data.me.email);
    }
  }, [data]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ variables: { name } });
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile');
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword({ variables: { currentPassword, newPassword } });
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Error changing password');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
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
        <Grid item xs={12}>
          <Typography variant="h6">Change Password</Typography>
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
    </Paper>
  );
};

export default Settings;