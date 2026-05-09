import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Alert,
} from '@mui/material';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';

export default function SellingPriceDialog({ open, onClose, onConfirm, finishedGood }) {
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const price = parseFloat(sellingPrice);
    
    if (!sellingPrice || isNaN(price) || price <= 0) {
      setError('Please enter a valid selling price greater than 0');
      return;
    }

    if (price < finishedGood.unitCost) {
      setError(`Warning: Selling price is below unit cost ($${finishedGood.unitCost.toFixed(2)})`);
      // Allow to continue but show warning
    }

    onConfirm(price);
    setSellingPrice('');
    setError('');
  };

  const handleClose = () => {
    setSellingPrice('');
    setError('');
    onClose();
  };

  const profitMargin = sellingPrice && !isNaN(parseFloat(sellingPrice))
    ? ((parseFloat(sellingPrice) - finishedGood.unitCost) / parseFloat(sellingPrice) * 100).toFixed(2)
    : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600 }}>
        Set Selling Price for Inventory
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {finishedGood?.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Batch: {finishedGood?.batchNo}
          </Typography>
        </Box>

        <Box sx={{ bgcolor: '#f0fdfa', p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Quantity:</strong> {finishedGood?.quantityCompleted?.toLocaleString()} units
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Unit Cost:</strong> ${finishedGood?.unitCost?.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            <strong>Total Cost:</strong> ${finishedGood?.totalCost?.toFixed(2)}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Selling Price per Unit"
          type="number"
          value={sellingPrice}
          onChange={(e) => {
            setSellingPrice(e.target.value);
            setError('');
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MoneyIcon sx={{ color: '#0d9488' }} />
              </InputAdornment>
            ),
          }}
          placeholder="Enter selling price"
          autoFocus
          sx={{ mb: 2 }}
        />

        {sellingPrice && !isNaN(parseFloat(sellingPrice)) && parseFloat(sellingPrice) > 0 && (
          <Box sx={{ bgcolor: '#f0f9ff', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Profit per Unit:</strong> ${(parseFloat(sellingPrice) - finishedGood.unitCost).toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Profit Margin:</strong> {profitMargin}%
            </Typography>
            <Typography variant="body2">
              <strong>Total Revenue:</strong> ${(parseFloat(sellingPrice) * finishedGood.quantityCompleted).toFixed(2)}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity={error.includes('Warning') ? 'warning' : 'error'} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
          This selling price will be set for the product in inventory and used for sales transactions.
          <br />
          <strong>Store Category:</strong> Finished Products
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#f9fafb' }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            bgcolor: '#0d9488',
            '&:hover': { bgcolor: '#0f766e' },
          }}
        >
          Confirm & Migrate to Inventory
        </Button>
      </DialogActions>
    </Dialog>
  );
}
