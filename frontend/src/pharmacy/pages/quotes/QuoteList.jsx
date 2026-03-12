import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip
} from '@mui/material';

export default function QuoteList() {
  const [quotes] = useState([
    { 
      id: 1, 
      customerName: 'ABC Hospital', 
      items: 'Antibiotics, Pain Relief', 
      amount: '₹15,000', 
      status: 'Pending',
      date: '2024-01-15'
    },
    { 
      id: 2, 
      customerName: 'XYZ Clinic', 
      items: 'Vitamins, Supplements', 
      amount: '₹8,500', 
      status: 'Approved',
      date: '2024-01-14'
    },
    { 
      id: 3, 
      customerName: 'City Medical', 
      items: 'Emergency Medicines', 
      amount: '₹25,000', 
      status: 'Rejected',
      date: '2024-01-13'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quote Management
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              All Quotes
            </Typography>
            <Button variant="contained">
              Create New Quote
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quote ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>#{quote.id}</TableCell>
                    <TableCell>{quote.customerName}</TableCell>
                    <TableCell>{quote.items}</TableCell>
                    <TableCell>{quote.amount}</TableCell>
                    <TableCell>{quote.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={quote.status} 
                        color={getStatusColor(quote.status)}
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
                        Convert to Order
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