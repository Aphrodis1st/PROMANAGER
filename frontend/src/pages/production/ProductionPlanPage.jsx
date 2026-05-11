import React, { useState, useMemo } from 'react';
import { useProduction } from '../../context/ProductionContext';
import ProductionPlanForm from '../../components/prodution/ProductionPlanForm';
import { useStock } from '../../context/stockContext';
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
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

export default function ProductionPlanPage() {
  const { plans, createPlan, deletePlan, approvePlan, loading } =
    useProduction();
  const { productSettings } = useStock();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ✅ Filter finished products only
  const finishedProducts = useMemo(() => {
    if (!productSettings) return [];
    return productSettings.filter(
      (p) =>
        p.storeCategory?.toLowerCase() === 'finished products' &&
        p.status?.toLowerCase() === 'active'
    );
  }, [productSettings]);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    if (!Array.isArray(plans)) return { total: 0, planned: 0, approved: 0, totalQty: 0 };
    return {
      total: plans.length,
      planned: plans.filter(p => p.status === 'planned').length,
      approved: plans.filter(p => p.status === 'approved').length,
      totalQty: plans.reduce((sum, p) => sum + (p.quantity || p.plannedQty || 0), 0),
    };
  }, [plans]);

  // ✅ Create new plan
  const handleCreate = async (data) => {
    try {
      await createPlan(data);
      setShowForm(false);
      setSearch('');
      setPage(0);
      setSnackbar({ open: true, message: 'Production plan created successfully!', severity: 'success' });
    } catch (err) {
      console.error('❌ Error creating plan:', err);
      setSnackbar({ open: true, message: 'Failed to create production plan', severity: 'error' });
    }
  };

  // ✅ Approve plan
  const handleApprove = async (plan) => {
    if (!plan?.id) {
      setSnackbar({ open: true, message: 'Plan ID is missing', severity: 'error' });
      return;
    }

    try {
      await approvePlan(plan);
      setSnackbar({
        open: true,
        message: `Plan "${plan.planName || plan.finishedProductName}" approved successfully`,
        severity: 'success',
      });
    } catch (err) {
      console.error('❌ Error approving plan:', err);
      setSnackbar({ open: true, message: 'Failed to approve plan', severity: 'error' });
    }
  };

  // ✅ Delete plan
  const handleDelete = async (plan) => {
    if (!plan?.id) return;
    if (!window.confirm(`Are you sure you want to delete "${plan.planName}"?`))
      return;

    try {
      await deletePlan(plan.id);
      setSnackbar({ open: true, message: `Plan "${plan.planName}" deleted successfully`, severity: 'success' });
    } catch (err) {
      console.error('❌ Error deleting plan:', err);
      setSnackbar({ open: true, message: 'Failed to delete plan', severity: 'error' });
    }
  };

  // Filter and pagination
  const filteredPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    return plans.filter((plan) => {
      const searchLower = search.toLowerCase();
      return (
        (plan.planName || '').toLowerCase().includes(searchLower) ||
        (plan.productName || plan.finishedProductName || '').toLowerCase().includes(searchLower) ||
        (plan.status || '').toLowerCase().includes(searchLower)
      );
    });
  }, [plans, search]);

  const paginatedPlans = filteredPlans.slice(
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

  // Dashboard stat card component
  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <Card sx={{ 
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      height: '100%',
    }}>
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color }}>
              {value}
            </Typography>
            {subtext && (
              <Typography sx={{ fontSize: '0.75rem', color: 'textSecondary', mt: 0.5 }}>
                {subtext}
              </Typography>
            )}
          </Box>
          <Icon sx={{ fontSize: '2.5rem', color: `${color}60`, opacity: 0.7 }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div className='p-6 flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Production Planning Dashboard
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          Manage and monitor all production plans
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUpIcon}
            label="Total Plans"
            value={stats.total}
            color="#0d9488"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ScheduleIcon}
            label="Pending Approval"
            value={stats.planned}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CheckCircleOutlineIcon}
            label="Approved Plans"
            value={stats.approved}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUpIcon}
            label="Total Quantity"
            value={stats.totalQty.toLocaleString()}
            color="#8b5cf6"
            subtext="units"
          />
        </Grid>
      </Grid>

      {/* Main Table Section */}
      <Card sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      }}>
        {/* Toolbar */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}>
          <Typography variant='h6' sx={{ fontWeight: 600, color: '#1e293b' }}>
            Production Plans
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder='Search by plan name, product...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size='small'
              sx={{ 
                width: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: '#f8fafc',
                }
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1.2rem' }} />,
              }}
            />
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{
                bgcolor: '#0d9488',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 1.5,
                '&:hover': {
                  bgcolor: '#0f766e',
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                },
              }}
            >
              Create Plan
            </Button>
          </Box>
        </Box>

        {/* Table Container */}
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2, color: 'text.secondary' }}>
                Loading production plans...
              </Typography>
            </Box>
          ) : filteredPlans.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
              <Typography color='text.secondary' sx={{ fontSize: '1rem' }}>
                {search ? 'No plans match your search' : 'No production plans yet. Create one to get started!'}
              </Typography>
            </Box>
          ) : (
            <Table size='medium' stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{
                    bgcolor: '#0d9488',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Plan Code
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#0d9488',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Product
                  </TableCell>
                  <TableCell align='right' sx={{
                    bgcolor: '#0d9488',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Quantity
                  </TableCell>
                  <TableCell align='center' sx={{
                    bgcolor: '#0d9488',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Status
                  </TableCell>
                  <TableCell align='center' sx={{
                    bgcolor: '#0d9488',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPlans.map((plan, index) => {
                  const actualIndex = page * rowsPerPage + index;
                  const isEven = actualIndex % 2 === 0;
                  return (
                    <TableRow
                      key={plan.id}
                      hover
                      sx={{
                        bgcolor: isEven ? '#ffffff' : '#f8fafc',
                        '&:hover': {
                          bgcolor: '#f0fdf4',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell sx={{ color: '#1e293b', py: 2, fontWeight: 600, fontSize: '0.95rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: plan.status === 'approved' ? '#10b981' : '#f59e0b',
                          }} />
                          {plan.planCode || plan.planName?.replace(/[^0-9]/g, '') || plan.id.slice(-6)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#475569', py: 2 }}>
                        {plan.productName || plan.finishedProductName || 'Unknown Product'}
                      </TableCell>
                      <TableCell align='right' sx={{ color: '#1e293b', py: 2, fontWeight: 600 }}>
                        {(plan.quantity ?? plan.plannedQty ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell align='center' sx={{ py: 2 }}>
                        <Chip
                          label={plan.status || 'unknown'}
                          size='small'
                          icon={plan.status === 'approved' ? <CheckCircleIcon /> : undefined}
                          sx={{
                            bgcolor: plan.status === 'approved' ? '#d1fae5' : '#fef3c7',
                            color: plan.status === 'approved' ? '#065f46' : '#92400e',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell align='center' sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          {plan.status === 'planned' && (
                            <Tooltip title='Approve Plan'>
                              <IconButton
                                size='small'
                                onClick={() => handleApprove(plan)}
                                sx={{
                                  color: '#0d9488',
                                  '&:hover': {
                                    bgcolor: '#d1fae5',
                                  },
                                }}
                              >
                                <CheckCircleIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title='Delete Plan'>
                            <IconButton
                              size='small'
                              onClick={() => handleDelete(plan)}
                              sx={{
                                color: '#ef4444',
                                '&:hover': {
                                  bgcolor: '#fee2e2',
                                },
                              }}
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        {filteredPlans.length > 0 && (
          <TablePagination
            component='div'
            count={filteredPlans.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: '#f8fafc',
              '& .MuiTablePagination-toolbar': {
                py: 2,
              },
            }}
          />
        )}
      </Card>

      {/* Form Dialog */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 700, color: '#0d9488', mb: 3 }}>
            Create New Production Plan
          </Typography>
          <ProductionPlanForm
            onSubmit={handleCreate}
            finishedProducts={finishedProducts}
          />
        </Box>
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
            borderRadius: 1.5,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
