import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Button,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  TrendingUp as SalesIcon,
  SwapHoriz as TransferIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';

export default function StockDashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Inventory Management',
      description: 'Track stock levels, manage products, and monitor inventory movements',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      path: '/stock/inventory',
      stats: '1,234 Items'
    },
    {
      title: 'Purchase Management',
      description: 'Handle supplier orders, purchase requests, and vendor management',
      icon: <PurchaseIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/stock/purchases',
      stats: '56 Orders'
    },
    {
      title: 'Sales Management',
      description: 'Process sales orders, manage customers, and track revenue',
      icon: <SalesIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/stock/sales',
      stats: '₹2,45,678'
    },
    {
      title: 'Stock Transfers',
      description: 'Manage inter-location transfers and stock movements',
      icon: <TransferIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/stock/transfers',
      stats: '23 Pending'
    },
    {
      title: 'Reports & Analytics',
      description: 'Comprehensive reporting and business intelligence',
      icon: <ReportsIcon sx={{ fontSize: 40 }} />,
      color: '#f44336',
      path: '/stock/reports-dashboard',
      stats: '15 Reports'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and user management',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      color: '#607d8b',
      path: '/stock/user-settings',
      stats: 'Configure'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#2196f3' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Stock Management System
          </Typography>
          <Button color="inherit" startIcon={<ProfileIcon />} sx={{ mr: 2 }}>
            Profile
          </Button>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={() => navigate('/stock/login')}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Stock Management Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Comprehensive inventory and stock control system
          </Typography>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#2196f3', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  1,234
                </Typography>
                <Typography variant="body2">
                  Total Products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  ₹5.2M
                </Typography>
                <Typography variant="body2">
                  Total Inventory Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#ff9800', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  156
                </Typography>
                <Typography variant="body2">
                  Low Stock Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f44336', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  23
                </Typography>
                <Typography variant="body2">
                  Out of Stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {modules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => navigate(module.path)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: module.color,
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {module.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {module.title}
                      </Typography>
                      <Chip 
                        label={module.stats} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${module.color}20`,
                          color: module.color,
                          fontWeight: 'medium'
                        }} 
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {module.description}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: module.color,
                      '&:hover': {
                        bgcolor: module.color,
                        filter: 'brightness(0.9)'
                      }
                    }}
                  >
                    Access Module
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}