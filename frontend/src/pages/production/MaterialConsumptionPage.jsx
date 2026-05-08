import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

export default function MaterialConsumptionPage() {
  const { cycles, loading } = useProduction();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const allCycles = cycles || [];
  const wipCycles = allCycles.filter((c) => c.status === 'in_progress');
  const completedCycles = allCycles.filter((c) => c.status === 'completed');

  const totalMaterialCost = allCycles.reduce((sum, c) => sum + (c.materialCost || 0), 0);
  const totalLaborCost = allCycles.reduce((sum, c) => sum + (c.laborCost || 0), 0);
  const totalOverheadCost = allCycles.reduce((sum, c) => sum + (c.overheadCost || 0), 0);
  const totalCost = allCycles.reduce((sum, c) => sum + (c.totalCost || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    
    try {
      // Handle Firestore Timestamp
      if (date?.toDate && typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
      }
      
      // Handle Firestore Timestamp with seconds
      if (date?._seconds) {
        return new Date(date._seconds * 1000).toLocaleDateString();
      }
      
      // Handle string or number
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return '-';
      }
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Material Consumption Tracking
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          Monitor raw material consumption across all production cycles
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={48} sx={{ color: '#0d9488' }} />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InventoryIcon sx={{ fontSize: 32, color: '#3b82f6', mr: 1 }} />
                    <Typography variant='body2' color='text.secondary'>
                      Material Cost
                    </Typography>
                  </Box>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {formatCurrency(totalMaterialCost)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: '#10b981', mr: 1 }} />
                    <Typography variant='body2' color='text.secondary'>
                      Labor Cost
                    </Typography>
                  </Box>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {formatCurrency(totalLaborCost)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon sx={{ fontSize: 32, color: '#f59e0b', mr: 1 }} />
                    <Typography variant='body2' color='text.secondary'>
                      Overhead Cost
                    </Typography>
                  </Box>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {formatCurrency(totalOverheadCost)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 32, color: '#0d9488', mr: 1 }} />
                    <Typography variant='body2' color='text.secondary'>
                      Total Cost
                    </Typography>
                  </Box>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {formatCurrency(totalCost)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* WIP Cycles */}
          <Card sx={{ mb: 4, boxShadow: 2 }}>
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Work-in-Progress Cycles ({wipCycles.length})
              </Typography>
              {wipCycles.length === 0 ? (
                <Alert severity='info' icon={<InventoryIcon />}>
                  No work-in-progress cycles. Start a production cycle to track material consumption.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Batch No</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Material Cost</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Started</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {wipCycles.map((cycle) => (
                        <TableRow key={cycle.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{cycle.batchNo || cycle.name}</TableCell>
                          <TableCell>{cycle.productName}</TableCell>
                          <TableCell>{cycle.quantityPlanned}</TableCell>
                          <TableCell>{formatCurrency(cycle.materialCost)}</TableCell>
                          <TableCell>
                            <Chip
                              label='In Progress'
                              color={getStatusColor(cycle.status)}
                              size='small'
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            {formatDate(cycle.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Completed Cycles */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Completed Cycles ({completedCycles.length})
              </Typography>
              {completedCycles.length === 0 ? (
                <Alert severity='info' icon={<CheckCircleIcon />}>
                  No completed cycles yet.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Batch No</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Produced</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Material</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Labor</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Overhead</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Completed</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {completedCycles.map((cycle) => (
                        <TableRow key={cycle.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{cycle.batchNo || cycle.name}</TableCell>
                          <TableCell>{cycle.productName}</TableCell>
                          <TableCell>{cycle.quantityCompleted || 0}</TableCell>
                          <TableCell>{formatCurrency(cycle.materialCost)}</TableCell>
                          <TableCell>{formatCurrency(cycle.laborCost)}</TableCell>
                          <TableCell>{formatCurrency(cycle.overheadCost)}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {formatCurrency(cycle.totalCost)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label='Completed'
                              color={getStatusColor(cycle.status)}
                              size='small'
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            {formatDate(cycle.completedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Material Consumption Details */}
          {allCycles.length > 0 && (
            <Card sx={{ mt: 4, boxShadow: 2 }}>
              <CardContent>
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Material Consumption Details
                </Typography>
                {allCycles.map((cycle) => (
                  cycle.rawMaterials && cycle.rawMaterials.length > 0 && (
                    <Box key={cycle.id} sx={{ mb: 4 }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2, color: '#475569' }}>
                        Batch: {cycle.batchNo || cycle.name} - {cycle.productName}
                      </Typography>
                      <TableContainer component={Paper} sx={{ boxShadow: 1, mb: 2 }}>
                        <Table size='small'>
                          <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Material</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Quantity Used</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cycle.rawMaterials.map((material, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{material.materialName || material.productName}</TableCell>
                                <TableCell>{material.qtyUsed || material.quantity}</TableCell>
                                <TableCell>{formatCurrency(material.unitCost || material.costPerUnit)}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {formatCurrency(material.totalCost)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Divider />
                    </Box>
                  )
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
