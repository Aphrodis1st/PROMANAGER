import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Switch, FormControlLabel, Chip, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tabs, Tab, Grid
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const API_URL = API_BASE_URL;

const TAX_TYPES = [
  { value: 'VAT', label: 'Value Added Tax (VAT)' },
  { value: 'Sales Tax', label: 'Sales Tax' },
  { value: 'Excise', label: 'Excise Duty' },
  { value: 'WHT', label: 'Withholding Tax (WHT)' },
  { value: 'Customs', label: 'Customs Duty' },
  { value: 'Zero-Rated', label: 'Zero-Rated Tax' },
  { value: 'Exempt', label: 'Tax Exempt' },
];

const APPLIES_TO = ['All', 'Product', 'Service', 'Category'];
const CALCULATION_TYPES = ['Percentage', 'Fixed'];
const PRICE_TYPES = ['Exclusive', 'Inclusive'];

export default function TaxSettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [taxes, setTaxes] = useState([]);
  const [taxGroups, setTaxGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  const [formData, setFormData] = useState({
    taxName: '',
    taxCode: '',
    taxType: 'VAT',
    calculationType: 'Percentage',
    rate: 0,
    fixedAmount: 0,
    priceType: 'Exclusive',
    appliesTo: 'All',
    categoryFilter: [],
    isActive: true,
    description: '',
    outputGLCode: '2101',
    inputGLCode: '1301',
    controlGLCode: '2102',
  });

  const [groupFormData, setGroupFormData] = useState({
    groupName: '',
    groupCode: '',
    taxIds: [],
    description: '',
    isActive: true,
  });
  const [glAccounts, setGLAccounts] = useState([]);

  useEffect(() => {
    fetchTaxes();
    fetchTaxGroups();
    fetchGLAccounts();
  }, []);

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/stock/taxes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxes(res.data);
    } catch (err) {
      console.error('Error fetching taxes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/stock/taxes/groups/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxGroups(res.data);
    } catch (err) {
      console.error('Error fetching tax groups:', err);
    }
  };

  const fetchGLAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/stock/gl-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGLAccounts(res.data || []);
    } catch (err) {
      console.error('Error fetching GL accounts:', err);
    }
  };

  const initializeDefaultGLAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/stock/gl-accounts/initialize-defaults`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGLAccounts();
      alert('Default GL accounts initialized successfully');
    } catch (err) {
      console.error('Error initializing GL accounts:', err);
      alert('Failed to initialize GL accounts');
    }
  };

  const handleSaveTax = async () => {
    try {
      console.log('Saving tax with data:', formData);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      // Validate required fields
      if (!formData.taxName || !formData.taxCode) {
        alert('Tax Name and Tax Code are required');
        return;
      }

      const payload = {
        ...formData,
        rate: Number(formData.rate) || 0,
        fixedAmount: Number(formData.fixedAmount) || 0,
      };

      console.log('Sending payload:', payload);

      if (editingTax) {
        const response = await axios.put(`${API_URL}/stock/taxes/${editingTax.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Update response:', response.data);
      } else {
        const response = await axios.post(`${API_URL}/stock/taxes`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Create response:', response.data);
      }
      
      await fetchTaxes();
      handleCloseDialog();
      alert('Tax saved successfully!');
    } catch (err) {
      console.error('Error saving tax:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save tax';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteTax = async (id) => {
    if (!confirm('Delete this tax?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/stock/taxes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTaxes();
    } catch (err) {
      console.error('Error deleting tax:', err);
      alert('Failed to delete tax');
    }
  };

  const handleSaveGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editingGroup) {
        await axios.put(`${API_URL}/stock/taxes/groups/${editingGroup.id}`, groupFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/stock/taxes/groups`, groupFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTaxGroups();
      handleCloseGroupDialog();
    } catch (err) {
      console.error('Error saving tax group:', err);
      alert('Failed to save tax group');
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!confirm('Delete this tax group?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/stock/taxes/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTaxGroups();
    } catch (err) {
      console.error('Error deleting tax group:', err);
      alert('Failed to delete tax group');
    }
  };

  const handleOpenDialog = (tax = null) => {
    if (tax) {
      setEditingTax(tax);
      setFormData(tax);
    } else {
      setEditingTax(null);
      setFormData({
        taxName: '',
        taxCode: '',
        taxType: 'VAT',
        calculationType: 'Percentage',
        rate: 0,
        fixedAmount: 0,
        priceType: 'Exclusive',
        appliesTo: 'All',
        categoryFilter: [],
        isActive: true,
        description: '',
        outputGLCode: '2101',
        inputGLCode: '1301',
        controlGLCode: '2102',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTax(null);
  };

  const handleOpenGroupDialog = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setGroupFormData(group);
    } else {
      setEditingGroup(null);
      setGroupFormData({
        groupName: '',
        groupCode: '',
        taxIds: [],
        description: '',
        isActive: true,
      });
    }
    setGroupDialogOpen(true);
  };

  const handleCloseGroupDialog = () => {
    setGroupDialogOpen(false);
    setEditingGroup(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Tax Settings</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={initializeDefaultGLAccounts}
            sx={{ borderColor: '#0d9488', color: '#0d9488' }}
          >
            Initialize GL Accounts
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => activeTab === 0 ? handleOpenDialog() : handleOpenGroupDialog()}
            sx={{ bgcolor: '#0d9488' }}
          >
            {activeTab === 0 ? 'Add Tax' : 'Add Tax Group'}
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Tax Configuration" />
        <Tab label="Tax Groups" />
      </Tabs>

      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                <TableCell>Tax Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Price Type</TableCell>
                <TableCell>GL Codes</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxes.map((tax) => (
                <TableRow key={tax.id}>
                  <TableCell>{tax.taxName}</TableCell>
                  <TableCell>{tax.taxCode}</TableCell>
                  <TableCell><Chip label={tax.taxType} size="small" /></TableCell>
                  <TableCell>
                    {tax.calculationType === 'Percentage' ? `${tax.rate}%` : `$${tax.fixedAmount}`}
                  </TableCell>
                  <TableCell>{tax.priceType}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption">Out: {tax.outputGLCode || '2101'}</Typography>
                      <Typography variant="caption">In: {tax.inputGLCode || '1301'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={tax.isActive ? 'Active' : 'Inactive'} color={tax.isActive ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(tax)}><Edit /></IconButton>
                    <IconButton size="small" onClick={() => handleDeleteTax(tax.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                <TableCell>Group Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Taxes</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.groupName}</TableCell>
                  <TableCell>{group.groupCode}</TableCell>
                  <TableCell>{group.taxIds?.length || 0} taxes</TableCell>
                  <TableCell>
                    <Chip label={group.isActive ? 'Active' : 'Inactive'} color={group.isActive ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenGroupDialog(group)}><Edit /></IconButton>
                    <IconButton size="small" onClick={() => handleDeleteGroup(group.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tax Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingTax ? 'Edit Tax' : 'Add Tax'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tax Name"
                value={formData.taxName}
                onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tax Code"
                value={formData.taxCode}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Tax Type"
                value={formData.taxType}
                onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
              >
                {TAX_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Calculation Type"
                value={formData.calculationType}
                onChange={(e) => setFormData({ ...formData, calculationType: e.target.value })}
              >
                {CALCULATION_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            {formData.calculationType === 'Percentage' ? (
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rate (%)"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                />
              </Grid>
            ) : (
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fixed Amount"
                  value={formData.fixedAmount}
                  onChange={(e) => setFormData({ ...formData, fixedAmount: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Price Type"
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
              >
                {PRICE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Applies To"
                value={formData.appliesTo}
                onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
              >
                {APPLIES_TO.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Output GL Code (Sales)"
                value={formData.outputGLCode}
                onChange={(e) => setFormData({ ...formData, outputGLCode: e.target.value })}
                SelectProps={{ native: true }}
                helperText="GL account for tax collected from customers"
              >
                <option value="2101">2101 - VAT Output (VAT Payable)</option>
                <option value="2103">2103 - Sales Tax Payable</option>
                <option value="2104">2104 - Excise Duty Payable</option>
                <option value="2105">2105 - Withholding Tax Payable</option>
                {glAccounts.filter(a => a.accountType === 'Liability').map(acc => (
                  <option key={acc.id} value={acc.glCode}>{acc.glCode} - {acc.glAccountName}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Input GL Code (Purchases)"
                value={formData.inputGLCode}
                onChange={(e) => setFormData({ ...formData, inputGLCode: e.target.value })}
                SelectProps={{ native: true }}
                helperText="GL account for tax paid to suppliers"
              >
                <option value="1301">1301 - VAT Input (VAT Receivable)</option>
                <option value="1302">1302 - Withholding Tax Receivable</option>
                <option value="1303">1303 - Customs Duty Receivable</option>
                {glAccounts.filter(a => a.accountType === 'Asset').map(acc => (
                  <option key={acc.id} value={acc.glCode}>{acc.glCode} - {acc.glAccountName}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Control GL Code"
                value={formData.controlGLCode}
                onChange={(e) => setFormData({ ...formData, controlGLCode: e.target.value })}
                SelectProps={{ native: true }}
                helperText="GL account for net tax calculation"
              >
                <option value="2102">2102 - VAT Control Account</option>
                {glAccounts.filter(a => a.category === 'Tax').map(acc => (
                  <option key={acc.id} value={acc.glCode}>{acc.glCode} - {acc.glAccountName}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#e0f2f1', borderRadius: 1, border: '1px solid #80cbc4' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>GL Account Codes Explanation:</Typography>
                <Typography variant="caption" component="div">
                  • <strong>Output GL Code:</strong> Used when recording tax collected from customers (Sales Invoice)<br />
                  • <strong>Input GL Code:</strong> Used when recording tax paid to suppliers (Purchase Bill)<br />
                  • <strong>Control GL Code:</strong> Used for net tax calculation (Output - Input)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="GL Account Code (Legacy)"
                value={formData.glAccountCode || ''}
                onChange={(e) => setFormData({ ...formData, glAccountCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTax} variant="contained" sx={{ bgcolor: '#0d9488' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Tax Group Dialog */}
      <Dialog open={groupDialogOpen} onClose={handleCloseGroupDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGroup ? 'Edit Tax Group' : 'Add Tax Group'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Name"
                value={groupFormData.groupName}
                onChange={(e) => setGroupFormData({ ...groupFormData, groupName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Code"
                value={groupFormData.groupCode}
                onChange={(e) => setGroupFormData({ ...groupFormData, groupCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                SelectProps={{ multiple: true }}
                label="Select Taxes"
                value={groupFormData.taxIds}
                onChange={(e) => setGroupFormData({ ...groupFormData, taxIds: e.target.value })}
              >
                {taxes.map((tax) => <MenuItem key={tax.id} value={tax.id}>{tax.taxName}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={groupFormData.description}
                onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={groupFormData.isActive}
                    onChange={(e) => setGroupFormData({ ...groupFormData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGroupDialog}>Cancel</Button>
          <Button onClick={handleSaveGroup} variant="contained" sx={{ bgcolor: '#0d9488' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
