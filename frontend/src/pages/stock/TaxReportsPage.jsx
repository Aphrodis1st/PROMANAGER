import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, Grid, Card,
  CardContent, MenuItem
} from '@mui/material';
import { Download, Print } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const API_URL = API_BASE_URL;

const TAX_TYPES = ['VAT', 'Sales Tax', 'Excise', 'WHT', 'Customs', 'Zero-Rated', 'Exempt'];
const TRANSACTION_TYPES = ['Sale', 'Purchase', 'All'];

export default function TaxReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    taxType: '',
    transactionType: 'All',
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
      const token = localStorage.getItem('token');
      const params = [];
      if (filters.startDate) params.push(`startDate=${filters.startDate}`);
      if (filters.endDate) params.push(`endDate=${filters.endDate}`);
      if (filters.taxType) params.push(`taxType=${filters.taxType}`);
      if (filters.transactionType && filters.transactionType !== 'All') {
        params.push(`transactionType=${filters.transactionType}`);
      }
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      const res = await axios.get(`${API_URL}/stock/taxes/transactions/all${queryString}`, {
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
      const token = localStorage.getItem('token');
      const params = [];
      if (filters.startDate) params.push(`startDate=${filters.startDate}`);
      if (filters.endDate) params.push(`endDate=${filters.endDate}`);
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      const res = await axios.get(`${API_URL}/stock/taxes/reports/summary${queryString}`, {
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
  
  // Calculate Output Tax (Sales) and Input Tax (Purchases) for VAT reconciliation
  const outputTax = transactions
    .filter(t => t.transactionType === 'Sale')
    .reduce((sum, t) => sum + (Number(t.taxAmount) || 0), 0);
  const inputTax = transactions
    .filter(t => t.transactionType === 'Purchase')
    .reduce((sum, t) => sum + (Number(t.taxAmount) || 0), 0);
  const netTaxPayable = outputTax - inputTax;

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
              label="Transaction Type"
              value={filters.transactionType}
              onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            >
              {TRANSACTION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
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
        <Tab label="VAT Reconciliation" />
      </Tabs>

      {activeTab === 0 && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Transactions</Typography>
                  <Typography variant="h4">{transactions.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Taxable Amount</Typography>
                  <Typography variant="h4">${totalTaxableAmount.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Tax Amount</Typography>
                  <Typography variant="h4">${totalTaxAmount.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: netTaxPayable >= 0 ? '#fee2e2' : '#dcfce7' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Net Tax Payable</Typography>
                  <Typography variant="h4" sx={{ color: netTaxPayable >= 0 ? '#dc2626' : '#16a34a' }}>
                    ${Math.abs(netTaxPayable).toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {netTaxPayable >= 0 ? 'To Pay' : 'Refundable'}
                  </Typography>
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

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>VAT Reconciliation Report</Typography>
          
          {/* Output Tax (Sales) */}
          <Card sx={{ mb: 3, bgcolor: '#fef3c7' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#92400e' }}>Output Tax (Tax Collected from Sales)</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.filter(t => t.transactionType === 'Sale').reduce((acc, t) => {
                      const key = t.taxType;
                      if (!acc[key]) acc[key] = { taxType: key, amount: 0 };
                      acc[key].amount += Number(t.taxAmount) || 0;
                      return acc;
                    }, {})}
                    {Object.values(transactions.filter(t => t.transactionType === 'Sale').reduce((acc, t) => {
                      const key = t.taxType;
                      if (!acc[key]) acc[key] = { taxType: key, amount: 0 };
                      acc[key].amount += Number(t.taxAmount) || 0;
                      return acc;
                    }, {})).map((item) => (
                      <TableRow key={item.taxType}>
                        <TableCell>{item.taxType} on Sales</TableCell>
                        <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#fde68a' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Total Output Tax</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>${outputTax.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Input Tax (Purchases) */}
          <Card sx={{ mb: 3, bgcolor: '#dbeafe' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e3a8a' }}>Input Tax (Tax Paid on Purchases)</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(transactions.filter(t => t.transactionType === 'Purchase').reduce((acc, t) => {
                      const key = t.taxType;
                      if (!acc[key]) acc[key] = { taxType: key, amount: 0 };
                      acc[key].amount += Number(t.taxAmount) || 0;
                      return acc;
                    }, {})).map((item) => (
                      <TableRow key={item.taxType}>
                        <TableCell>{item.taxType} on Purchases</TableCell>
                        <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#bfdbfe' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Total Input Tax</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>${inputTax.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Net Tax Calculation */}
          <Card sx={{ bgcolor: netTaxPayable >= 0 ? '#fee2e2' : '#dcfce7' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: netTaxPayable >= 0 ? '#991b1b' : '#14532d' }}>
                Net Tax Position
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Output Tax (Tax Collected)</TableCell>
                      <TableCell align="right">${outputTax.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Input Tax (Tax Paid)</TableCell>
                      <TableCell align="right">-${inputTax.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: netTaxPayable >= 0 ? '#fecaca' : '#bbf7d0' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {netTaxPayable >= 0 ? 'Net Tax Payable to Tax Authority' : 'Net Tax Refundable from Tax Authority'}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.1rem', color: netTaxPayable >= 0 ? '#dc2626' : '#16a34a' }}>
                        ${Math.abs(netTaxPayable).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Note:</strong> {netTaxPayable >= 0 
                    ? 'This amount should be paid to the tax authority. Record as a liability (Tax Payable).'
                    : 'This amount can be claimed as a refund from the tax authority. Record as an asset (Tax Receivable).'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      )}
    </Box>
  );
}
