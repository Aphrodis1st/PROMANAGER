import React, { useState, useEffect } from 'react';
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
  IconButton,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Badge,
  Divider,
  Stack
} from '@mui/material';
import { 
  People as PatientsIcon,
  Event as AppointmentsIcon,
  LocalHospital as DoctorsIcon,
  Business as DepartmentsIcon,
  Assessment as ReportsIcon,
  Receipt as BillingIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon,
  Emergency as EmergencyIcon,
  Hotel as BedIcon,
  MedicalServices as SurgeryIcon,
  Science as LabIcon,
  AttachMoney as RevenueIcon,
  Warning as AlertIcon,
  MedicalServices,
  Notifications as NotificationIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  DirectionsCar as AmbulanceIcon,
  Healing as VentilatorIcon,
  Room as RoomIcon,
  PersonAdd as AdmissionIcon,
  PersonRemove as DischargeIcon
} from '@mui/icons-material';

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock real-time data (in production, this would come from APIs/WebSocket)
  const kpiMetrics = [
    { title: 'Total Patients', value: '2,456', icon: <PatientsIcon />, color: '#2563eb', change: '+12' },
    { title: 'Patients Today', value: '89', icon: <PatientsIcon />, color: '#16a34a', change: '+5' },
    { title: 'Admissions Today', value: '23', icon: <AdmissionIcon />, color: '#f59e0b', change: '+3' },
    { title: 'Discharges Today', value: '18', icon: <DischargeIcon />, color: '#8b5cf6', change: '-2' },
    { title: 'Emergency Cases', value: '12', icon: <EmergencyIcon />, color: '#ef4444', change: '+1' },
    { title: 'Bed Occupancy', value: '156/200', icon: <BedIcon />, color: '#06b6d4', change: '78%' },
    { title: 'Doctors On Duty', value: '45', icon: <DoctorsIcon />, color: '#10b981', change: 'Active' },
    { title: 'Surgeries Today', value: '8', icon: <SurgeryIcon />, color: '#f97316', change: '3 Active' },
    { title: 'Lab Tests Pending', value: '34', icon: <LabIcon />, color: '#84cc16', change: '-5' },
    { title: 'Revenue Today', value: '$12,540', icon: <RevenueIcon />, color: '#22c55e', change: '+8%' }
  ];

  const patientFlow = [
    { status: 'Waiting', count: 32, color: '#f59e0b' },
    { status: 'In Consultation', count: 18, color: '#3b82f6' },
    { status: 'In Surgery', count: 4, color: '#ef4444' },
    { status: 'In ICU', count: 6, color: '#dc2626' },
    { status: 'Discharged Today', count: 21, color: '#16a34a' }
  ];

  const emergencyQueue = [
    { priority: 'Critical', count: 3, color: '#dc2626' },
    { priority: 'High Priority', count: 5, color: '#f59e0b' },
    { priority: 'Medium', count: 8, color: '#3b82f6' },
    { priority: 'Low', count: 12, color: '#16a34a' }
  ];

  const criticalPatients = [
    { name: 'John D.', room: 'ICU-02', status: 'Critical', statusColor: '#dc2626' },
    { name: 'Maria K.', room: 'Ward-4', status: 'Stable', statusColor: '#16a34a' },
    { name: 'Alex T.', room: 'ICU-03', status: 'High Risk', statusColor: '#f59e0b' },
    { name: 'Sarah M.', room: 'ICU-01', status: 'Critical', statusColor: '#dc2626' }
  ];

  const departmentStats = [
    { name: 'Cardiology', patients: 23, doctors: 3, waitTime: '15 min' },
    { name: 'Pediatrics', patients: 31, doctors: 4, waitTime: '8 min' },
    { name: 'Neurology', patients: 12, doctors: 2, waitTime: '25 min' },
    { name: 'Orthopedics', patients: 18, doctors: 3, waitTime: '12 min' },
    { name: 'Radiology', patients: 40, doctors: 2, waitTime: '30 min' }
  ];

  const clinicalAlerts = [
    { type: 'Lab Results', count: 5, priority: 'medium', icon: <LabIcon /> },
    { type: 'Critical Vitals', count: 2, priority: 'high', icon: <AlertIcon /> },
    { type: 'Medication Overdue', count: 3, priority: 'medium', icon: <MedicalServices /> },
    { type: 'Surgery Starting', count: 1, priority: 'high', icon: <SurgeryIcon /> }
  ];

  const resourceStatus = [
    { resource: 'ICU Beds', available: 6, total: 12, percentage: 50 },
    { resource: 'Ventilators', available: 9, total: 15, percentage: 60 },
    { resource: 'Operating Rooms', available: 2, total: 5, percentage: 40 },
    { resource: 'Ambulances', available: 4, total: 6, percentage: 67 }
  ];

  const appointmentStats = {
    total: 89,
    completed: 43,
    waiting: 22,
    cancelled: 4,
    rescheduled: 5
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: '#2563eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Hospital Management System
          </Typography>
          <Typography variant="body1" sx={{ mr: 3 }}>
            {currentTime.toLocaleString()}
          </Typography>
          <Badge badgeContent={8} color="error">
            <IconButton color="inherit">
              <NotificationIcon />
            </IconButton>
          </Badge>
          <Button color="inherit" startIcon={<ProfileIcon />} sx={{ ml: 2 }}>
            Dr. Admin
          </Button>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={() => navigate('/hospital/login')}
            sx={{ ml: 1 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Hospital Overview Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
            Hospital Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Real-time hospital operations and patient management overview
          </Typography>
        </Box>

        {/* KPI Metrics Grid */}
        <Grid container spacing={3} mb={4}>
          {kpiMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar sx={{ bgcolor: metric.color, width: 48, height: 48 }}>
                      {metric.icon}
                    </Avatar>
                    <Chip 
                      label={metric.change} 
                      size="small" 
                      sx={{ 
                        bgcolor: metric.change.includes('+') ? '#dcfce7' : '#fef3c7',
                        color: metric.change.includes('+') ? '#16a34a' : '#f59e0b',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {metric.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Dashboard Content */}
        <Grid container spacing={3}>
          {/* Patient Flow Monitoring */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <TrendingIcon sx={{ mr: 1, color: '#3b82f6' }} />
                  Patient Flow Monitoring
                </Typography>
                <Stack spacing={2}>
                  {patientFlow.map((flow, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {flow.status}
                      </Typography>
                      <Chip 
                        label={flow.count} 
                        sx={{ 
                          bgcolor: `${flow.color}20`,
                          color: flow.color,
                          fontWeight: 700,
                          minWidth: 50
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Emergency Queue */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <EmergencyIcon sx={{ mr: 1, color: '#ef4444' }} />
                  Emergency Queue
                </Typography>
                <Stack spacing={2}>
                  {emergencyQueue.map((queue, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: queue.color, 
                            mr: 2 
                          }} 
                        />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {queue.priority}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: queue.color }}>
                        {queue.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Critical Patients Monitoring */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <AlertIcon sx={{ mr: 1, color: '#ef4444' }} />
                  Critical Patients Monitoring
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Room</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {criticalPatients.map((patient, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{patient.name}</TableCell>
                          <TableCell>{patient.room}</TableCell>
                          <TableCell>
                            <Chip 
                              label={patient.status} 
                              size="small"
                              sx={{ 
                                bgcolor: `${patient.statusColor}20`,
                                color: patient.statusColor,
                                fontWeight: 600
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" sx={{ mr: 1 }}>View</Button>
                            <Button size="small" variant="contained" color="primary">Monitor</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Clinical Alerts */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <NotificationIcon sx={{ mr: 1, color: '#f59e0b' }} />
                  Clinical Alerts
                </Typography>
                <Stack spacing={2}>
                  {clinicalAlerts.map((alert, index) => (
                    <Alert 
                      key={index}
                      severity={alert.priority === 'high' ? 'error' : 'warning'}
                      icon={alert.icon}
                      sx={{ 
                        '& .MuiAlert-message': { 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          width: '100%'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {alert.type}
                        </Typography>
                        <Chip 
                          label={alert.count} 
                          size="small" 
                          color={alert.priority === 'high' ? 'error' : 'warning'}
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>
                    </Alert>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Performance */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <DepartmentsIcon sx={{ mr: 1, color: '#8b5cf6' }} />
                  Department Performance
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Patients</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Doctors</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Wait Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departmentStats.map((dept, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{dept.name}</TableCell>
                          <TableCell>
                            <Chip label={dept.patients} size="small" color="primary" />
                          </TableCell>
                          <TableCell>
                            <Chip label={dept.doctors} size="small" color="success" />
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: parseInt(dept.waitTime) > 20 ? '#ef4444' : '#16a34a',
                                fontWeight: 600
                              }}
                            >
                              {dept.waitTime}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Resource Monitoring */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <RoomIcon sx={{ mr: 1, color: '#06b6d4' }} />
                  Hospital Resources
                </Typography>
                <Stack spacing={3}>
                  {resourceStatus.map((resource, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {resource.resource}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {resource.available}/{resource.total}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={resource.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: resource.percentage > 70 ? '#16a34a' : resource.percentage > 40 ? '#f59e0b' : '#ef4444'
                          }
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointment Overview */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1, color: '#3b82f6' }} />
                  Appointments Today
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {appointmentStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Appointments
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#dcfce7' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                        {appointmentStats.completed}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#16a34a' }}>
                        Completed
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fef3c7' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        {appointmentStats.waiting}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                        Waiting
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fee2e2' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>
                        {appointmentStats.cancelled}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ef4444' }}>
                        Cancelled
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e0e7ff' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                        {appointmentStats.rescheduled}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#3b82f6' }}>
                        Rescheduled
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Financial Overview */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <RevenueIcon sx={{ mr: 1, color: '#22c55e' }} />
                  Financial Overview
                </Typography>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Today's Revenue</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>$12,540</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Insurance Payments</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>$8,200</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Pending Bills</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>$3,200</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Pharmacy Sales</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#8b5cf6' }}>$2,100</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Lab Revenue</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#06b6d4' }}>$1,800</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Insurance Claims</Typography>
                    <Chip label="18 Pending" color="warning" sx={{ fontWeight: 600 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Access Modules */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
            Quick Access Modules
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Patient Management', path: '/hospital/patients', icon: <PatientsIcon />, color: '#2563eb' },
              { title: 'Appointments', path: '/hospital/appointments', icon: <AppointmentsIcon />, color: '#16a34a' },
              { title: 'Emergency', path: '/hospital/emergency', icon: <EmergencyIcon />, color: '#ef4444' },
              { title: 'Laboratory', path: '/hospital/lab', icon: <LabIcon />, color: '#f59e0b' },
              { title: 'Billing', path: '/hospital/billing', icon: <BillingIcon />, color: '#8b5cf6' },
              { title: 'Reports', path: '/hospital/reports', icon: <ReportsIcon />, color: '#06b6d4' }
            ].map((module, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      borderColor: module.color
                    }
                  }}
                  onClick={() => navigate(module.path)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: module.color, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      {module.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {module.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}