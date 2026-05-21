import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid,
  Avatar,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  IconButton
} from '@mui/material';
import { 
  Inventory as StockIcon, 
  LocalHospital as HospitalIcon, 
  LocalPharmacy as PharmacyIcon,
  CheckCircle as CheckIcon,
  TrendingUp as GrowthIcon,
  Security as SecurityIcon,
  Speed as PerformanceIcon,
  Support as SupportIcon,
  CloudDone as CloudIcon,
  Business as BusinessIcon,
  Store as RetailIcon,
  AccountBalance as BankIcon,
  Analytics as AnalyticsIcon,
  AutoMode as AutomationIcon,
  TrendingUp as ScaleIcon,
  Dashboard as DashboardIcon,
  DataUsage as DataIcon,
  Architecture as ArchIcon,
  PlayArrow as PlayIcon,
  GetApp as DownloadIcon,
  Explore as ExploreIcon,
  People as HRIcon,
  Home as PropertyIcon
} from '@mui/icons-material';

export default function ServiceSelection() {
  const navigate = useNavigate();

  const heroFeatures = [
    'Increase operational efficiency by up to 40%',
    'Centralized business data management', 
    'Smart analytics & automated workflows',
    'Real-time monitoring of all business activities',
    'Secure cloud infrastructure with enterprise protection',
    'Scalable architecture for growing organizations'
  ];

  const industries = [
    {
      title: 'Retail & Inventory Businesses',
      description: 'Manage product inventory, track sales performance, optimize supply chains, and automate procurement processes.',
      icon: <RetailIcon sx={{ fontSize: 48 }} />,
      color: '#1976d2'
    },
    {
      title: 'Healthcare Facilities', 
      description: 'Digitize hospital workflows including patient records, appointment scheduling, laboratory management, and billing.',
      icon: <HospitalIcon sx={{ fontSize: 48 }} />,
      color: '#388e3c'
    },
    {
      title: 'Pharmaceutical Businesses',
      description: 'Ensure regulatory compliance while managing prescriptions, drug inventories, and customer service operations efficiently.',
      icon: <PharmacyIcon sx={{ fontSize: 48 }} />,
      color: '#f57c00'
    },
    {
      title: 'Multi-Branch Organizations',
      description: 'Monitor and manage operations across multiple locations with real-time data synchronization and centralized reporting.',
      icon: <BusinessIcon sx={{ fontSize: 48 }} />,
      color: '#7b1fa2'
    }
  ];

  const platformAdvantages = [
    {
      title: 'Centralized Management',
      description: 'Manage multiple business systems from a single dashboard.',
      icon: <DashboardIcon />,
      color: '#1976d2'
    },
    {
      title: 'Real-Time Data Intelligence',
      description: 'Access live data insights that support faster and more informed decision-making.',
      icon: <DataIcon />,
      color: '#388e3c'
    },
    {
      title: 'Automation',
      description: 'Reduce manual work through intelligent automation of business workflows.',
      icon: <AutomationIcon />,
      color: '#f57c00'
    },
    {
      title: 'Scalability',
      description: 'Grow your operations without needing to replace systems.',
      icon: <ScaleIcon />,
      color: '#7b1fa2'
    },
    {
      title: 'Enterprise Security',
      description: 'Advanced encryption and secure data storage.',
      icon: <SecurityIcon />,
      color: '#d32f2f'
    },
    {
      title: 'Cloud Infrastructure',
      description: 'Access your platform anywhere with reliable cloud hosting.',
      icon: <CloudIcon />,
      color: '#0288d1'
    }
  ];

  const statistics = [
    { number: '10,000+', label: 'Businesses Supported' },
    { number: '1M+', label: 'Transactions Processed' },
    { number: '500K+', label: 'Inventory Items Managed' },
    { number: '50K+', label: 'Patient Records Processed' }
  ];

  const stockCapabilities = [
    'Real-time inventory synchronization',
    'Automated stock level alerts',
    'Supplier performance analytics',
    'Purchase order automation',
    'Multi-warehouse inventory control',
    'Barcode & QR-based product tracking',
    'Inventory valuation and profit analysis'
  ];

  const clinicalModules = [
    'Electronic Medical Records (EMR)',
    'Patient history & treatment tracking',
    'Doctor appointment scheduling',
    'Laboratory request & results integration',
    'Medical imaging record management',
    'ICU and ward management',
    'Billing & insurance claim processing'
  ];

  const pharmacyCapabilities = [
    'Smart prescription verification',
    'Drug interaction alerts',
    'Controlled medication tracking',
    'Expiry date monitoring',
    'Supplier purchase automation',
    'Insurance billing integration',
    'Pharmacy sales analytics'
  ];

  return (
    <>
      <Navbar />
      <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Hero Section */}
        <Box textAlign="center" mb={10}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: { xs: 2, sm: 3 },
              letterSpacing: '-0.02em'
            }}
          >
            PROMANAGER
          </Typography>
          
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 600,
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' }
            }}
          >
            The Complete Digital Management Platform
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 900,
              mx: 'auto',
              lineHeight: 1.8,
              mb: { xs: 3, sm: 4, md: 5 },
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              fontWeight: 400,
              px: { xs: 2, sm: 0 }
            }}
          >
            A powerful all-in-one management ecosystem designed to help organizations
            streamline operations, improve decision-making, and scale efficiently.
          </Typography>

          {/* Hero Buttons */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 3 }} 
            justifyContent="center"
            sx={{ mb: { xs: 6, sm: 8 }, px: { xs: 2, sm: 0 } }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4, md: 5 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 10px 30px rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 40px rgba(255, 255, 255, 0.4)',
                }
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ExploreIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4, md: 5 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderColor: 'white',
                  borderWidth: 2,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              Explore Solutions
            </Button>
          </Stack>
        </Box>

        {/* Platform Statistics */}
        <Box 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            mb: { xs: 4, sm: 5, md: 6 }, 
            textAlign: 'center'
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {statistics.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 900, 
                      color: 'white',
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      mb: { xs: 0.5, sm: 1 },
                      textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' } }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Industries We Serve */}
        <Box mb={{ xs: 6, sm: 8, md: 10 }}>
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Designed for Modern Businesses Across Multiple Industries
          </Typography>
          
          <Typography 
            variant="h6" 
            textAlign="center" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 1000,
              mx: 'auto',
              mb: 2,
              lineHeight: 1.7
            }}
          >
            PROMANAGER is built to serve a wide range of industries that require
            efficient management of operations, inventory, healthcare records,
            and pharmaceutical services.
          </Typography>
          
          <Typography 
            variant="body1" 
            textAlign="center" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 1000,
              mx: 'auto',
              mb: 6,
              lineHeight: 1.7
            }}
          >
            Our modular architecture allows organizations to adopt the specific
            systems they need while maintaining a unified platform for analytics,
            reporting, and operational control.
          </Typography>

          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {industries.map((industry, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 3 }}>
                      <Box
                        sx={{
                          bgcolor: industry.color,
                          width: { xs: 48, sm: 56, md: 64 },
                          height: { xs: 48, sm: 56, md: 64 },
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: { xs: 2, sm: 3 },
                          color: 'white'
                        }}
                      >
                        {industry.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } }}>
                        {industry.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {industry.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Enhanced Stock Management Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '2px solid rgba(25, 118, 210, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(25, 118, 210, 0.15)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#1976d2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: { xs: 'auto', md: 0 },
                    mb: 2,
                    color: 'white'
                  }}
                >
                  <StockIcon sx={{ fontSize: 32 }} />
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                  Stock Management System
                </Typography>
                
                <Typography variant="body2" paragraph sx={{ color: '#666', lineHeight: 1.5, mb: 2 }}>
                  Complete inventory intelligence platform for stock control, procurement automation, and supply chain optimization.
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/stock/login')}
                  sx={{
                    bgcolor: '#1976d2',
                    py: 1,
                    px: 2.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      bgcolor: '#1565c0',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                    }
                  }}
                >
                  Access Stock Management
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 2, border: '1px solid rgba(25, 118, 210, 0.2)' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', mb: 1.5 }}>
                  Key Features
                </Typography>
                <List dense>
                  {stockCapabilities.slice(0, 4).map((capability, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.3 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={capability}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: 500, fontSize: '0.85rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Enhanced Hospital Management Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '2px solid rgba(56, 142, 60, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(56, 142, 60, 0.15)',
              border: '2px solid rgba(56, 142, 60, 0.3)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'rgba(56, 142, 60, 0.08)', borderRadius: 2, border: '1px solid rgba(56, 142, 60, 0.2)' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#388e3c', mb: 1.5 }}>
                  Key Features
                </Typography>
                <List dense>
                  {clinicalModules.slice(0, 4).map((module, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.3 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={module}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: 500, fontSize: '0.85rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#388e3c',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: { xs: 'auto', md: 0 },
                    mb: 2,
                    color: 'white'
                  }}
                >
                  <HospitalIcon sx={{ fontSize: 32 }} />
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#388e3c', mb: 1 }}>
                  Hospital Management System
                </Typography>
                
                <Typography variant="body2" paragraph sx={{ color: '#666', lineHeight: 1.5, mb: 2 }}>
                  Comprehensive digital healthcare platform for clinical, administrative, and financial operations.
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/hospital/admin/dashboard')}
                  sx={{
                    bgcolor: '#388e3c',
                    py: 1,
                    px: 2.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(56, 142, 60, 0.3)',
                    '&:hover': {
                      bgcolor: '#2e7d32',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(56, 142, 60, 0.4)',
                    }
                  }}
                >
                  Access Hospital System
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Super Admin Access Section */}
        <Paper 
          elevation={12}
          sx={{ 
            p: { xs: 4, sm: 5, md: 6 }, 
            mb: { xs: 6, sm: 7, md: 8 }, 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(238, 90, 36, 0.3)'
          }}
        >
          <Avatar
            sx={{
              width: { xs: 80, sm: 90, md: 100 },
              height: { xs: 80, sm: 90, md: 100 },
              bgcolor: 'rgba(255,255,255,0.2)',
              mx: 'auto',
              mb: { xs: 2, sm: 3 }
            }}
          >
            <SecurityIcon sx={{ fontSize: { xs: 40, sm: 45, md: 50 } }} />
          </Avatar>
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}>
            Super Admin Access
          </Typography>
          
          <Typography variant="h6" paragraph sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.7 }}>
            System administrators can access the Super Admin panel to manage hospitals, 
            hospital administrators, monitor system-wide activities, and configure platform settings.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7, opacity: 0.9 }}>
            This is a restricted area requiring special authentication credentials.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/super-admin/login')}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              textTransform: 'none',
              mt: 3,
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            🔐 Access Super Admin Panel
          </Button>
        </Paper>

        {/* Enhanced Pharmacy Services Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '2px solid rgba(245, 124, 0, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(245, 124, 0, 0.15)',
              border: '2px solid rgba(245, 124, 0, 0.3)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#f57c00',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: { xs: 'auto', md: 0 },
                    mb: 2,
                    color: 'white'
                  }}
                >
                  <PharmacyIcon sx={{ fontSize: 32 }} />
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#f57c00', mb: 1 }}>
                  Pharmacy Services System
                </Typography>
                
                <Typography variant="body2" paragraph sx={{ color: '#666', lineHeight: 1.5, mb: 2 }}>
                  Pharmacy management with prescription processing, inventory control, and compliance reporting.
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/pharmacy/dashboard')}
                  sx={{
                    bgcolor: '#f57c00',
                    py: 1,
                    px: 2.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(245, 124, 0, 0.3)',
                    '&:hover': {
                      bgcolor: '#ef6c00',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(245, 124, 0, 0.4)',
                    }
                  }}
                >
                  Access Pharmacy System
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'rgba(245, 124, 0, 0.08)', borderRadius: 2, border: '1px solid rgba(245, 124, 0, 0.2)' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#f57c00', mb: 1.5 }}>
                  Key Features
                </Typography>
                <List dense>
                  {pharmacyCapabilities.slice(0, 4).map((capability, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.3 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={capability}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: 500, fontSize: '0.85rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* HR & Payroll System Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            background: 'linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '2px solid rgba(94, 53, 177, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(94, 53, 177, 0.15)',
              border: '2px solid rgba(94, 53, 177, 0.3)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'rgba(94, 53, 177, 0.08)', borderRadius: 2, border: '1px solid rgba(94, 53, 177, 0.2)' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#5e35b1', mb: 1.5 }}>
                  Key Features
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Employee Management" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Attendance & Shift Management" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Payroll with Tax Calculation" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Performance Management" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#5e35b1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: { xs: 'auto', md: 0 },
                    mb: 2,
                    color: 'white'
                  }}
                >
                  <HRIcon sx={{ fontSize: 32 }} />
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#5e35b1', mb: 1 }}>
                  HR & Payroll Management
                </Typography>
                
                <Typography variant="body2" paragraph sx={{ color: '#666', lineHeight: 1.5, mb: 2 }}>
                  Enterprise HR platform for employee management, attendance tracking, and payroll processing.
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/hr/dashboard')}
                  sx={{
                    bgcolor: '#5e35b1',
                    py: 1,
                    px: 2.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(94, 53, 177, 0.3)',
                    '&:hover': {
                      bgcolor: '#512da8',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(94, 53, 177, 0.4)',
                    }
                  }}
                >
                  Access HR System
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Property Management System Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            background: 'linear-gradient(135deg, #ffebee 0%, #ffffff 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '2px solid rgba(211, 47, 47, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(211, 47, 47, 0.15)',
              border: '2px solid rgba(211, 47, 47, 0.3)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#d32f2f',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: { xs: 'auto', md: 0 },
                    mb: 2,
                    color: 'white'
                  }}
                >
                  <PropertyIcon sx={{ fontSize: 32 }} />
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                  Property Management System
                </Typography>
                
                <Typography variant="body2" paragraph sx={{ color: '#666', lineHeight: 1.5, mb: 2 }}>
                  Complete solution for managing properties, tenants, leases, billing, and maintenance operations.
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/property')}
                  sx={{
                    bgcolor: '#d32f2f',
                    py: 1,
                    px: 2.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)',
                    '&:hover': {
                      bgcolor: '#c62828',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    }
                  }}
                >
                  Access Property Management
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'rgba(211, 47, 47, 0.08)', borderRadius: 2, border: '1px solid rgba(211, 47, 47, 0.2)' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#d32f2f', mb: 1.5 }}>
                  Key Features
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Properties & Units Management" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Tenant & Lease Management" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Automated Billing & Invoicing" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="Owner & Tenant Portals" primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontSize: '0.85rem' } }} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Platform Advantages */}
        <Box mb={10}>
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Why Businesses Choose PROMANAGER
          </Typography>

          <Grid container spacing={4}>
            {platformAdvantages.map((advantage, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: advantage.color,
                        width: 72,
                        height: 72,
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      {advantage.icon}
                    </Avatar>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                      {advantage.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {advantage.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Platform Architecture */}
        <Paper 
          elevation={12}
          sx={{ 
            p: 6, 
            mb: 8, 
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4
          }}
        >
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: '#333',
              mb: 6
            }}
          >
            PROMANAGER Platform Architecture
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={4}
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  User Interface Layer
                </Typography>
                <Typography variant="body1">
                  Web Application / Mobile Access
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={4}
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <ArchIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Application Services
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Inventory Engine</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Healthcare Engine</Typography>
                <Typography variant="body2">Pharmacy Engine</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={4}
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <DataIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Data Layer
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Secure Cloud Database</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Encrypted Storage</Typography>
                <Typography variant="body2">Backup & Disaster Recovery</Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Call to Action Section */}
        <Paper 
          elevation={12}
          sx={{ 
            mt: 8, 
            p: 8, 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
            Ready to Transform Your Business Operations?
          </Typography>
          <Typography variant="h5" paragraph sx={{ color: '#666', mb: 4, maxWidth: 800, mx: 'auto' }}>
            Join thousands of businesses already using PROMANAGER to streamline operations, 
            reduce costs, and accelerate growth with intelligent automation.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              sx={{
                bgcolor: '#4caf50',
                py: 2.5,
                px: 5,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
                '&:hover': {
                  bgcolor: '#388e3c',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(76, 175, 80, 0.5)',
                }
              }}
            >
              Start Your Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<DownloadIcon />}
              sx={{
                color: '#1976d2',
                borderColor: '#1976d2',
                py: 2.5,
                px: 5,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  borderColor: '#1976d2',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Download Brochure
            </Button>
          </Stack>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Chip 
              label="✓ Free 30-Day Trial" 
              color="success" 
              variant="outlined" 
              size="large" 
              sx={{ fontSize: '1rem', py: 3 }}
            />
            <Chip 
              label="✓ No Setup Fees" 
              color="primary" 
              variant="outlined" 
              size="large" 
              sx={{ fontSize: '1rem', py: 3 }}
            />
            <Chip 
              label="✓ 24/7 Expert Support" 
              color="secondary" 
              variant="outlined" 
              size="large" 
              sx={{ fontSize: '1rem', py: 3 }}
            />
            <Chip 
              label="✓ Money-Back Guarantee" 
              color="warning" 
              variant="outlined" 
              size="large" 
              sx={{ fontSize: '1rem', py: 3 }}
            />
          </Box>
        </Paper>

        {/* Enhanced Footer */}
        <Paper 
          elevation={8}
          sx={{ 
            mt: 8, 
            p: 6, 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} md={3}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
                Solutions
              </Typography>
              <Stack spacing={2}>
                <Button 
                  variant="text" 
                  sx={{ justifyContent: 'flex-start', color: '#666' }}
                  onClick={() => navigate('/stock/login')}
                >
                  Stock Management
                </Button>
                <Button 
                  variant="text" 
                  sx={{ justifyContent: 'flex-start', color: '#666' }}
                  onClick={() => navigate('/hospital/admin/dashboard')}
                >
                  Hospital Management
                </Button>
                <Button 
                  variant="text" 
                  sx={{ justifyContent: 'flex-start', color: '#666' }}
                  onClick={() => navigate('/pharmacy/dashboard')}
                >
                  Pharmacy System
                </Button>
                <Button 
                  variant="text" 
                  sx={{ justifyContent: 'flex-start', color: '#666' }}
                  onClick={() => navigate('/super-admin/login')}
                >
                  🔐 Super Admin Access
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
                Resources
              </Typography>
              <Stack spacing={2}>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Documentation
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Support Center
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  API Integration
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Training Videos
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
                Company
              </Typography>
              <Stack spacing={2}>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  About PROMANAGER
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Careers
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Contact Us
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Privacy Policy
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
                Connect
              </Typography>
              <Stack spacing={2}>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  LinkedIn
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Twitter
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  Facebook
                </Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start', color: '#666' }}>
                  YouTube
                </Button>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box textAlign="center">
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#333',
                fontWeight: 600,
                mb: 1
              }}
            >
              © 2024 PROMANAGER - Enterprise Management Solutions
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666'
              }}
            >
              Empowering businesses worldwide with intelligent automation and data-driven insights.
            </Typography>
          </Box>
        </Paper>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
    <Footer />
    </>
  );
}