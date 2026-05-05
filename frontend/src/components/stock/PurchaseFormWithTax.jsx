import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import TaxSelector from './TaxSelector';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export default function PurchaseFormWithTax({ 
  open, 
  onClose, 
  onSave, 
  productSettings = [],
  accountSettings = [],
  suppliers = []
}) {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    discountType: 'Percentage',
    taxes: [],
    description: '',
    batchNumber: '',
    expirationDate: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [supplierId, setSupplierId] = useState('');
  const [inventoryAccountId, setInventoryAccountId] = useState('');
  const [payableAccountId, setPayableAccountId] = useState('');

  const handleProductChange = (productId) => {
    const product = productSettings.find(p => p.id === productId);
    if (!product) return;

    setCurrentItem({
      ...currentItem,
      productId: product.id,
      productName: product.name,
      unitPrice: product.defaultBuyingPrice || 0,
      discount: product.defaultDiscount || 0,
      discountType: product.defaultDiscountType || 'Percentage',
      description: product.description || '',
    });

    // Auto-load taxes if configured
    if (product.taxId && !product.taxExempt) {
      fetchAndApplyTax(product.taxId, product.defaultBuyingPrice * currentItem.quantity);
    } else if (product.taxGroupId && !product.taxExempt) {
      fetchAndApplyTaxGroup(product.taxGroupId, product.defaultBuyingPrice * currentItem.quantity);
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
      return (amount * rate) / (100 + rate);
    }
    
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

  const handleAddToInvoice = () => {
    if (!currentItem.productId) {
      alert('Please select a product');
      return;
    }

    const itemWithTotal = {
      ...currentItem,
      totalPrice: calculateItemTotal(currentItem),
    };

    if (editingIndex !== null) {
      const updated = [...invoiceItems];
      updated[editingIndex] = itemWithTotal;
      setInvoiceItems(updated);
      setEditingIndex(null);
    } else {
      setInvoiceItems([...invoiceItems, itemWithTotal]);
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
      batchNumber: '',
      expirationDate: '',
    });
  };

  const handleEditItem = (index) => {
    setCurrentItem(invoiceItems[index]);
    setEditingIndex(index);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (invoiceItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    if (!supplierId) {
      alert('Please select a supplier');
      return;
    }

    if (!inventoryAccountId || !payableAccountId) {
      alert('Please select inventory and payable accounts');
      return;
    }

    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTax = invoiceItems.reduce((sum, item) => 
      sum + (item.taxes || []).reduce((taxSum, t) => taxSum + Number(t.taxAmount || 0), 0), 0
    );

    const purchaseData = {
      supplierId,
      items: invoiceItems,
      totalAmount: totalAmount,
      totalTax: totalTax,
      inventoryAccountId,
      payableAccountId,
      status: 'pending',
      date: new Date().toISOString(),
    };

    onSave(purchaseData);
    handleClose();
  };

  const handleClose = () => {
    setInvoiceItems([]);
    setCurrentItem({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'Percentage',
      taxes: [],
      description: '',
      batchNumber: '',
      expirationDate: '',
    });
    setEditingIndex(null);
    setSupplierId('');
    setInventoryAccountId('');
    setPayableAccountId('');
    onClose();
  };

  const invoiceTotal = invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const invoiceTaxTotal = invoiceItems.reduce((sum, item) => 
    sum + (item.taxes || []).reduce((taxSum, t) => taxSum + Number(t.taxAmount || 0), 0), 0
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600 }}>
        Create Purchase Invoice with Professional Tax
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Supplier Selection */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Select Supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </TextField>
          </Grid>

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

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Batch Number"
              value={currentItem.batchNumber}
              onChange={(e) => setCurrentItem({ ...currentItem, batchNumber: e.target.value })}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Expiration Date"
              value={currentItem.expirationDate}
              onChange={(e) => setCurrentItem({ ...currentItem, expirationDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
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

          {/* Add to Invoice Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              startIcon={editingIndex !== null ? <Edit /> : <Add />}
              onClick={handleAddToInvoice}
              sx={{ bgcolor: '#0d9488' }}
            >
              {editingIndex !== null ? 'Update Item' : 'Add to Invoice'}
            </Button>
          </Grid>

          {/* Invoice Items */}
          {invoiceItems.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Invoice Items ({invoiceItems.length})</Typography>
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
                    {invoiceItems.map((item, index) => (
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
                      <TableCell align="right"><strong>${invoiceTaxTotal.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>${invoiceTotal.toFixed(2)}</strong></TableCell>
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
              label="Inventory Account"
              value={inventoryAccountId}
              onChange={(e) => setInventoryAccountId(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">-- Select Inventory Account --</option>
              {accountSettings.filter(a => a.name.toLowerCase().includes('inventory')).map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Accounts Payable"
              value={payableAccountId}
              onChange={(e) => setPayableAccountId(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">-- Select Payable Account --</option>
              {accountSettings.filter(a => a.name.toLowerCase().includes('payable')).map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#0d9488' }}>
          Save Purchase Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
}
