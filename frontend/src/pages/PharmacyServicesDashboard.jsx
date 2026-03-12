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
  LocalPharmacy as PharmacyIcon,
  Receipt as PrescriptionIcon,
  RequestQuote as QuoteIcon,
  ShoppingBag as OrderIcon,
  Payment as PaymentIcon,
  Phone as CallCenterIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';

export default function PharmacyServicesDashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Pharmacy Management',
      description: 'Manage pharmacy locations, staff, and operations',
      icon: <PharmacyIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      path: '/pharmacy/doctors',
      stats: '15 Pharmacies'
    },
    {
      title: 'Prescription Management',
      description: 'Handle prescriptions, verification, and dispensing',
      icon: <PrescriptionIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/pharmacy/prescriptions',
      stats: '234 Active'
    },
    {
      title: 'Quote Management',
      description: 'Generate and manage customer quotes and estimates',
      icon: <QuoteIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/pharmacy/quotes',
      stats: '56 Pending'
    },
    {
      title: 'Order Processing',
      description: 'Process customer orders and manage fulfillment',
      icon: <OrderIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/pharmacy/orders',
      stats: '89 Orders'
    },
    {
      title: 'Payment Processing',
      description: 'Handle payments, billing, and financial transactions',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#f44336',
      path: '/pharmacy/payments',
      stats: '₹3.4M Revenue'
    },
    {
      title: 'Call Center',
      description: 'Customer service and support management',
      icon: <CallCenterIcon sx={{ fontSize: 40 }} />,
      color: '#607d8b',
      path: '/pharmacy/callcenter',
      stats: '12 Active Calls'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#ff9800' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Pharmacy Services System
          </Typography>
          <Button color="inherit" startIcon={<ProfileIcon />} sx={{ mr: 2 }}>
            Profile
          </Button>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={() => navigate('/pharmacy/login')}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Pharmacy Services Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Complete pharmacy management and customer service solution
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
                  Total Prescriptions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  56
                </Typography>
                <Typography variant="body2">
                  Pending Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#ff9800', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  23
                </Typography>
                <Typography variant="body2">
                  Active Quotes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f44336', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  ₹45K
                </Typography>
                <Typography variant="body2">
                  Today's Revenue
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