import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, GET_MONTHLY_REPORT } from '../graphql/queries';
import { UPDATE_USER_PROFILE } from '../graphql/mutations';
import { Typography, Paper, Grid, TextField, Button, Box, Avatar, Divider, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  if (userLoading || summaryLoading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (userError) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {userError.message}</Typography>;
  if (summaryError) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error loading summary: {summaryError.message}</Typography>;

  const handleEdit = () => setIsEditing(true);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '600px', margin: '20px auto', borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: theme.palette.primary.main }}>
          {formData.name ? formData.name[0].toUpperCase() : 'U'}
        </Avatar>
        <Typography variant="h4" fontWeight="bold" color="primary">
          User Profile
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
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
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color={isEditing ? "success" : "primary"}
            onClick={isEditing ? handleSubmit : handleEdit}
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            fullWidth={isMobile}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Grid>
      </Grid>

      {/* Monthly Summary Section */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Monthly Summary: {currentMonth.toString().padStart(2, '0')}/{currentYear}
        </Typography>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
          <Grid container spacing={2}>
            {[
              { label: 'Total Income', value: summaryData.getMonthlyReport.totalIncome, color: 'success.main' },
              { label: 'Total Expenses', value: summaryData.getMonthlyReport.totalExpenses, color: 'error.main' },
              { label: 'Net Savings', value: summaryData.getMonthlyReport.netSavings, color: 'info.main' }
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box textAlign="center">
                  <Typography variant="subtitle1" fontWeight="medium">{item.label}</Typography>
                  <Typography variant="h6" fontWeight="bold" color={item.color}>
                    ${item.value.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Paper>
  );
};

export default Profile;