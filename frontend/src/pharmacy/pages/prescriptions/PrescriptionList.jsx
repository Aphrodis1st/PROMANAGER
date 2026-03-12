import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip
} from '@mui/material';

export default function PrescriptionList() {
  const [prescriptions] = useState([
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prescription Management
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              All Prescriptions
            </Typography>
            <Button variant="contained">
              Create New Prescription
            </Button>
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