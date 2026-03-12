import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, TextField
} from '@mui/material';

export default function CallCenter() {
  const [calls] = useState([
    { 
      id: 1, 
      customerName: 'John Doe', 
      phone: '+1234567890', 
      type: 'Order Inquiry', 
      status: 'Active',
      duration: '5:23',
      agent: 'Agent 1'
    },
    { 
      id: 2, 
      customerName: 'Jane Smith', 
      phone: '+1234567891', 
      type: 'Prescription Query', 
      status: 'Completed',
      duration: '3:45',
      agent: 'Agent 2'
    },
    { 
      id: 3, 
      customerName: 'Bob Wilson', 
      phone: '+1234567892', 
      type: 'Complaint', 
      status: 'On Hold',
      duration: '8:12',
      agent: 'Agent 3'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Hold': return 'warning';
      case 'Completed': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Call Center Management
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Calls
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#4caf50' }}>
                {calls.filter(c => c.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                On Hold
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#ff9800' }}>
                {calls.filter(c => c.status === 'On Hold').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Today
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#2196f3' }}>
                {calls.filter(c => c.status === 'Completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Call Time
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#9c27b0' }}>
                5:40
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Call Queue
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField size="small" placeholder="Search calls..." />
              <Button variant="contained">
                New Call
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Call ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>#{call.id}</TableCell>
                    <TableCell>{call.customerName}</TableCell>
                    <TableCell>{call.phone}</TableCell>
                    <TableCell>{call.type}</TableCell>
                    <TableCell>{call.agent}</TableCell>
                    <TableCell>{call.duration}</TableCell>
                    <TableCell>
                      <Chip 
                        label={call.status} 
                        color={getStatusColor(call.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        Answer
                      </Button>
                      <Button size="small" variant="outlined" color="warning" sx={{ mr: 1 }}>
                        Hold
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        End
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