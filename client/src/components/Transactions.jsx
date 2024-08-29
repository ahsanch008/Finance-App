import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRANSACTIONS, GET_PLAID_TRANSACTIONS } from '../graphql/queries';
import { CREATE_TRANSACTION } from '../graphql/mutations';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Transactions = () => {
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ amount: '', category: '', description: '' });
  const { loading: manualLoading, error: manualError, data: manualData, refetch: refetchManual } = useQuery(GET_TRANSACTIONS);
  const { loading: plaidLoading, error: plaidError, data: plaidData } = useQuery(GET_PLAID_TRANSACTIONS, {
    variables: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      endDate: new Date().toISOString().split('T')[0], // today
    },
  });
  const [createTransaction] = useMutation(CREATE_TRANSACTION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTransaction({ amount: '', category: '', description: '' });
  };

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createTransaction({ 
        variables: { 
          input: {
            ...newTransaction,
            amount: parseFloat(newTransaction.amount),
            date: new Date().toISOString()
          } 
        } 
      });
      refetchManual();
      handleClose();
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  if (manualLoading || plaidLoading) return <Box display="flex" justifyContent="center" alignItems="center" height="200px"><CircularProgress /></Box>;
  if (manualError || plaidError) return <Alert severity="error">Error loading transactions: {manualError?.message || plaidError?.message}</Alert>;

  const allTransactions = [
    ...(manualData?.getTransactions || []),
    ...(plaidData?.getPlaidTransactions || []),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transactions</Typography>
        <Tooltip title="Add Manual Transaction">
          <IconButton color="primary" onClick={handleClickOpen}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTransactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description || transaction.name}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell align="right" sx={{ color: transaction.amount < 0 ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Tooltip title={transaction.accountId ? 'Plaid Transaction' : 'Manual Transaction'}>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReceiptIcon sx={{ mr: 1, color: transaction.accountId ? 'primary.main' : 'secondary.main' }} />
                      {transaction.accountId ? 'Plaid' : 'Manual'}
                    </Box>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={newTransaction.amount}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={newTransaction.category}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newTransaction.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;