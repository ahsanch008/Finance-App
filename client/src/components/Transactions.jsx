import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRANSACTIONS, GET_PLAID_TRANSACTIONS } from '../graphql/queries';
import { CREATE_TRANSACTION } from '../graphql/mutations';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';

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

  if (manualLoading || plaidLoading) return <Typography>Loading...</Typography>;
  if (manualError) return <Typography color="error">Error loading manual transactions: {manualError.message}</Typography>;
  if (plaidError) return <Typography color="error">Error loading Plaid transactions: {plaidError.message}</Typography>;

  const allTransactions = [
    ...(manualData?.getTransactions || []),
    ...(plaidData?.getPlaidTransactions || []),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Transactions</Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ mb: 2 }}>
        Add Manual Transaction
      </Button>
      <TableContainer component={Paper}>
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
              <TableRow key={transaction.id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description || transaction.name}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell align="right">${Math.abs(transaction.amount).toFixed(2)}</TableCell>
                <TableCell>{transaction.accountId ? 'Plaid' : 'Manual'}</TableCell>
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
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;