import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { Typography, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';

const Accounts = () => {
  const { loading, error, data } = useQuery(GET_ME);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const user = data.me;

  return (
    <div>
      <Typography variant="h4" gutterBottom>User Account</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText primary="Name" secondary={user.name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Role" secondary={user.role} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email Verified" secondary={user.isEmailVerified ? 'Yes' : 'No'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Created At" secondary={new Date(user.createdAt).toLocaleString()} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Updated At" secondary={new Date(user.updatedAt).toLocaleString()} />
          </ListItem>
        </List>
      </Paper>
    </div>
  );
};

export default Accounts;