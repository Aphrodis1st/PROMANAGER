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
  People as PatientsIcon,
  Event as AppointmentsIcon,
  LocalHospital as DoctorsIcon,
  Business as DepartmentsIcon,
  Assessment as ReportsIcon,
  Receipt as BillingIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';

export default function HospitalDashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Patient Management',
      description: 'Comprehensive patient records, history, and care management',
      icon: <PatientsIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      path: '/hospital/patients',
      stats: '2,456 Patients'
    },
    {
      title: 'Appointments',
      description: 'Schedule and manage patient appointments and consultations',
      icon: <AppointmentsIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/hospital/appointments',
      stats: '89 Today'
    },
    {
      title: 'Doctor Management',
      description: 'Manage doctors, schedules, and specializations',
      icon: <DoctorsIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/hospital/doctors',
      stats: '45 Doctors'
    },
    {
      title: 'Departments',
      description: 'Organize hospital departments and staff assignments',
      icon: <DepartmentsIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/hospital/departments',
      stats: '12 Departments'
    },
    {
      title: 'Billing & Finance',
      description: 'Handle invoicing, payments, and financial management',
      icon: <BillingIcon sx={{ fontSize: 40 }} />,
      color: '#f44336',
      path: '/hospital/billing',
      stats: '₹1.2M Revenue'
    },
    {
      title: 'Reports & Analytics',
      description: 'Comprehensive hospital reporting and analytics',
      icon: <ReportsIcon sx={{ fontSize: 40 }} />,
      color: '#607d8b',
      path: '/hospital/reports',
      stats: '25 Reports'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#4caf50' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Hospital Management System
          </Typography>
          <Button color="inherit" startIcon={<ProfileIcon />} sx={{ mr: 2 }}>
            Profile
          </Button>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={() => navigate('/hospital/login')}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Hospital Services Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Complete healthcare management solution
          </Typography>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#2196f3', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  2,456
                </Typography>
                <Typography variant="body2">
                  Total Patients
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  89
                </Typography>
                <Typography variant="body2">
                  Today's Appointments
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
                  Admitted Patients
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
                  Emergency Cases
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