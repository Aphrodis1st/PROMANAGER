import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Explore as ExploreIcon
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
      
      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Hero Section */}
        <Box textAlign="center" mb={10}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: 2
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
              mb: 4,
              fontSize: { xs: '1.8rem', md: '2.8rem' }
            }}
          >
            The Complete Digital Management Platform
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 900,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.4rem' }
            }}
          >
            A powerful all-in-one management ecosystem designed to help organizations
            streamline operations, improve decision-making, and scale efficiently.
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 1000,
              mx: 'auto',
              lineHeight: 1.7,
              mb: 6,
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            PROMANAGER integrates multiple intelligent business systems into a single
            secure cloud platform, enabling companies to manage inventory, healthcare
            operations, pharmacy services, and financial data with unmatched efficiency.
          </Typography>

          {/* Hero Benefits */}
          <Grid container spacing={3} sx={{ mb: 6, maxWidth: 1200, mx: 'auto' }}>
            {heroFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}
                >
                  <CheckIcon sx={{ color: '#4caf50', mr: 2, fontSize: 28 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {feature}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Hero Buttons */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              sx={{
                bgcolor: '#4caf50',
                py: 2,
                px: 4,
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
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                py: 2,
                px: 4,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              View Platform Demo
            </Button>
            <Button
              variant="text"
              size="large"
              startIcon={<ExploreIcon />}
              sx={{
                color: 'white',
                py: 2,
                px: 4,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Explore Solutions
            </Button>
          </Stack>
        </Box>

        {/* Platform Statistics */}
        <Paper 
          elevation={12}
          sx={{ 
            p: 6, 
            mb: 8, 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Grid container spacing={4}>
            {statistics.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900, 
                    color: '#1976d2',
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Industries We Serve */}
        <Box mb={10}>
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' }
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

          <Grid container spacing={4}>
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
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" mb={3}>
                      <Avatar
                        sx={{
                          bgcolor: industry.color,
                          width: 64,
                          height: 64,
                          mr: 3
                        }}
                      >
                        {industry.icon}
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {industry.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
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
          elevation={12}
          sx={{ 
            p: 6, 
            mb: 8, 
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#1976d2',
                    mx: { xs: 'auto', md: 0 },
                    mb: 4
                  }}
                >
                  <StockIcon sx={{ fontSize: 60 }} />
                </Avatar>
                
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
                  Stock Management System
                </Typography>
                
                <Typography variant="h6" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  The PROMANAGER Stock Management System provides a complete
                  inventory intelligence platform designed to help organizations
                  control stock levels, reduce operational costs, and prevent
                  revenue losses caused by stockouts or overstocking.
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  Through advanced automation and real-time monitoring,
                  businesses gain full visibility into procurement,
                  warehouse movement, supplier performance, and sales analytics.
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  Whether managing a single store or multiple warehouses,
                  PROMANAGER ensures accurate inventory tracking,
                  improved demand forecasting, and optimized supply chain operations.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/stock/dashboard')}
                  sx={{
                    bgcolor: '#1976d2',
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: 'none',
                    mt: 3
                  }}
                >
                  Access Stock Management
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 4, bgcolor: '#f8f9fa', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', mb: 3 }}>
                  Operational Capabilities
                </Typography>
                <List>
                  {stockCapabilities.map((capability, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={capability}
                        primaryTypographyProps={{ 
                          variant: 'body1',
                          sx: { fontWeight: 500 }
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
          elevation={12}
          sx={{ 
            p: 6, 
            mb: 8, 
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Paper elevation={4} sx={{ p: 4, bgcolor: '#f1f8e9', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#388e3c', mb: 3 }}>
                  Clinical Modules
                </Typography>
                <List>
                  {clinicalModules.map((module, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={module}
                        primaryTypographyProps={{ 
                          variant: 'body1',
                          sx: { fontWeight: 500 }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#388e3c',
                    mx: { xs: 'auto', md: 0 },
                    mb: 4
                  }}
                >
                  <HospitalIcon sx={{ fontSize: 60 }} />
                </Avatar>
                
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#388e3c' }}>
                  Hospital Management System
                </Typography>
                
                <Typography variant="h6" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  The PROMANAGER Hospital Management System is a comprehensive
                  digital healthcare platform designed to streamline clinical,
                  administrative, and financial operations within medical institutions.
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  The system integrates patient management, appointment scheduling,
                  laboratory diagnostics, pharmacy coordination, and hospital billing
                  into a single unified ecosystem.
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  By reducing paperwork and automating critical workflows,
                  healthcare professionals can focus more on patient care
                  while administrators gain full visibility into hospital performance.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/hospital/dashboard')}
                  sx={{
                    bgcolor: '#388e3c',
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: 'none',
                    mt: 3
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
            p: 6, 
            mb: 8, 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'rgba(255,255,255,0.2)',
              mx: 'auto',
              mb: 3
            }}
          >
            <SecurityIcon sx={{ fontSize: 50 }} />
          </Avatar>
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
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
          elevation={12}
          sx={{ 
            p: 6, 
            mb: 8, 
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#f57c00',
                    mx: { xs: 'auto', md: 0 },
                    mb: 4
                  }}
                >
                  <PharmacyIcon sx={{ fontSize: 60 }} />
                </Avatar>
                
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#f57c00' }}>
                  Pharmacy Services System
                </Typography>
                
                <Typography variant="h6" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  The PROMANAGER Pharmacy Services System enables pharmacies
                  and pharmaceutical distributors to operate with maximum
                  accuracy, regulatory compliance, and operational efficiency.
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  The platform simplifies prescription processing,
                  inventory management, customer orders, and compliance reporting,
                  while ensuring pharmaceutical products are tracked
                  through every stage of the supply chain.
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ color: '#666', lineHeight: 1.7 }}>
                  With integrated analytics and automation,
                  pharmacies can reduce medication errors,
                  optimize stock availability, and improve patient safety.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/pharmacy/dashboard')}
                  sx={{
                    bgcolor: '#f57c00',
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: 'none',
                    mt: 3
                  }}
                >
                  Access Pharmacy System
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 4, bgcolor: '#fff3e0', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#f57c00', mb: 3 }}>
                  Pharmacy Capabilities
                </Typography>
                <List>
                  {pharmacyCapabilities.map((capability, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={capability}
                        primaryTypographyProps={{ 
                          variant: 'body1',
                          sx: { fontWeight: 500 }
                        }}
                      />
                    </ListItem>
                  ))}
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
                  onClick={() => navigate('/stock/dashboard')}
                >
                  Stock Management
                </Button>
                <Button 
                  variant="text" 
                  sx={{ justifyContent: 'flex-start', color: '#666' }}
                  onClick={() => navigate('/hospital/dashboard')}
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
  );
}