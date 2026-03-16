import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, CircularProgress, Alert
} from '@mui/material';
import hospitalService from '../../../services/hospitalService';

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching prescriptions...');
      
      // Try to fetch from hospital service first
      const data = await hospitalService.getPrescriptions();
      console.log('📋 Prescriptions fetched:', data);
      setPrescriptions(data || []);
    } catch (err) {
      console.error('❌ Error fetching prescriptions:', err);
      setError('Failed to load prescriptions');
      
      // Fallback to mock data if API fails
      setPrescriptions([
        { 
          id: 1, 
          patientName: 'John Doe', 
          doctorName: 'Dr. Smith', 
          date: '2024-01-15', 
          status: 'Pending',
          medications: 'Amoxicillin, Paracetamol'
        },
        { 
          id: 2, 
          patientName: 'Jane Smith', 
          doctorName: 'Dr. Johnson', 
          date: '2024-01-14', 
          status: 'Completed',
          medications: 'Ibuprofen, Vitamin D'
        },
        { 
          id: 3, 
          patientName: 'Bob Wilson', 
          doctorName: 'Dr. Brown', 
          date: '2024-01-13', 
          status: 'In Progress',
          medications: 'Metformin, Lisinopril'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading prescriptions...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prescription Management
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error} - Showing sample data
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              All Prescriptions ({prescriptions.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={fetchPrescriptions}>
                🔄 Refresh
              </Button>
              <Button variant="contained">
                Create New Prescription
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Prescription ID</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Medications</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>#{prescription.id}</TableCell>
                    <TableCell>{prescription.patientName}</TableCell>
                    <TableCell>{prescription.doctorName}</TableCell>
                    <TableCell>{prescription.date}</TableCell>
                    <TableCell>{prescription.medications}</TableCell>
                    <TableCell>
                      <Chip 
                        label={prescription.status} 
                        color={getStatusColor(prescription.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        View
                      </Button>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="success">
                        Process
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}