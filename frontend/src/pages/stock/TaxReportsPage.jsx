import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, Grid, Card,
  CardContent, MenuItem
} from '@mui/material';
import { Download, Print } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const TAX_TYPES = ['VAT', 'Sales Tax', 'Excise', 'WHT', 'Customs', 'Zero-Rated', 'Exempt'];

export default function TaxReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    taxType: '',
  });

  useEffect(() => {
    if (activeTab === 0) {
      fetchTransactions();
    } else {
      fetchSummary();
    }
  }, [activeTab, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('stockToken');
      const params = new URLSearchParams(filters);
      const res = await axios.get(`${API_URL}/stock/taxes/transactions/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching tax transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('stockToken');
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      const res = await axios.get(`${API_URL}/stock/taxes/reports/summary?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching tax summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = activeTab === 0 ? transactions : summary;
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${new Date().toISOString()}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const totalTaxAmount = transactions.reduce((sum, t) => sum + (Number(t.taxAmount) || 0), 0);
  const totalTaxableAmount = transactions.reduce((sum, t) => sum + (Number(t.taxableAmount) || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Tax Reports</Typography>
        <Box>
          <Button startIcon={<Download />} onClick={handleExport} sx={{ mr: 1 }}>Export</Button>
          <Button startIcon={<Print />} onClick={handlePrint}>Print</Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Tax Type"
              value={filters.taxType}
              onChange={(e) => setFilters({ ...filters, taxType: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {TAX_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: '#0d9488', height: '56px' }}
              onClick={() => activeTab === 0 ? fetchTransactions() : fetchSummary()}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Tax Transactions" />
        <Tab label="Tax Summary" />
      </Tabs>

      {activeTab === 0 && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Transactions</Typography>
                  <Typography variant="h4">{transactions.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Taxable Amount</Typography>
                  <Typography variant="h4">${totalTaxableAmount.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Tax Amount</Typography>
                  <Typography variant="h4">${totalTaxAmount.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Transactions Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Tax Name</TableCell>
                  <TableCell>Tax Type</TableCell>
                  <TableCell align="right">Taxable Amount</TableCell>
                  <TableCell align="right">Tax Rate</TableCell>
                  <TableCell align="right">Tax Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{new Date(txn.transactionDate).toLocaleDateString()}</TableCell>
                    <TableCell>{txn.transactionType}</TableCell>
                    <TableCell>{txn.invoiceNumber}</TableCell>
                    <TableCell>{txn.taxName}</TableCell>
                    <TableCell>{txn.taxType}</TableCell>
                    <TableCell align="right">${Number(txn.taxableAmount).toFixed(2)}</TableCell>
                    <TableCell align="right">{txn.taxRate}%</TableCell>
                    <TableCell align="right">${Number(txn.taxAmount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                <TableCell>Tax Type</TableCell>
                <TableCell align="right">Transaction Count</TableCell>
                <TableCell align="right">Total Taxable Amount</TableCell>
                <TableCell align="right">Total Tax Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((item) => (
                <TableRow key={item.taxType}>
                  <TableCell sx={{ fontWeight: 600 }}>{item.taxType}</TableCell>
                  <TableCell align="right">{item.transactionCount}</TableCell>
                  <TableCell align="right">${Number(item.totalTaxableAmount).toFixed(2)}</TableCell>
                  <TableCell align="right">${Number(item.totalTaxAmount).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: '#f9fafb', fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {summary.reduce((sum, item) => sum + item.transactionCount, 0)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  ${summary.reduce((sum, item) => sum + Number(item.totalTaxableAmount), 0).toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  ${summary.reduce((sum, item) => sum + Number(item.totalTaxAmount), 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
