import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Analytics as AnalyticsIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { useStock } from '../../context/stockContext';
import ProductSettingsTable from '../../components/stock/ProductSettingsTable';
import ProductSettingForm from '../../components/stock/ProductSettingForm';

export default function ProductSettingsPage() {
  const {
    productSettings,
    loading,
    addProductSetting,
    updateProductSetting,
    deleteProductSetting,
  } = useStock();

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const totalProducts = productSettings.length;
    const activeProducts = productSettings.filter(p => p.status === 'Active').length;
    const draftProducts = productSettings.filter(p => p.status === 'Draft').length;
    const inactiveProducts = productSettings.filter(p => p.status === 'Inactive').length;
    
    const productTypes = productSettings.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});
    
    const categories = productSettings.reduce((acc, p) => {
      acc[p.productCategory] = (acc[p.productCategory] || 0) + 1;
      return acc;
    }, {});
    
    const storeCategories = productSettings.reduce((acc, p) => {
      acc[p.storeCategory] = (acc[p.storeCategory] || 0) + 1;
      return acc;
    }, {});

    const activationRate = totalProducts > 0 ? (activeProducts / totalProducts) * 100 : 0;

    return {
      totalProducts,
      activeProducts,
      draftProducts,
      inactiveProducts,
      productTypes,
      categories,
      storeCategories,
      activationRate,
      topCategory: Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, 'None'),
      topStoreCategory: Object.keys(storeCategories).reduce((a, b) => storeCategories[a] > storeCategories[b] ? a : b, 'None')
    };
  }, [productSettings]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (selected) await updateProductSetting(selected.id, data);
      else await addProductSetting(data);
      setShowForm(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDialog = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleCloseDialog = () => {
    setShowForm(false);
    setSelected(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                mb: 1,
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Product Settings Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage products, services, and inventory configurations
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Data">
              <IconButton 
                sx={{ 
                  bgcolor: 'white', 
                  boxShadow: 2,
                  '&:hover': { bgcolor: '#f1f5f9' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Products">
              <IconButton 
                sx={{ 
                  bgcolor: 'white', 
                  boxShadow: 2,
                  '&:hover': { bgcolor: '#f1f5f9' }
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{
                bgcolor: '#0d9488',
                '&:hover': { bgcolor: '#14b8a6' },
                borderRadius: 2,
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
              }}
            >
              Add Product
            </Button>
          </Stack>
        </Stack>

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Products
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {metrics.totalProducts}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <InventoryIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Active Products
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {metrics.activeProducts}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <TrendingUpIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Draft Products
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {metrics.draftProducts}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <AssessmentIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(250, 112, 154, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Categories
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {Object.keys(metrics.categories).length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <CategoryIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Insights Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Product Activation Rate
                  </Typography>
                  <Chip 
                    label={`${metrics.activationRate.toFixed(1)}%`} 
                    color={metrics.activationRate >= 80 ? 'success' : metrics.activationRate >= 60 ? 'warning' : 'error'}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.activationRate} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: metrics.activationRate >= 80 ? '#10b981' : metrics.activationRate >= 60 ? '#f59e0b' : '#ef4444',
                      borderRadius: 4
                    }
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {metrics.activeProducts} of {metrics.totalProducts} products are active
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Stats
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CategoryIcon sx={{ color: '#0d9488', fontSize: 20 }} />
                      <Typography variant="body2">Top Category:</Typography>
                    </Stack>
                    <Chip label={metrics.topCategory} size="small" variant="outlined" />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <StoreIcon sx={{ color: '#0d9488', fontSize: 20 }} />
                      <Typography variant="body2">Top Store Type:</Typography>
                    </Stack>
                    <Chip label={metrics.topStoreCategory} size="small" variant="outlined" />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocalOfferIcon sx={{ color: '#0d9488', fontSize: 20 }} />
                      <Typography variant="body2">Product Types:</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      {Object.entries(metrics.productTypes).map(([type, count]) => (
                        <Chip key={type} label={`${type}: ${count}`} size="small" />
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content - Product Table */}
      <Paper 
        sx={{ 
          borderRadius: 3, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <ProductSettingsTable
          data={productSettings}
          loading={loading}
          onAdd={handleOpenDialog}
          onEdit={(item) => {
            setSelected(item);
            setShowForm(true);
          }}
          onDelete={(id) => deleteProductSetting(id)}
        />
      </Paper>

      {/* Form Dialog */}
      <Dialog
        open={showForm}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            maxHeight: '90vh'
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#0d9488',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.25rem',
            py: 2,
          }}
        >
          {selected ? 'Edit Product Setting' : 'Add Product or Service'}
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: 'white', overflow: 'auto' }}>
          <ProductSettingForm
            initialData={selected}
            saving={saving}
            onCancel={handleCloseDialog}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack alignItems="center" spacing={2}>
              <LinearProgress sx={{ width: 200 }} />
              <Typography>Loading product settings...</Typography>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
