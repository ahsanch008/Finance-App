import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, GET_MONTHLY_REPORT } from '../graphql/queries';
import { UPDATE_USER_PROFILE } from '../graphql/mutations';
import { Typography, Paper, Grid, TextField, Button, Box } from '@mui/material';

const Profile = () => {
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_ME);
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Get current month and year for the monthly summary
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear();

  const { loading: summaryLoading, error: summaryError, data: summaryData } = useQuery(GET_MONTHLY_REPORT, {
    variables: { month: currentMonth, year: currentYear },
  });

  useEffect(() => {
    if (userData && userData.me) {
      setFormData({
        name: userData.me.name,
        email: userData.me.email,
      });
    }
  }, [userData]);

  if (userLoading || summaryLoading) return <Typography>Loading...</Typography>;
  if (userError) return <Typography color="error">Error: {userError.message}</Typography>;
  if (summaryError) return <Typography color="error">Error loading summary: {summaryError.message}</Typography>;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ variables: { input: formData } });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Monthly Summary Section */}
      <Box mt={4}>
        <Typography variant="h5 mr-2" gutterBottom>
          Monthly Summary     : 0{currentMonth}/{currentYear}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total Income:</Typography>
            <Typography>${summaryData.getMonthlyReport.totalIncome.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total Expenses:</Typography>
            <Typography>${summaryData.getMonthlyReport.totalExpenses.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Net Savings:</Typography>
            <Typography>${summaryData.getMonthlyReport.netSavings.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Profile;