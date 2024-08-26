import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries';
import { CREATE_TRANSACTION } from '../graphql/mutations';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const TransactionsPage = () => {
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ amount: '', category: '', description: '' });
  const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS);
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
      refetch();
      handleClose();
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Transactions</Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Transaction
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell align="right">${transaction.amount.toFixed(2)}</TableCell>
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
    </div>
  );
};

export default TransactionsPage;