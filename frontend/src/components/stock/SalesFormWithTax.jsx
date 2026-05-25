import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography, Box, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import TaxSelector from './TaxSelector';
import axios from 'axios';

import { API_BASE_URL as API_URL } from '../../constants/api.js';

export default function SalesFormWithTax({ 
  open, 
  onClose, 
  onSave, 
  productSettings = [],
  accountSettings = []
}) {
  const [cartItems, setCartItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    discountType: 'Percentage',
    taxes: [],
    description: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [paymentAccountId, setPaymentAccountId] = useState('');
  const [revenueAccountId, setRevenueAccountId] = useState('');

  const handleProductChange = (productId) => {
    const product = productSettings.find(p => p.id === productId);
    if (!product) return;

    setCurrentItem({
      ...currentItem,
      productId: product.id,
      productName: product.name,
      unitPrice: product.defaultSellingPrice || 0,
      discount: product.defaultDiscount || 0,
      discountType: product.defaultDiscountType || 'Percentage',
      description: product.description || '',
    });

    // Auto-load taxes if configured
    if (product.taxId && !product.taxExempt) {
      fetchAndApplyTax(product.taxId, product.defaultSellingPrice * currentItem.quantity);
    } else if (product.taxGroupId && !product.taxExempt) {
      fetchAndApplyTaxGroup(product.taxGroupId, product.defaultSellingPrice * currentItem.quantity);
    }
  };

  const fetchAndApplyTax = async (taxId, amount) => {
    try {
      const token = localStorage.getItem('stockToken');
      const res = await axios.get(`${API_URL}/stock/taxes/${taxId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tax = res.data;
      
      const taxAmount = calculateTaxAmount(tax, amount);
      setCurrentItem(prev => ({
        ...prev,
        taxes: [{
          taxId: tax.id,
          taxName: tax.taxName,
          taxCode: tax.taxCode,
          taxType: tax.taxType,
          taxRate: tax.calculationType === 'Percentage' ? tax.rate : 0,
          taxableAmount: amount,
          taxAmount: taxAmount,
        }]
      }));
    } catch (err) {
      console.error('Error fetching tax:', err);
    }
  };

  const fetchAndApplyTaxGroup = async (groupId, amount) => {
    try {
      const token = localStorage.getItem('stockToken');
      const groupRes = await axios.get(`${API_URL}/stock/taxes/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const group = groupRes.data;
      
      const taxesRes = await axios.get(`${API_URL}/stock/taxes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allTaxes = taxesRes.data;
      
      const groupTaxes = allTaxes.filter(t => group.taxIds.includes(t.id));
      const taxesWithAmounts = groupTaxes.map(tax => ({
        taxId: tax.id,
        taxName: tax.taxName,
        taxCode: tax.taxCode,
        taxType: tax.taxType,
        taxRate: tax.calculationType === 'Percentage' ? tax.rate : 0,
        taxableAmount: amount,
        taxAmount: calculateTaxAmount(tax, amount),
      }));
      
      setCurrentItem(prev => ({
        ...prev,
        taxes: taxesWithAmounts
      }));
    } catch (err) {
      console.error('Error fetching tax group:', err);
    }
  };

  const calculateTaxAmount = (tax, amount) => {
    if (!tax || !tax.isActive) return 0;
    
    if (tax.calculationType === 'Fixed') {
      return Number(tax.fixedAmount) || 0;
    }
    
    const rate = Number(tax.rate) || 0;
    if (tax.priceType === 'Inclusive') {
      // For tax-inclusive prices: Tax = Amount - (Amount / (1 + rate/100))
      return amount - (amount / (1 + rate / 100));
    }
    
    // For tax-exclusive prices: Tax = Amount * (rate/100)
    return (amount * rate) / 100;
  };

  const calculateItemTotal = (item) => {
    const subtotal = Number(item.quantity) * Number(item.unitPrice);
    const discountAmount = item.discountType === 'Fixed' 
      ? Number(item.discount)
      : (subtotal * Number(item.discount)) / 100;
    const taxAmount = (item.taxes || []).reduce((sum, t) => sum + Number(t.taxAmount || 0), 0);
    
    return subtotal - discountAmount + taxAmount;
  };

  const handleAddToCart = () => {
    if (!currentItem.productId) {
      alert('Please select a product');
      return;
    }

    const itemWithTotal = {
      ...currentItem,
      totalPrice: calculateItemTotal(currentItem),
    };

    if (editingIndex !== null) {
      const updated = [...cartItems];
      updated[editingIndex] = itemWithTotal;
      setCartItems(updated);
      setEditingIndex(null);
    } else {
      setCartItems([...cartItems, itemWithTotal]);
    }

    // Reset form
    setCurrentItem({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'Percentage',
      taxes: [],
      description: '',
    });
  };

  const handleEditItem = (index) => {
    setCurrentItem(cartItems[index]);
    setEditingIndex(index);
  };

  const handleRemoveItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (cartItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    if (!paymentAccountId || !revenueAccountId) {
      alert('Please select payment and revenue accounts');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTax = cartItems.reduce((sum, item) => 
      sum + (item.taxes || []).reduce((taxSum, t) => taxSum + Number(t.taxAmount || 0), 0), 0
    );

    const saleData = {
      items: cartItems,
      totalPrice: totalAmount,
      totalTax: totalTax,
      paymentAccountId,
      revenueAccountId,
      date: new Date().toISOString(),
    };

    onSave(saleData);
    handleClose();
  };

  const handleClose = () => {
    setCartItems([]);
    setCurrentItem({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'Percentage',
      taxes: [],
      description: '',
    });
    setEditingIndex(null);
    setPaymentAccountId('');
    setRevenueAccountId('');
    onClose();
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartTaxTotal = cartItems.reduce((sum, item) => 
    sum + (item.taxes || []).reduce((taxSum, t) => taxSum + Number(t.taxAmount || 0), 0), 0
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600 }}>
        Create Sale with Professional Tax
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Product Selection */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Select Product"
              value={currentItem.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">-- Select Product --</option>
              {productSettings.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={currentItem.quantity}
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Unit Price"
              value={currentItem.unitPrice}
              onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Discount"
              value={currentItem.discount}
              onChange={(e) => setCurrentItem({ ...currentItem, discount: e.target.value })}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              label="Discount Type"
              value={currentItem.discountType}
              onChange={(e) => setCurrentItem({ ...currentItem, discountType: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed Amount</option>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              value={currentItem.description}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
            />
          </Grid>

          {/* Tax Selector */}
          <Grid item xs={12}>
            <TaxSelector
              value={currentItem.taxes}
              onChange={(taxes) => setCurrentItem({ ...currentItem, taxes })}
              amount={Number(currentItem.quantity) * Number(currentItem.unitPrice)}
            />
          </Grid>

          {/* Item Total */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="h6">
                Item Total: ${calculateItemTotal(currentItem).toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          {/* Add to Cart Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              startIcon={editingIndex !== null ? <Edit /> : <Add />}
              onClick={handleAddToCart}
              sx={{ bgcolor: '#0d9488' }}
            >
              {editingIndex !== null ? 'Update Item' : 'Add to Cart'}
            </Button>
          </Grid>

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Cart Items ({cartItems.length})</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.200' }}>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Discount</TableCell>
                      <TableCell align="right">Tax</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${Number(item.unitPrice).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          {item.discountType === 'Fixed' ? `$${item.discount}` : `${item.discount}%`}
                        </TableCell>
                        <TableCell align="right">
                          ${(item.taxes || []).reduce((sum, t) => sum + Number(t.taxAmount || 0), 0).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">${item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleEditItem(index)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell colSpan={4} align="right"><strong>Totals:</strong></TableCell>
                      <TableCell align="right"><strong>${cartTaxTotal.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>${cartTotal.toFixed(2)}</strong></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {/* Account Selection */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Payment Account"
              value={paymentAccountId}
              onChange={(e) => setPaymentAccountId(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">-- Select Payment Account --</option>
              {accountSettings.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Revenue Account"
              value={revenueAccountId}
              onChange={(e) => setRevenueAccountId(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">-- Select Revenue Account --</option>
              {accountSettings.filter(a => a.name.toLowerCase().includes('revenue')).map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#0d9488' }}>
          Save Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
}
