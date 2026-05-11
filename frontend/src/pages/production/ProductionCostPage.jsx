// ========================================
// ✅ ProductionCostPage.jsx (Professional Dashboard)
// Modern production cost management dashboard
// ========================================
import React, { useState, useEffect, useMemo } from 'react';
import { useProduction } from '../../context/ProductionContext';
import { useStock, useStockCurrency } from '../../context/stockContext';
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  CircularProgress,
  TablePagination,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Grid,
  Box,
  Paper,
  Divider,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Factory as FactoryIcon,
  MonetizationOn as MoneyIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

export default function ProductionCostPage() {
  const { cycles } = useProduction();
  const { products, getProductStock, productSettings } = useStock();
  const { formatAmount } = useStockCurrency();

  // ✅ Only show completed cycles dynamically
  const [completedCycles, setCompletedCycles] = useState(
    cycles.filter((c) => c.status === 'completed')
  );

  const [formData, setFormData] = useState({
    cycleId: '',
    productId: '',
    quantity: 0,
    rawMaterials: [],
    laborCost: 0,
    overheadCost: 0,
    totalCost: 0,
    dateProduced: '',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // 🔁 Auto-refresh completed cycles when `cycles` from context update
  useEffect(() => {
    setCompletedCycles(cycles.filter((c) => c.status === 'completed'));
  }, [cycles]);

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const totalCycles = completedCycles.length;
    const totalProduction = completedCycles.reduce((sum, c) => sum + (c.quantityCompleted || c.quantityPlanned || 0), 0);
    const totalCost = completedCycles.reduce((sum, c) => {
      const cost = c.costSummary?.totalCost || c.totalCost || 0;
      return sum + cost;
    }, 0);
    const avgCostPerUnit = totalProduction > 0 ? totalCost / totalProduction : 0;
    
    const materialCosts = completedCycles.reduce((sum, c) => sum + (c.costSummary?.materialCost || c.materialCost || 0), 0);
    const laborCosts = completedCycles.reduce((sum, c) => sum + (c.costSummary?.laborCost || c.laborCost || 0), 0);
    const overheadCosts = completedCycles.reduce((sum, c) => sum + (c.costSummary?.overheadCost || c.overheadCost || 0), 0);
    
    return {
      totalCycles,
      totalProduction,
      totalCost,
      avgCostPerUnit,
      materialCosts,
      laborCosts,
      overheadCosts,
      materialPercentage: totalCost > 0 ? (materialCosts / totalCost) * 100 : 0,
      laborPercentage: totalCost > 0 ? (laborCosts / totalCost) * 100 : 0,
      overheadPercentage: totalCost > 0 ? (overheadCosts / totalCost) * 100 : 0,
    };
  }, [completedCycles]);

  // 🔁 Auto-fill form when cycleId changes
  useEffect(() => {
    if (!formData.cycleId) return;

    const selectedCycle = completedCycles.find(
      (c) => c.id === formData.cycleId
    );
    if (selectedCycle) {
      // Use costSummary from cycle
      const materialCost = selectedCycle.costSummary?.materialCost || selectedCycle.materialCost || 0;
      const laborCost = selectedCycle.costSummary?.laborCost || selectedCycle.laborCost || 0;
      const overheadCost = selectedCycle.costSummary?.overheadCost || selectedCycle.overheadCost || 0;
      const totalCost = selectedCycle.costSummary?.totalCost || selectedCycle.totalCost || (materialCost + laborCost + overheadCost);

      setFormData({
        cycleId: selectedCycle.id,
        productId: selectedCycle.productId || selectedCycle.productName,
        quantity:
          selectedCycle.quantityCompleted || selectedCycle.quantityPlanned,
        rawMaterials: selectedCycle.consumedMaterials || selectedCycle.rawMaterials || [],
        laborCost,
        overheadCost,
        totalCost,
        dateProduced:
          selectedCycle.dateProduced || selectedCycle.completedAt || new Date().toISOString().slice(0, 10),
      });
    }
  }, [formData.cycleId, completedCycles, products]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit and record production cost
  const handleSubmit = async () => {
    const {
      cycleId,
      productId,
      quantity,
      rawMaterials,
      laborCost,
      overheadCost,
      totalCost,
      dateProduced,
    } = formData;

    if (!cycleId || !productId || quantity <= 0 || !dateProduced) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields!',
        severity: 'warning',
      });
      return;
    }

    try {
      // Show success message - costs are already recorded when cycle was completed
      setSnackbar({
        open: true,
        message: 'Production cost information displayed successfully!',
        severity: 'success',
      });

      console.log('📊 Production Cost Summary:', {
        cycleId,
        productId,
        quantity,
        laborCost,
        overheadCost,
        totalCost,
        dateProduced,
        rawMaterials,
      });

      // 🧹 Reset form
      setFormData({
        cycleId: '',
        productId: '',
        quantity: 0,
        rawMaterials: [],
        laborCost: 0,
        overheadCost: 0,
        totalCost: 0,
        dateProduced: '',
      });
    } catch (err) {
      console.error('❌ Error displaying production cost:', err);
      setSnackbar({
        open: true,
        message: `Failed to display production cost: ${err.message}`,
        severity: 'error',
      });
    }
  };

  // Calculate table data with costs
  const tableData = useMemo(() => {
    return completedCycles.map((c) => {
      // Use costSummary from cycle if available
      const materialCost = c.costSummary?.materialCost || c.materialCost || 0;
      const laborCost = c.costSummary?.laborCost || c.laborCost || 0;
      const overheadCost = c.costSummary?.overheadCost || c.overheadCost || 0;
      const totalCost = c.costSummary?.totalCost || c.totalCost || (materialCost + laborCost + overheadCost);

      return {
        ...c,
        materialCost,
        laborCost,
        overheadCost,
        totalCost,
      };
    });
  }, [completedCycles]);

  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Professional Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 3, 
          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <FactoryIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                Production Cost Dashboard
              </Typography>
              <Typography variant='body1' sx={{ opacity: 0.9 }}>
                Monitor and analyze production costs across all manufacturing cycles
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant='h6' sx={{ opacity: 0.8 }}>
              Total Cycles
            </Typography>
            <Typography variant='h3' sx={{ fontWeight: 700 }}>
              {dashboardMetrics.totalCycles}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant='h4' sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {dashboardMetrics.totalProduction.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Total Units Produced
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={85} 
                sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#e3f2fd' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}>
                  <MoneyIcon />
                </Avatar>
                <Typography variant='h5' sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                  <CurrencyDisplay amount={dashboardMetrics.totalCost} />
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Total Production Cost
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={72} 
                sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#f3e5f5' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e8f5e9', color: '#388e3c' }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant='h5' sx={{ fontWeight: 700, color: '#388e3c' }}>
                  <CurrencyDisplay amount={dashboardMetrics.avgCostPerUnit} />
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Average Cost Per Unit
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={65} 
                sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#e8f5e9' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}>
                  <AnalyticsIcon />
                </Avatar>
                <Typography variant='h6' sx={{ fontWeight: 700, color: '#f57c00' }}>
                  {dashboardMetrics.materialPercentage.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Material Cost Ratio
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={dashboardMetrics.materialPercentage} 
                sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#fff3e0' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cost Breakdown Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PieChartIcon sx={{ color: '#0d9488', fontSize: 28 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Cost Breakdown Analysis
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdfa', borderRadius: 2 }}>
                    <Typography variant='h4' sx={{ fontWeight: 700, color: '#0d9488', mb: 1 }}>
                      {dashboardMetrics.materialPercentage.toFixed(0)}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                      Material Costs
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#0d9488', fontWeight: 600 }}>
                      <CurrencyDisplay amount={dashboardMetrics.materialCosts} />
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fef7ff', borderRadius: 2 }}>
                    <Typography variant='h4' sx={{ fontWeight: 700, color: '#7b1fa2', mb: 1 }}>
                      {dashboardMetrics.laborPercentage.toFixed(0)}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                      Labor Costs
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#7b1fa2', fontWeight: 600 }}>
                      <CurrencyDisplay amount={dashboardMetrics.laborCosts} />
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff8e1', borderRadius: 2 }}>
                    <Typography variant='h4' sx={{ fontWeight: 700, color: '#f57c00', mb: 1 }}>
                      {dashboardMetrics.overheadPercentage.toFixed(0)}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                      Overhead Costs
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#f57c00', fontWeight: 600 }}>
                      <CurrencyDisplay amount={dashboardMetrics.overheadCosts} />
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TimelineIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant='contained' 
                  fullWidth 
                  sx={{ 
                    bgcolor: '#0d9488', 
                    '&:hover': { bgcolor: '#14b8a6' },
                    borderRadius: 2,
                    py: 1.5
                  }}
                  startIcon={<AssignmentIcon />}
                >
                  New Cost Analysis
                </Button>
                
                <Button 
                  variant='outlined' 
                  fullWidth 
                  sx={{ 
                    borderColor: '#0d9488', 
                    color: '#0d9488',
                    '&:hover': { borderColor: '#14b8a6', bgcolor: '#f0fdfa' },
                    borderRadius: 2,
                    py: 1.5
                  }}
                  startIcon={<BarChartIcon />}
                >
                  Export Report
                </Button>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontWeight: 600 }}>
                    Recent Activity
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Last cost analysis: {completedCycles.length > 0 ? 'Today' : 'No data'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

        {/* Production Cost Form */}
        <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: '#e8f5e9', color: '#0d9488' }}>
                <AssignmentIcon />
              </Avatar>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                Cost Allocation Form
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Completed Cycle</InputLabel>
                  <Select
                    name='cycleId'
                    value={formData.cycleId}
                    onChange={handleChange}
                    label='Select Completed Cycle'
                  >
                    <MenuItem value=''>
                      <em>Select Cycle</em>
                    </MenuItem>
                    {completedCycles.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.productName} ({c.batchNo?.replace(/[^0-9]/g, '') || c.name?.replace(/[^0-9]/g, '') || c.id.slice(-6)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label='Product'
                  value={
                    products.find((p) => p.id === formData.productId)?.name ||
                    formData.productId ||
                    ''
                  }
                  disabled
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label='Quantity Produced'
                  type='number'
                  value={formData.quantity}
                  disabled
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label='Labor Cost'
                  type='number'
                  value={formData.laborCost}
                  disabled
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label='Overhead Cost'
                  type='number'
                  value={formData.overheadCost}
                  disabled
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label='Total Cost'
                  type='number'
                  value={formData.totalCost.toFixed(2)}
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      fontWeight: 600,
                      color: '#0d9488'
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label='Date Produced'
                  type='date'
                  name='dateProduced'
                  value={formData.dateProduced}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Raw Materials */}
            {formData.rawMaterials && formData.rawMaterials.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: '#0d9488' }}>
                  Raw Materials Breakdown
                </Typography>
                <Grid container spacing={2}>
                  {formData.rawMaterials.map((rm, i) => {
                    const product = products.find((p) => p.id === rm.productId);
                    const productName = rm.productName || rm.materialName || product?.name || 'Unknown Material';
                    const quantity = rm.quantity || rm.qtyUsed || 0;
                    const unitCost = rm.unitCost || product?.buyingPrice || 0;
                    const totalCost = rm.totalCost || (quantity * unitCost);
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant='subtitle1' sx={{ fontWeight: 600, color: '#374151' }}>
                              {productName}
                            </Typography>
                            <Typography variant='h6' sx={{ fontWeight: 700, color: '#0d9488' }}>
                              <CurrencyDisplay amount={totalCost} />
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant='body2' color='text.secondary'>
                              Qty: {quantity}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              Unit: <CurrencyDisplay amount={unitCost} />
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant='contained'
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={!formData.cycleId}
                sx={{
                  bgcolor: '#0d9488',
                  '&:hover': { bgcolor: '#14b8a6' },
                  '&:disabled': { bgcolor: 'grey.300' },
                  borderRadius: 2,
                  px: 4,
                  py: 1.5
                }}
              >
                View Cost Summary
              </Button>
              
              <Button
                variant='outlined'
                sx={{
                  borderColor: '#0d9488',
                  color: '#0d9488',
                  '&:hover': { borderColor: '#14b8a6', bgcolor: '#f0fdfa' },
                  borderRadius: 2,
                  px: 4,
                  py: 1.5
                }}
              >
                Reset Form
              </Button>
            </Box>
          </CardContent>
        </Card>

          {/* Completed Cycles Table */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                    <BarChartIcon />
                  </Avatar>
                  <Typography variant='h5' sx={{ fontWeight: 600 }}>
                    Production Cycles Overview
                  </Typography>
                </Box>
              </Box>
              
              {completedCycles.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <FactoryIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
                  <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                    No Completed Cycles
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Complete some production cycles to see cost analysis here
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Cycle ID
                          </TableCell>
                          <TableCell sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Product
                          </TableCell>
                          <TableCell align='right' sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Planned Qty
                          </TableCell>
                          <TableCell align='right' sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Completed Qty
                          </TableCell>
                          <TableCell align='right' sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Material Cost
                          </TableCell>
                          <TableCell align='right' sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Labor Cost
                          </TableCell>
                          <TableCell align='right' sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Overhead Cost
                          </TableCell>
                          <TableCell align='right' sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Total Cost
                          </TableCell>
                          <TableCell align='center' sx={{ bgcolor: '#0d9488', color: 'white', fontWeight: 600, py: 2 }}>
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedData.map((row, index) => {
                          const actualIndex = page * rowsPerPage + index;
                          const isEven = actualIndex % 2 === 0;
                          return (
                            <TableRow
                              key={row.id}
                              hover
                              sx={{
                                bgcolor: isEven ? '#fafafa' : 'white',
                                '&:hover': { bgcolor: '#f0fdfa' },
                                cursor: 'pointer'
                              }}
                            >
                              <TableCell sx={{ py: 2, fontWeight: 500 }}>
                                <Chip 
                                  label={row.batchNo?.replace(/[^0-9]/g, '') || row.name?.replace(/[^0-9]/g, '') || row.id.slice(-6)}
                                  size='small'
                                  sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell sx={{ py: 2, fontWeight: 500 }}>
                                {row.productName}
                              </TableCell>
                              <TableCell align='right' sx={{ py: 2 }}>
                                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                  {row.quantityPlanned?.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell align='right' sx={{ py: 2 }}>
                                <Typography variant='body2' sx={{ fontWeight: 600, color: '#0d9488' }}>
                                  {row.quantityCompleted?.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell align='right' sx={{ py: 2 }}>
                                <CurrencyDisplay amount={row.materialCost} />
                              </TableCell>
                              <TableCell align='right' sx={{ py: 2 }}>
                                <CurrencyDisplay amount={row.laborCost} />
                              </TableCell>
                              <TableCell align='right' sx={{ py: 2 }}>
                                <CurrencyDisplay amount={row.overheadCost} />
                              </TableCell>
                              <TableCell align='right' sx={{ py: 2 }}>
                                <Typography variant='body2' sx={{ fontWeight: 700, color: '#0d9488' }}>
                                  <CurrencyDisplay amount={row.totalCost} />
                                </Typography>
                              </TableCell>
                              <TableCell align='center' sx={{ py: 2 }}>
                                <Chip 
                                  label='Completed' 
                                  size='small' 
                                  sx={{ 
                                    bgcolor: '#dcfce7', 
                                    color: '#166534',
                                    fontWeight: 600
                                  }} 
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component='div'
                    count={tableData.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    sx={{
                      borderTop: '1px solid #e5e7eb',
                      bgcolor: '#f9fafb',
                      '& .MuiTablePagination-toolbar': { 
                        px: 3,
                        py: 2
                      }
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
