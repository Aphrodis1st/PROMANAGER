import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';

export default function Pharmacies() {
  const [pharmacies] = useState([
    { id: 1, name: 'City Pharmacy', location: 'Downtown', contact: '+1234567890', status: 'Active' },
    { id: 2, name: 'Health Plus', location: 'Uptown', contact: '+1234567891', status: 'Active' },
    { id: 3, name: 'MediCare Pharmacy', location: 'Suburb', contact: '+1234567892', status: 'Inactive' },
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pharmacies Management
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Pharmacies
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#2196f3' }}>
                {pharmacies.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Pharmacies
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#4caf50' }}>
                {pharmacies.filter(p => p.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inactive Pharmacies
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#f44336' }}>
                {pharmacies.filter(p => p.status === 'Inactive').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Pharmacy List
            </Typography>
            <Button variant="contained">
              Add New Pharmacy
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy.id}>
                    <TableCell>{pharmacy.name}</TableCell>
                    <TableCell>{pharmacy.location}</TableCell>
                    <TableCell>{pharmacy.contact}</TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: pharmacy.status === 'Active' ? '#4caf50' : '#f44336',
                          fontWeight: 'bold'
                        }}
                      >
                        {pharmacy.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Delete
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