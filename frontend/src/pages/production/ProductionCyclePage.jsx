// ========================================
// ✅ ProductionCyclePage.jsx (Professional Dashboard)
// Modern production cycle management dashboard
// ========================================
import React, { useState, useMemo } from 'react';
import { useProduction } from '../../context/ProductionContext';
import { useStock, useStockCurrency } from '../../context/stockContext';
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import AttachRawMaterials from '../../components/prodution/RawMaterialSelector';
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  Avatar,
  LinearProgress,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Factory as FactoryIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Schedule as ScheduleIcon,
  Engineering as EngineeringIcon,
  Inventory as InventoryIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

export default function ProductionCyclePage() {
  const { plans, cycles, startCycle, completeCycle, loading } = useProduction();
  const { products } = useStock();
  const { formatAmount } = useStockCurrency();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [showRawMaterialModal, setShowRawMaterialModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [completeForm, setCompleteForm] = useState({
    producedQty: '',
    laborCost: '',
    overheadCost: '',
  });

  const [filterProduct, setFilterProduct] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [plansPage, setPlansPage] = useState(0);
  const [plansRowsPerPage, setPlansRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const totalCycles = cycles.length;
    const activeCycles = cycles.filter(c => c.status === 'in_progress').length;
    const completedCycles = cycles.filter(c => c.status === 'completed').length;
    const plannedCycles = cycles.filter(c => c.status === 'planned').length;
    
    const totalPlannedQty = cycles.reduce((sum, c) => sum + (c.quantityPlanned || 0), 0);
    const totalCompletedQty = cycles.reduce((sum, c) => sum + (c.quantityCompleted || 0), 0);
    const completionRate = totalPlannedQty > 0 ? (totalCompletedQty / totalPlannedQty) * 100 : 0;
    
    const totalCost = cycles.reduce((sum, c) => sum + (c.costSummary?.totalCost || 0), 0);
    const avgCycleTime = cycles.length > 0 ? 5.2 : 0; // Mock average cycle time in days
    
    return {
      totalCycles,
      activeCycles,
      completedCycles,
      plannedCycles,
      totalPlannedQty,
      totalCompletedQty,
      completionRate,
      totalCost,
      avgCycleTime,
      efficiency: Math.min(completionRate, 100),
      onTimeDelivery: 94.5, // Mock metric
      qualityRate: 98.2, // Mock metric
    };
  }, [cycles]);

  // Filter approved plans
  const approvedPlans = useMemo(
    () => plans.filter((p) => p.status === 'approved'),
    [plans]
  );

  const filteredPlans = useMemo(() => {
    return approvedPlans.filter((p) => {
      const searchLower = search.toLowerCase();
      return (
        (p.planName || '').toLowerCase().includes(searchLower) ||
        (p.productName || '').toLowerCase().includes(searchLower)
      );
    });
  }, [approvedPlans, search]);

  const paginatedPlans = filteredPlans.slice(
    plansPage * plansRowsPerPage,
    plansPage * plansRowsPerPage + plansRowsPerPage
  );

  // Filter cycles
  const filteredCycles = useMemo(() => {
    return cycles.filter((c) => {
      const matchesProduct = !filterProduct || c.productName === filterProduct;
      const createdAt = c.createdAt?.toDate
        ? c.createdAt.toDate()
        : new Date(c.createdAt);
      const matchesDate =
        (!dateRange.from || createdAt >= new Date(dateRange.from)) &&
        (!dateRange.to || createdAt <= new Date(dateRange.to));
      return matchesProduct && matchesDate;
    });
  }, [cycles, filterProduct, dateRange]);

  const paginatedCycles = filteredCycles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Start cycle
  const handleStartCycle = (plan) => {
    setSelectedPlan(plan);
    setShowRawMaterialModal(true);
  };

  // Complete cycle
  const openCompleteModal = (cycle) => {
    setSelectedCycle(cycle);
    setCompleteForm({
      producedQty: cycle.quantityPlanned || '',
      laborCost: cycle.costSummary?.laborCost || 0,
      overheadCost: cycle.costSummary?.overheadCost || 0,
    });
    setShowCompleteModal(true);
  };

  const handleSubmitCompleteCycle = async () => {
    if (!selectedCycle?.id) {
      setSnackbar({ open: true, message: 'Missing cycle ID', severity: 'error' });
      return;
    }

    const { producedQty, laborCost, overheadCost } = completeForm;
    if (!producedQty) {
      setSnackbar({ open: true, message: 'Please enter produced quantity', severity: 'warning' });
      return;
    }

    try {
      await completeCycle({
        cycleId: selectedCycle.id,
        producedQty: Number(producedQty),
        laborCost: Number(laborCost),
        overheadCost: Number(overheadCost),
      });
      setSnackbar({ open: true, message: 'Cycle completed successfully!', severity: 'success' });
      setShowCompleteModal(false);
      setSelectedCycle(null);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to complete cycle', severity: 'error' });
    }
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Production Cycles Summary', 14, 10);
    const tableData = filteredCycles.map((c) => [
      c.batchNo?.replace(/[^0-9]/g, '') || c.name?.replace(/[^0-9]/g, '') || c.id.slice(-6),
      c.productName,
      c.quantityPlanned,
      c.quantityCompleted,
      c.costSummary?.laborCost || 0,
      c.costSummary?.overheadCost || 0,
      c.costSummary?.materialCost || 0,
      c.costSummary?.totalCost || 0,
      c.status,
    ]);
    doc.autoTable({
      head: [
        [
          'Cycle ID',
          'Product',
          'Planned Qty',
          'Completed Qty',
          'Labor Cost',
          'Overhead Cost',
          'Material Cost',
          'Total Cost',
          'Status',
        ],
      ],
      body: tableData,
    });
    doc.save('ProductionCyclesReport.pdf');
  };



  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'planned':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Professional Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 3, 
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
                Production Cycle Management
              </Typography>
              <Typography variant='body1' sx={{ opacity: 0.9 }}>
                Monitor and manage production cycles from planning to completion
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CSVLink
              data={filteredCycles.map((c) => ({
                cycleId: c.batchNo?.replace(/[^0-9]/g, '') || c.name?.replace(/[^0-9]/g, '') || c.id.slice(-6),
                product: c.productName,
                plannedQty: c.quantityPlanned,
                completedQty: c.quantityCompleted,
                laborCost: c.costSummary?.laborCost || 0,
                overheadCost: c.costSummary?.overheadCost || 0,
                materialCost: c.costSummary?.materialCost || 0,
                totalCost: c.costSummary?.totalCost || 0,
                status: c.status,
              }))}
              filename='ProductionCycles.csv'
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant='outlined'
                startIcon={<ExportIcon />}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.3)', 
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Export CSV
              </Button>
            </CSVLink>
            <Button
              variant='outlined'
              startIcon={<ExportIcon />}
              onClick={exportPDF}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Export PDF
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0277bd' }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant='h4' sx={{ fontWeight: 700, color: '#0277bd' }}>
                  {dashboardMetrics.totalCycles}
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Total Cycles
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={85} 
                sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#e0f2fe' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}>
                  <SpeedIcon />
                </Avatar>
                <Typography variant='h4' sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                  {dashboardMetrics.activeCycles}
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Active Cycles
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={dashboardMetrics.activeCycles > 0 ? 75 : 0} 
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
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant='h4' sx={{ fontWeight: 700, color: '#388e3c' }}>
                  {dashboardMetrics.completionRate.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Completion Rate
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={dashboardMetrics.completionRate} 
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
                  <ScheduleIcon />
                </Avatar>
                <Typography variant='h5' sx={{ fontWeight: 700, color: '#f57c00' }}>
                  {dashboardMetrics.avgCycleTime} days
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                Avg Cycle Time
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={65} 
                sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#fff3e0' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TimelineIcon sx={{ color: '#059669', fontSize: 28 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Production Performance
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant='h4' sx={{ fontWeight: 700, color: '#059669', mb: 1 }}>
                      {dashboardMetrics.efficiency.toFixed(1)}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                      Production Efficiency
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#eff6ff', borderRadius: 2 }}>
                    <Typography variant='h4' sx={{ fontWeight: 700, color: '#2563eb', mb: 1 }}>
                      {dashboardMetrics.onTimeDelivery}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                      On-Time Delivery
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fef7ff', borderRadius: 2 }}>
                    <Typography variant='h4' sx={{ fontWeight: 700, color: '#a855f7', mb: 1 }}>
                      {dashboardMetrics.qualityRate}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                      Quality Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                  Production Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant='body2' color='text.secondary'>Planned Qty</Typography>
                      <Typography variant='h6' sx={{ fontWeight: 600, color: '#059669' }}>
                        {dashboardMetrics.totalPlannedQty.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant='body2' color='text.secondary'>Completed Qty</Typography>
                      <Typography variant='h6' sx={{ fontWeight: 600, color: '#2563eb' }}>
                        {dashboardMetrics.totalCompletedQty.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant='body2' color='text.secondary'>Total Cost</Typography>
                      <Typography variant='h6' sx={{ fontWeight: 600, color: '#dc2626' }}>
                        <CurrencyDisplay amount={dashboardMetrics.totalCost} />
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <EngineeringIcon sx={{ color: '#dc2626', fontSize: 28 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Cycle Status
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#dcfce7', borderRadius: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>Completed</Typography>
                  <Chip 
                    label={dashboardMetrics.completedCycles} 
                    size='small' 
                    sx={{ bgcolor: '#16a34a', color: 'white', fontWeight: 600 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#dbeafe', borderRadius: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>In Progress</Typography>
                  <Chip 
                    label={dashboardMetrics.activeCycles} 
                    size='small' 
                    sx={{ bgcolor: '#2563eb', color: 'white', fontWeight: 600 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#fef3c7', borderRadius: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>Planned</Typography>
                  <Chip 
                    label={dashboardMetrics.plannedCycles} 
                    size='small' 
                    sx={{ bgcolor: '#d97706', color: 'white', fontWeight: 600 }}
                  />
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Button 
                    variant='outlined' 
                    fullWidth 
                    size='small'
                    startIcon={<RefreshIcon />}
                    sx={{ 
                      borderColor: '#059669', 
                      color: '#059669',
                      '&:hover': { borderColor: '#10b981', bgcolor: '#f0fdf4' }
                    }}
                  >
                    Refresh Data
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Filters Section */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <FilterListIcon sx={{ color: '#059669', fontSize: 24 }} />
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              Filter & Search
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                type='date'
                label='From Date'
                value={dateRange.from}
                onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                size='small'
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                type='date'
                label='To Date'
                value={dateRange.to}
                onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                size='small'
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size='small' fullWidth>
                <InputLabel>Filter by Product</InputLabel>
                <Select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  label='Filter by Product'
                >
                  <MenuItem value=''>All Products</MenuItem>
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.name}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                placeholder='Search plans...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size='small'
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Approved Plans Section */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#e8f5e9', color: '#059669' }}>
                <InventoryIcon />
              </Avatar>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                Approved Production Plans
              </Typography>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#059669' }} />
              <Typography sx={{ ml: 2, color: 'text.secondary', fontWeight: 500 }}>
                Loading plans...
              </Typography>
            </Box>
          ) : filteredPlans.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8,
              bgcolor: '#f8fafc'
            }}>
              <Avatar sx={{ bgcolor: '#e5e7eb', color: '#6b7280', width: 64, height: 64, mb: 2 }}>
                <InventoryIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                No Approved Plans
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                No approved production plans available to start cycles
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Plan Name
                      </TableCell>
                      <TableCell sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Product
                      </TableCell>
                      <TableCell align='right' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Quantity
                      </TableCell>
                      <TableCell align='center' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPlans.map((p, index) => {
                      const actualIndex = plansPage * plansRowsPerPage + index;
                      const isEven = actualIndex % 2 === 0;
                      return (
                        <TableRow
                          key={p.id}
                          hover
                          sx={{
                            bgcolor: isEven ? '#fafafa' : 'white',
                            '&:hover': { bgcolor: '#f0fdf4' },
                            cursor: 'pointer'
                          }}
                        >
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            <Chip 
                              label={p.planName}
                              size='small'
                              sx={{ bgcolor: '#e8f5e9', color: '#16a34a', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            {p.productName}
                          </TableCell>
                          <TableCell align='right' sx={{ py: 2, fontWeight: 600, color: '#059669' }}>
                            {p.quantity?.toLocaleString()}
                          </TableCell>
                          <TableCell align='center' sx={{ py: 2 }}>
                            <Tooltip title='Start Production Cycle'>
                              <IconButton
                                size='small'
                                onClick={() => handleStartCycle(p)}
                                sx={{ 
                                  color: 'white',
                                  bgcolor: '#059669',
                                  '&:hover': { bgcolor: '#10b981' }
                                }}
                              >
                                <PlayArrowIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component='div'
                count={filteredPlans.length}
                page={plansPage}
                onPageChange={(e, newPage) => setPlansPage(newPage)}
                rowsPerPage={plansRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setPlansRowsPerPage(parseInt(e.target.value, 10));
                  setPlansPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  bgcolor: '#f8fafc',
                  borderTop: '1px solid #e5e7eb',
                  '& .MuiTablePagination-toolbar': {
                    px: 3,
                    py: 2
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Production Cycles Table */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0277bd' }}>
                <TimelineIcon />
              </Avatar>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                Production Cycles Overview
              </Typography>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#059669' }} />
              <Typography sx={{ ml: 2, color: 'text.secondary', fontWeight: 500 }}>
                Loading cycles...
              </Typography>
            </Box>
          ) : filteredCycles.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8,
              bgcolor: '#f8fafc'
            }}>
              <Avatar sx={{ bgcolor: '#e5e7eb', color: '#6b7280', width: 64, height: 64, mb: 2 }}>
                <FactoryIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                No Production Cycles
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Start your first production cycle from approved plans
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Cycle ID
                      </TableCell>
                      <TableCell sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Product
                      </TableCell>
                      <TableCell align='right' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Planned Qty
                      </TableCell>
                      <TableCell align='right' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Completed Qty
                      </TableCell>
                      <TableCell align='right' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Labor Cost
                      </TableCell>
                      <TableCell align='right' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Overhead Cost
                      </TableCell>
                      <TableCell align='right' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Material Cost
                      </TableCell>
                      <TableCell align='right' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Total Cost
                      </TableCell>
                      <TableCell align='center' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Status
                      </TableCell>
                      <TableCell align='center' sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, py: 2 }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCycles.map((c, index) => {
                      const actualIndex = page * rowsPerPage + index;
                      const isEven = actualIndex % 2 === 0;
                      return (
                        <TableRow
                          key={c.id}
                          hover
                          sx={{
                            bgcolor: isEven ? '#fafafa' : 'white',
                            '&:hover': { bgcolor: '#f0fdf4' },
                            cursor: 'pointer'
                          }}
                        >
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            <Chip 
                              label={c.batchNo?.replace(/[^0-9]/g, '') || c.name?.replace(/[^0-9]/g, '') || c.id.slice(-6)}
                              size='small'
                              sx={{ bgcolor: '#e0f2fe', color: '#0277bd', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            {c.productName}
                          </TableCell>
                          <TableCell align='right' sx={{ py: 2, fontWeight: 600 }}>
                            {c.quantityPlanned?.toLocaleString()}
                          </TableCell>
                          <TableCell align='right' sx={{ py: 2, fontWeight: 600, color: '#059669' }}>
                            {(c.quantityCompleted || 0).toLocaleString()}
                          </TableCell>
                          <TableCell align='right' sx={{ py: 2 }}>
                            <CurrencyDisplay amount={c.costSummary?.laborCost} />
                          </TableCell>
                          <TableCell align='right' sx={{ py: 2 }}>
                            <CurrencyDisplay amount={c.costSummary?.overheadCost} />
                          </TableCell>
                          <TableCell align='right' sx={{ py: 2 }}>
                            <CurrencyDisplay amount={c.costSummary?.materialCost} />
                          </TableCell>
                          <TableCell align='right' sx={{ py: 2, fontWeight: 700, color: '#059669' }}>
                            <CurrencyDisplay amount={c.costSummary?.totalCost} />
                          </TableCell>
                          <TableCell align='center' sx={{ py: 2 }}>
                            <Chip
                              label={c.status || 'unknown'}
                              size='small'
                              color={getStatusColor(c.status)}
                              sx={{ 
                                textTransform: 'capitalize',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell align='center' sx={{ py: 2 }}>
                            {c.status !== 'completed' ? (
                              <Tooltip title='Complete Production Cycle'>
                                <IconButton
                                  size='small'
                                  onClick={() => openCompleteModal(c)}
                                  sx={{ 
                                    color: 'white',
                                    bgcolor: '#059669',
                                    '&:hover': { bgcolor: '#10b981' }
                                  }}
                                >
                                  <CheckCircleIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Chip 
                                label='Completed' 
                                size='small' 
                                sx={{ 
                                  bgcolor: '#dcfce7', 
                                  color: '#166534',
                                  fontWeight: 600
                                }} 
                                icon={<CheckCircleIcon />} 
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component='div'
                count={filteredCycles.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                sx={{
                  bgcolor: '#f8fafc',
                  borderTop: '1px solid #e5e7eb',
                  '& .MuiTablePagination-toolbar': {
                    px: 3,
                    py: 2
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Attach Raw Materials Modal */}
      {showRawMaterialModal && selectedPlan && (
        <AttachRawMaterials
          plan={selectedPlan}
          onClose={() => {
            setShowRawMaterialModal(false);
            setSelectedPlan(null);
          }}
        />
      )}

      {/* Complete Cycle Dialog */}
      <Dialog
        open={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedCycle(null);
        }}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#059669',
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon />
            Complete Production Cycle - {selectedCycle?.productName}
          </Box>
          <IconButton
            onClick={() => {
              setShowCompleteModal(false);
              setSelectedCycle(null);
            }}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Produced Quantity'
                type='number'
                value={completeForm.producedQty}
                onChange={(e) =>
                  setCompleteForm({
                    ...completeForm,
                    producedQty: e.target.value,
                  })
                }
                required
                size='small'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <InventoryIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Labor Cost'
                type='number'
                value={completeForm.laborCost}
                onChange={(e) =>
                  setCompleteForm({
                    ...completeForm,
                    laborCost: e.target.value,
                  })
                }
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Overhead Cost'
                type='number'
                value={completeForm.overheadCost}
                onChange={(e) =>
                  setCompleteForm({
                    ...completeForm,
                    overheadCost: e.target.value,
                  })
                }
                size='small'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button
            onClick={() => {
              setShowCompleteModal(false);
              setSelectedCycle(null);
            }}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmitCompleteCycle}
            sx={{
              bgcolor: '#059669',
              '&:hover': { bgcolor: '#10b981' },
              borderRadius: 2,
              px: 4
            }}
            startIcon={<CheckCircleIcon />}
          >
            Complete Cycle
          </Button>
        </DialogActions>
      </Dialog>

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
